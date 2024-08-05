/* eslint-disable no-unused-vars */
import React from 'react';
import './Stats.css';

// eslint-disable-next-line react/prop-types
export default function Stats({wpm, accuracy}) {
  return (
    <div className='stats-typing'>
      <p>Stats</p>
      <p>WPM: {wpm}</p>
      <p>Accuracy: {accuracy}%</p>
    </div>
  )   
}