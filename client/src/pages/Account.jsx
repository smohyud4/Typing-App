/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar/NavBar';
import './Account.css';

export default function Account() {
  const [auth, setAuth] = useState(false);
  const [error, setError] = useState('');
 
  const [data, setData] = useState({
    races: '', 
    WPM: '',
    bestWPM: '',
    accuracy: '',
    user: '',
    charAccuracies: ''
  });

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await axios.get('http://localhost:5000/account', {withCredentials: true});
        if (response.data.error) {
          setAuth(false);
          setError(response.data.error);
          return;
        }

        console.log(response.data);
        setData(response.data);
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
        <div className='auth'>
          <h1>Account</h1>
          <h2>Welcome, {data.user}</h2>
          <h3>Races: {data.races} </h3>
          <h3>Average WPM: {data.races === 0 ? 0 : Math.round(data.WPM / data.races)} </h3>
          <h3>Best WPM: {Math.round(data.bestWPM)} </h3>
          <h3>Accuracy: {data.races === 0 ? 0 : (data.accuracy / data.races).toFixed(2)}</h3>
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