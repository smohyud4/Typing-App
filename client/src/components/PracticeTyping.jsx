/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {useState, useEffect, useCallback, useRef} from 'react';
import Stats from './Stats';
import TypingInput from './TypingInput';
import './Typing.css';


function calculateWPM(start, end, totalChars) {
  const elapsedTimeInMinutes = (end - start) / 1000 / 60; // Convert milliseconds to minutes
  const totalWords = totalChars / 5; // Approximate words by dividing total characters by 5
  const wpm = totalWords / elapsedTimeInMinutes;
  return wpm; // Round to the nearest integer
}

function validateInput(key1, key2) {
    
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-;':,.<>/? ";

    if (key1 == '' || key2 == '') 
        return "Characters must not be empty";

    if (key1.toLowerCase() === key2.toLowerCase()) 
        return "Characters must be distinct";

    if (!characters.includes(key1) || !characters.includes(key2)) 
        return "Characters must be found in " + characters;
    
    return "None";
}

function generateText(key1, key2, capitals) {
    let str = "";
    const words = Math.floor(Math.random() * 6) + 15;

    for (let i = 0; i < words; i++) {
      const length = Math.floor(Math.random() * 4) + 2;
      
      for (let j = 0; j < length; j++) {
        if (Math.random() < 0.5) 
          j === 0 && capitals ? str += key1.toUpperCase() : str += key1;
        else 
          j === 0 && capitals ? str += key2.toUpperCase() : str += key2;
      }

      str += " ";
    }

    return str.trim();
}

// eslint-disable-next-line react/prop-types
export default function PracticeTyping() {

  const [inputData, setInputData] = useState({key1: '', key2: '', error: '', capitals: false}); 
  const [inProgress, setInProgress] = useState(false);
  const [statShow, setStatShow] = useState(false);
  const [text, setText] = useState([]);
  const [currWpm, setCurrWpm] = useState(0);
  const [currAccuracy, setCurrAccuracy] = useState(0);

  const [startTime, setStartTime] = useState(null);
  const [charAccuracies, setCharAccuracies] = useState({});

  const startTimeRef = useRef(null);
  const pointerRef = useRef(0);
  const correctRef = useRef(false);
  const wrongRef = useRef(0);

  function updateWPM() {
    const currentTime = new Date();
    const charactersTyped = pointerRef.current; // Use the ref value
    const wpm = calculateWPM(startTimeRef.current, currentTime, charactersTyped);
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

  function startGame() {
    const error = validateInput(inputData.key1, inputData.key2);
    if (error == "None") {
      let temp = {};
      
      temp[inputData.key1] = {correct: 0, total: 0};
      temp[inputData.key2] = {correct: 0, total: 0};
      temp[' '] = {correct: 0, total: 0};

      if (inputData.capitals) {
        temp[inputData.key1.toUpperCase()] = {correct: 0, total: 0};
        temp[inputData.key2.toUpperCase()] = {correct: 0, total: 0};
      }

      setCharAccuracies(temp); 

      setInProgress(true);
      setStatShow(false);
      setInputData({...inputData, error: ''});

      const array = Array.from(generateText(inputData.key1, inputData.key2, inputData.capitals));
      setText(array.map((char, index) => {
        if (index == 0) return { character: char, currState: 'current'};
        return { character: char, currState: ''}
      }))
    }
    else {
      setInputData({...inputData, error: error});
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

    if (!startTimeRef.current) {
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
      console.log('pointerRef', pointerRef.current);
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
      <TypingInput data={inputData} setData={setInputData} />
      <main className='container-typing'>
      {!statShow ? (
        <div className='wrapper-typing'>
          {text.map((element, index) => (
            <span key={index} id={index.toString()} className={element.currState}>
              {element.character}
            </span>
          ))}
          <br/>
          <br/> 
          <p>WPM: {Math.round(currWpm)}</p>
          <p>Accuracy: {currAccuracy.toFixed(2)}%</p>
        </div>
      ) : (
        <Stats wpm={Math.round(currWpm)} accuracy={currAccuracy.toFixed(2)}/>
      )}
      </main>
      {!inProgress && <button id='start-button' onClick={startGame}>Play</button>}
      {Object.entries(charAccuracies).map(([char, data]) => (
        <div className='accuracies' key={char}>
          <p>Character: {char}</p>
          <p>Correct: {data.correct}</p>
          <p>Total: {data.total}</p>
        </div>
      ))}
    </>
  );
} 