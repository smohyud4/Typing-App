/* eslint-disable no-unused-vars */
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Navbar from '../components/NavBar/NavBar';
import Footer from '../components/Footer/Footer';
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

  function handleChange(event) {
    const {name, value} = event.target
    setError('');
    name === 'email' ? setEmail(value) : setPassword(value);
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
              <h1 id='login-heading'>Login</h1>
              <div className='input-box'>
                <label htmlFor='email' hidden>Email</label>
                <input 
                  type='email' 
                  placeholder='Email'
                  name='email' 
                  value={email} 
                  onChange={handleChange} 
                  required
                />
                <MdEmail className='icon'/>
              </div>
            <div className='input-box'>
              <label htmlFor='password' hidden>Password</label>
              <input 
                type={typeReveal} 
                placeholder='Password'
                name='password' 
                value={password} 
                onChange={handleChange} 
                required
              />
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
