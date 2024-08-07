/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { SlSpeedometer  } from "react-icons/sl";
import { PiTargetLight } from "react-icons/pi";
import { RiCharacterRecognitionLine } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";
import './Stats.css';

export default function Stats({ wpm, accuracy, charsTyped, mistakes }) {
  const [displayWpm, setDisplayWpm] = useState(0);
  const [displayAccuracy, setDisplayAccuracy] = useState(0);
  const [displayCharsTyped, setDisplayCharsTyped] = useState(0);
  const [displayMistakes, setDisplayMistakes] = useState(0);

  useEffect(() => {
    let wpmIncrement = wpm / 50; // Adjust the division to control speed
    let accuracyIncrement = accuracy / 50;
    let charsTypedIncrement = charsTyped / 50;
    let mistakesIncrement = mistakes / 50;

    let interval = setInterval(() => {
      setDisplayWpm(prev => Math.min(prev + wpmIncrement, wpm));
      setDisplayAccuracy(prev => Math.min(prev + accuracyIncrement, accuracy));
      setDisplayCharsTyped(prev => Math.min(prev + charsTypedIncrement, charsTyped));
      setDisplayMistakes(prev => Math.min(prev + mistakesIncrement, mistakes));
    }, 20); // Adjust the interval time to control speed

    return () => clearInterval(interval);
  }, [wpm, accuracy, charsTyped, mistakes]);

  return (
    <>
      <article className="card">
        <header className="card-header">
         <SlSpeedometer className="stat-icon"/>
         <h2>WPM: {Math.round(displayWpm)}</h2>
        </header>
        <header className="card-header">
         <PiTargetLight className="stat-icon"/>
         <h2>Accuracy: {displayAccuracy.toFixed(2)}%</h2>
        </header>
        <header className="card-header">
         <RiCharacterRecognitionLine className="stat-icon"/>
         <h2>Characters Typed: {Math.round(displayCharsTyped)}</h2>
        </header>
        <header className="card-header">
         <RxCross1 className="stat-icon"/>
         <h2>Mistakes: {Math.round(displayMistakes)}</h2>
        </header>
      </article>
    </>
  );
}


/*<div className='stats-typing'>
<p>Stats</p>
<p>WPM: {Math.round(displayWpm)}</p>
<p>Accuracy: {displayAccuracy.toFixed(2)}%</p>
<p>Characters Typed: {Math.round(displayCharsTyped)}</p>
<p>Mistakes: {Math.round(displayMistakes)}</p>
</div>*/