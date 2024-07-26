/* eslint-disable no-unused-vars */
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';

export default function Navbar() {
    const isUserSignedIn = !!localStorage.getItem('token');
    const navigate = useNavigate();

    function handleSignOut() {
        localStorage.removeItem('token');
        navigate('/login');
    }

  return (
    <nav className="nav">
        <h1><a href='/'>KeyType</a></h1>
        <ul>
            {isUserSignedIn ? (
                <>
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