/* eslint-disable no-unused-vars */
import React from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NavBar.css';

// eslint-disable-next-line react/prop-types
export default function Navbar({isUserSignedIn, user}) {

  const navigate = useNavigate();

  async function handleSignOut() {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      await axios.get(`${apiUrl}/logout`, {withCredentials: true});
      navigate('../login');
    }
    catch (error) {
      console.log(error);
    }
  }

  return (
    <nav className="nav">
        <h1><a href={isUserSignedIn ? '/race' : '/'}>KeyType</a></h1>
        <ul>
            {isUserSignedIn ? (
                <>
                <li><a href='/account'>Welcome, {user}</a></li>
                <li><a href='/race'>Race</a></li>
                <li><a href='/practice'>Practice</a></li>
                <li><button onClick={handleSignOut}>Sign Out</button></li>
                </>
            ) : (
                <>
                <li><a href='/login'>Login</a></li>
                <li><a href='/register'>Sign up</a></li>
                </>
            )}
        </ul>
    </nav>
  )
}