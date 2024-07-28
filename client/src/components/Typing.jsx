/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {useState, useEffect, useCallback, useRef} from 'react';
import './Typing.css';

const TEXTS = [
    "There once was a man from nantucket.",
    "The quick brown fox jumps over the lazy dog.",
    "This is a test",
    "My sister's cat is very fat",
    "I hope all is going well. I look forward to improving my writing skills in this class. My writing abilities have certainly grown vastly over the years.",
    "The AI-powered code completion tool GitHub Copilot generated over 82 billion lines of code within its first year.",
    "Artificial Intelligence has profoundly influenced our everyday lives, and this influence continues to expand.",
    "I like trweash",
    "What is the difference between right and wrong? Good and evil? Do these concepts exist on a spectrum? A powerful tool that can help guide these questions is ethics. At its core, ethics encompasses all facets of society, dictating what humans ought to do. For example, ethics provide the standards that impose reasonable obligations from common vices such as rape, stealing, murder, assault, slander, and fraud. These standards also include those that enjoin common virtues such as honesty, compassion, and loyalty",
    "While ethics has countless philosophical systems and implications that affect everyday life, its practical influence within the professional field cannot be understated.",
    "What sha'll we do with the drunken sailor?",
    "You can suggest a new statistic by reaching out to the WCA Software Team. If it's widely interesting and feasible to implement, we might add it!"   
]; 

/*const TEXTS = [
  "123456789",
  "abcdefg",
  "aaaj"
]; */

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()~,.?:;'-/ ";

function calculateWPM(start, end, totalChars) {
  const elapsedTimeInMinutes = (end - start) / 1000 / 60; // Convert milliseconds to minutes
  const totalWords = totalChars / 5; // Approximate words by dividing total characters by 5
  const wpm = totalWords / elapsedTimeInMinutes;
  return wpm; // Round to the nearest integer
}


export default function Typing() {

  const [inProgress, setInProgress] = useState(false);
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

    let temp = {};
    for (const char of characters) {
      temp[char] = {correct: 0, total: 0};
    }
    setCharAccuracies(temp);

  }, []);

  useEffect(() => {
    // Choose a random text from TEXTS and set it to state
    if (!inProgress) {
      const selectedText = TEXTS[Math.floor(Math.random() * TEXTS.length)];
      const textArray = Array.from(selectedText);
      const converted = textArray.map(char => ({ character: char, currState: ''}));
      setText(converted);
    }

  }, [inProgress]);

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

  function resetGame() {
    setInProgress(false);
    startTimeRef.current = null;
    pointerRef.current = 0;
    correctRef.current = false;
    setStartTime(null);
   
    wrongRef.current = 0;
  } 

  function handleKeyDown(event) {
    event.preventDefault(); // Make sure you don't scroll down with a space
    const key = event.key;
    const shiftPressed = event.shiftKey;

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
    else if (!shiftPressed) {
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
      <h1>Typing</h1>
      <div className='container-typing'>
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
      </div>
      {!inProgress && <button id='start-button' onClick={() => setInProgress(true)}>Start</button>}
      {Object.entries(charAccuracies).map(([char, data]) => (
        data.total > 0 &&
        <div className='accuracies' key={char}>
          <p>Character: {char}</p>
          <p>Total: {data.correct}</p>
          <p>Correct: {data.total}</p>
        </div>
      ))}
    </>
  );
} 

