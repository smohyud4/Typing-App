/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react';
import Typing from '../components/Typing/Typing';
import axios from 'axios';
import NavBar from '../components/NavBar/NavBar';


export default function Race() {
  const [auth, setAuth] = useState(false);
  const [error, setError] = useState('');
 
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await axios.get('http://localhost:5000/authorize', {withCredentials: true});
        if (response.data.error) {
          setAuth(false);
          setError(response.data.error);
          return;
        }

        setAuth(true);
      }
      catch {
        setAuth(false);
      }
    }
    checkAuth();
  }, []);  


  return (
    <>
      <NavBar isUserSignedIn={auth}/>
      {
        auth ?
        <div>
          <h1>Home</h1>
          <Typing isUserSignedIn={auth}/>
        </div>
        :
        <div>
          <h1>{error}</h1>
          <h1>Unauthorized</h1>
        </div>
      }
    </>
  )
} 