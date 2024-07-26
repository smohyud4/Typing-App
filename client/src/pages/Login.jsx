/* eslint-disable no-unused-vars */
import React from 'react';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaEye } from "react-icons/fa";
import './Form.css';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [typeReveal, setTypeReveal] = useState('password');
  const navigate = useNavigate();

  function revealPassword(event) {
    event.preventDefault();
    setTypeReveal(typeReveal === 'password' ? 'text' : 'password');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {email, password});
      if (response.data.error) {
        setError(response.data.error);
        return;
      }
      const token = response.data.token;
      setEmail('');
      setPassword('');
      navigate('/account');
      window.location.reload();
      localStorage.setItem('token', token);
    }
    catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='container-form'>
      <div className='wrapper'>
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className='input-box'>
            <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
            <FaUser className='icon'/>
          </div>
          <div className='input-box'>
            <input type={typeReveal} placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
            <button onClick={revealPassword} className='icon-button'><FaEye className='icon'/></button>
          </div>
          {error && <p>{error}</p>}
          <button type='submit'>Sign In</button>
        </form>
     </div>
   </div>
  )
}