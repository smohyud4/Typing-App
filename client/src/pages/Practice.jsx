/* eslint-disable no-unused-vars */
import {useState, useEffect} from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar/NavBar';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import PracticeTyping from '../components/Typing/PracticeTyping';


export default function Race() {
  const [auth, setAuth] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState('');
  const navigate = useNavigate();
 
  useEffect(() => {
    async function checkAuth() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${apiUrl}/authorize`, {withCredentials: true});
        if (response.data.error) {
          setAuth(false);
          setError(response.data.error);
          return;
        }

        console.log("Authorized");
        setAuth(true);
        setUser(response.data.user);
      }
      catch {
        setAuth(false);
        navigate('../login');
      }
    }
    checkAuth();
  }, [navigate]);  


  return (
    <>
      <NavBar isUserSignedIn={auth} user={user}/>
      {
        auth ?
        <main>
          <br/>
          <PracticeTyping/>
        </main>
        :
        <div>
          <h1>{error}</h1>
          <h1>Unauthorized</h1>
        </div>
      }
    </>
  )
} 