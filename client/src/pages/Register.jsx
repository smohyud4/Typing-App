/* eslint-disable no-unused-vars */
import React from 'react';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaEye } from "react-icons/fa";
import './Form.css';


export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [typeReveal, setTypeReveal] = useState('password');
  const navigate = useNavigate();

  function validatePassword(password) {
    return password.length >= 8;
  }

  function revealPassword(event) {
    event.preventDefault();
    setTypeReveal(typeReveal === 'password' ? 'text' : 'password');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      if (!validatePassword(password)) {
        setError('Password must be at least 8 characters long');
        return;
      }
      const response = await axios.post('http://localhost:5000/register', {email, password});
      console.log(response.data);
      if (response.data.error) {
        setError(response.data.error);
        return;
      }
      setEmail('');
      setPassword('');
      navigate('/login');
    }
    catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='container-form'>
      <div className='wrapper'>
        <form onSubmit={handleSubmit}>
          <h1>Register</h1>
          <div className='input-box'>
            <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
            <FaUser className='icon'/>
          </div>
          <div className='input-box'>
            <input type={typeReveal} placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
            <button onClick={revealPassword} className='icon-button'><FaEye className='icon'/></button>
          </div>
          {error && <p>{error}</p>}
          <button type='submit'>Sign Up</button>
        </form>
      </div>
    </div>
  )
}