/* eslint-disable no-unused-vars */
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Logout } from '../pages/Login';
import './NavBar.css';

// eslint-disable-next-line react/prop-types
export default function Navbar({isUserSignedIn}) {

  const navigate = useNavigate();

  function handleSignOut() {
    Logout();
    navigate('../login');
  }

  return (
    <nav className="nav">
        <h1><a href='/'>KeyType</a></h1>
        <ul>
            {isUserSignedIn ? (
                <>
                <li><a href='/race'>Type</a></li>
                <li><a href='/practice'>Practice</a></li>
                <li><a href='/account'>Account</a></li>
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