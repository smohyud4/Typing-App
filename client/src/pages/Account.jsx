/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Logout } from './Login';
import NavBar from '../components/NavBar';

export default function Account() {
  const [auth, setAuth] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState('');

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
        setUser(response.data.user);
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
      <NavBar isUserSignedIn={auth} logOut={Logout}/>
      {
        auth ?
        <div>
          <h1>Account</h1>
          <h2>Welcome, {user}</h2>
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