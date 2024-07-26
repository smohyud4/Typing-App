/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {useState, useEffect} from 'react';
import './Typing.css';

const TEXTS = [
    "There once was a man from nantucket.",
    "The quick brown fox jumps over the lazy dog.",
    "lksjd foisjfsnadfsodifmweoif wehfisdfjosdkfj asudfh d78w:",
    "My sister's cat is very fat",
    "I hope all is going well. I look forward to improving my writing skills in this class. My writing abilities have certainly grown vastly over the years.",
    "The AI-powered code completion tool GitHub Copilot generated over 82 billion lines of code within its first year.",
    "Artificial Intelligence has profoundly influenced our everyday lives, and this influence continues to expand.",
    "I like trweash",
    "What is the difference between right and wrong? Good and evil? Do these concepts exist on a spectrum? A powerful tool that can help guide these questions is ethics. At its core, ethics encompasses all facets of society, dictating what humans ought to do. For example, ethics provide the standards that impose reasonable obligations from common vices such as rape, stealing, murder, assault, slander, and fraud. These standards also include those that enjoin common virtues such as honesty, compassion, and loyalty",
    "While ethics has countless philosophical systems and implications that affect everyday life, its practical influence within the professional field cannot be understated.",
    "CAPS 097DFHILSD.SDFU 89UWKJ D,MF 09U3IHF.  KDJFL",
    "You can suggest a new statistic by reaching out to the WCA Software Team. If it's widely interesting and feasible to implement, we might add it!"   
];


export default function Typing() {

  const [inProgress, setInProgress] = useState(false);
  const [text, setText] = useState([]);
  const [currWpm, setCurrWpm] = useState(0);
  const [currAccuracy, setCurrAccuracy] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [pointer, setPointer] = useState(0);
  const [correct, setCorrect] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    // Choose a random text from TEXTS and set it to state
    const selectedText = TEXTS[Math.floor(Math.random() * TEXTS.length)];
    const textArray = Array.from(selectedText);
    const converted = textArray.map(char => ({ character: char, currState: ''}));
    setText(converted);
  }, []);

  useEffect(() => {
    const handleKeyDownWrapper = (event) => handleKeyDown(event);
    document.addEventListener('keydown', handleKeyDownWrapper, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDownWrapper, true);
    };
  }, [pointer, inProgress]);

  function startGame() {
    setInProgress(true);
  }

  function resetGame() {

 
  } 

  function handleKeyDown(event) {
    event.preventDefault(); // Make sure you don't scroll down with a space
    const key = event.key;
    const shiftPressed = event.shiftKey;

    if (!startTime) setStartTime(Date.now());

    let newText = [...text];
    let char = newText[pointer];

    if (key === text[pointer].character) {
      char.currState = "correct";
      setCorrect(false);
   
      if (pointer !== text.length - 1) {
        setPointer((prev) => {
            let newPointer = prev + 1;
            let accuracy = (((newPointer-wrong) / newPointer) * 100);
            setCurrAccuracy(accuracy);
            newText[newPointer].currState = "current";
            return newPointer;
        });
      }
      else {
        resetGame();
      }

    }
    else if (!shiftPressed) {
        if (!correct) {
            setWrong(wrong + 1);
            setCorrect(true);
        }
        char.currState = "incorrect";
    }

    setText(newText);
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
      {!inProgress && <button id='start-button' onClick={startGame}>Start</button>}
    </>
  );
} 