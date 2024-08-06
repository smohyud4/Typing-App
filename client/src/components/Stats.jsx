/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import './Stats.css';

export default function Stats({ wpm, accuracy, charsTyped, mistakes }) {
  const [displayWpm, setDisplayWpm] = useState(0);
  const [displayAccuracy, setDisplayAccuracy] = useState(0);
  const [displayCharsTyped, setDisplayCharsTyped] = useState(0);
  const [displayMistakes, setDisplayMistakes] = useState(0);

  useEffect(() => {
    let wpmIncrement = wpm / 40; // Adjust the division to control speed
    let accuracyIncrement = accuracy / 40;
    let charsTypedIncrement = charsTyped / 40;
    let mistakesIncrement = mistakes / 40;

    let interval = setInterval(() => {
      setDisplayWpm(prev => Math.min(prev + wpmIncrement, wpm));
      setDisplayAccuracy(prev => Math.min(prev + accuracyIncrement, accuracy));
      setDisplayCharsTyped(prev => Math.min(prev + charsTypedIncrement, charsTyped));
      setDisplayMistakes(prev => Math.min(prev + mistakesIncrement, mistakes));
    }, 20); // Adjust the interval time to control speed

    return () => clearInterval(interval);
  }, [wpm, accuracy, charsTyped, mistakes]);

  return (
    <div className='stats-typing'>
      <p>Stats</p>
      <p>WPM: {Math.round(displayWpm)}</p>
      <p>Accuracy: {displayAccuracy.toFixed(2)}%</p>
      <p>Characters Typed: {Math.round(displayCharsTyped)}</p>
      <p>Mistakes: {Math.round(displayMistakes)}</p>
    </div>
  );
}
