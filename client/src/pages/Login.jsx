/* eslint-disable no-unused-vars */
import React from 'react';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from '../components/NavBar/NavBar';
import './Form.css';


function Login() {
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
      const response = await axios.post('http://localhost:5000/login', {email, password}, {withCredentials: true});
      if (response.data.error) {
        setError(response.data.error);
        return;
      }

      setEmail('');
      setPassword('');
      navigate('/account');
    }
    catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Navbar isUserSignedIn={false}/>
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
                <button onClick={revealPassword} className='icon-button'>
                  {typeReveal === 'password' ? <FaEyeSlash className='icon'/> : <FaEye className='icon'/>}
                </button>
              </div>
              {error && <p>{error}</p>}
              <div className='input-box'>
                <button className='submit-button' type='submit'>Sign In</button>
              </div>
            </form>
        </div>
      </div>
    </>
  )
}

async function Logout() {
  try {
    await axios.get('http://localhost:5000/logout', {withCredentials: true});
  }
  catch (error) {
    console.log(error);
  }
}

export default Login;
export {Logout};