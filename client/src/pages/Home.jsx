/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar/NavBar';
import Typing from '../components/Typing/Typing';
import Footer from '../components/Footer/Footer';



export default function Home() {
  
  return (
    <>
      <NavBar isUserSignedIn={false}/>
      <main>
        <br/>
        <Typing isUserSignedIn={false}/>
      </main>
    </>
  ) 
}
