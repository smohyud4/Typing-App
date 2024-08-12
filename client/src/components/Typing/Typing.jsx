/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {useState, useEffect, useRef} from 'react';
import {getGameText, calculateWPM} from '../../utils/typing'
import axios from 'axios';
import Stats from '../Stats/Stats';
import './Typing.css';


const characters = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()[]{}_+=-;':,.<>/?" `;

// eslint-disable-next-line react/prop-types
export default function Typing({isUserSignedIn}) {

  const [inProgress, setInProgress] = useState(false);
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [statShow, setStatShow] = useState(false);
  const [text, setText] = useState("Press start to play!".split('').map(char => ({character: char, currState: ''})));
  const [currWpm, setCurrWpm] = useState(0);

  
  const [currAccuracy, setCurrAccuracy] = useState(0);

  const [startTime, setStartTime] = useState(null);
  const [charAccuracies, setCharAccuracies] = useState({});

  const startTimeRef = useRef(null);
  const pointerRef = useRef(0);
  const correctRef = useRef(false);
  const wrongRef = useRef(0);
  const wpmHistoryRef = useRef([{name: 0, WPM: 0, "WPM/s": 0 }]);

  function updateWPM() {
    const currentTime = new Date();
    const charactersTyped = pointerRef.current; // Use the ref value
    const wpm = calculateWPM(startTimeRef.current, currentTime, charactersTyped);
    wpmHistoryRef.current.push({
      name: wpmHistoryRef.current.length, 
      WPM: wpm, 
      "WPM/s": wpm-wpmHistoryRef.current[wpmHistoryRef.current.length-1].WPM
    });
    setCurrWpm(wpm);
  } 

  function updateCharAccuracies(char, correct) {
    setCharAccuracies(prev => {
      const newCharAccuracies = {...prev};
      let charData = newCharAccuracies[char];
      if (correct) {
        charData.correct += 1;
        charData.total += 1;
      }
      else {
        charData.correct -= 1;
      }
      return newCharAccuracies;
    });
  }

  useEffect(() => {

    async function uploadStats() {
      try {
        const chars = Object.entries(charAccuracies).filter(([_, data]) => data.total > 0);
        console.log(chars);
        const response = await axios.patch('http://localhost:5000/race', {currWpm, currAccuracy, chars}, {withCredentials: true});

        if (response.data.error) {
          console.log(response.data.error);
          return;
        }

        setStatsLoaded(true);
      }
      catch (error) {
        console.log(error);
      }
    }

    if (statShow && isUserSignedIn) uploadStats();    

  }, [statShow]);

  useEffect(() => {
    const handleKeyDownWrapper = (event) => handleKeyDown(event);
    if (inProgress) document.addEventListener('keydown', handleKeyDownWrapper, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDownWrapper, true);
    };
  }, [pointerRef, inProgress]);

  useEffect(() => {
    if (inProgress) {
      const intervalId = setInterval(updateWPM, 1000);
      //console.log('intervalId', intervalId);
      return () => clearInterval(intervalId);
    }
  }, [startTime]); 
  
  async function fetchText() {
    try {
      
      const response = await axios.get('http://localhost:5000/random-text');
      if (response.data.error) {
        console.log(response.data.error);
        setText(getGameText());
        return;
      }
      const text = response.data.text;
      console.log(text);
      const textArray = Array.from(text);
      const converted = textArray.map((char, index) => {
        if (index === 0) return { character: char, currState: 'current'};
        return { character: char, currState: ''}
      });
      setText(converted);
    }
    catch (error) {
      console.log(error);
      setText(getGameText());
    }
  }

  function init() {
    const temp = {};
    for (const char of characters) {
      temp[char] = {correct: 0, total: 0};
    }
    setCharAccuracies(temp);
    setCurrWpm(0);
    setCurrAccuracy(0);
    setInProgress(true);
    setStatsLoaded(false);
    wpmHistoryRef.current = [{name: 0, WPM: 0, "WPM/s": 0}];
    if (!isUserSignedIn) {
      setStatShow(false);
      const newText = getGameText();
      setText(newText);
    }
  }

  function startGame() {
    if (!isUserSignedIn) { 
      init();
    }
    else {
      setStatShow(false);
      setText("Loading...".split('').map(char => ({character: char, currState: ''})));
      fetchText().then(() => {
        init();
      }).catch((error) => {
        console.error('Error:', error);
      });
    }
  }

  function resetGame() {
    setInProgress(false);
    startTimeRef.current = null;
    pointerRef.current = 0;
    correctRef.current = false;
    wrongRef.current = 0;
    setStartTime(null);
    setStatShow(true);
  } 

  function handleKeyDown(event) {
    event.preventDefault(); // Make sure you don't scroll down with a space
    const key = event.key;

    if (!startTimeRef.current && key !== "Shift") {
      const now = new Date();
      console.log(now);
      startTimeRef.current = now;
      setStartTime(now);
    }

    let newText = [...text];
    let char = newText[pointerRef.current];

    if (key === text[pointerRef.current].character) {
      char.currState = "correct";
     
      updateCharAccuracies(key, true);
   
      correctRef.current = false;
      pointerRef.current += 1;
      let accuracy = (((pointerRef.current-wrongRef.current) / pointerRef.current) * 100);
      setCurrAccuracy(accuracy);

      if (pointerRef.current < text.length) {
        newText[pointerRef.current].currState = "current";
        setText(newText);
      }
      else {
        const newEndTime = new Date();
        const wpm = calculateWPM(startTimeRef.current, newEndTime, pointerRef.current);
        setCurrWpm(wpm);
        wpmHistoryRef.current.push({name: wpmHistoryRef.current.length, WPM: wpm, "WPM/s": 0});
        resetGame();
      }
    
    }
    else if (key !== "Shift") {
        if (!correctRef.current) {
            wrongRef.current += 1;
            correctRef.current = true;
            updateCharAccuracies(char.character, false);
        }

        char.currState = "incorrect";
        setText(newText);
    }
  }


  return (
    <>
      <div className='container-typing'>
      {!statShow ? (
        <div className='wrapper-typing'>
          {text.map((element, index) => (
            <span key={index} id={index.toString()} className={element.currState}>
              {element.character}
            </span>
          ))}
          <hr/> 
          <p>WPM: {Math.round(currWpm)}</p>
          <p>Accuracy: {currAccuracy.toFixed(2)}%</p>
        </div>
      ) : (
        statsLoaded || !isUserSignedIn ? (
          <Stats 
            wpm={currWpm} 
            accuracy={currAccuracy} 
            charsTyped={text.length} 
            mistakes={text.length-text.length*(currAccuracy/100)}
            data={wpmHistoryRef.current}
          >
          </Stats>
        ) : (
          <div className="loader"></div>
        )
      )}
      </div>
      {!inProgress && <button id='start-button' onClick={startGame}>Play</button>}
    </>
  );
} 

/*

{Object.entries(charAccuracies).map(([char, data]) => (
        data.total > 0 &&
        <div className='accuracies' key={char}>
          <p>Character: {char}</p>
          <p>Correct: {data.correct}</p>
          <p>Total: {data.total}</p>
        </div>
      ))}

*/