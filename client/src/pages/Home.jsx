/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react';
import NavBar from '../components/NavBar';
import Typing from '../components/Typing';


export default function Home() {
  return (
    <>
      <NavBar isUserSignedIn={false}/>
      <div>
        <h1>Home</h1>
        <Typing/>
      </div>
    </>
  ) 
}
