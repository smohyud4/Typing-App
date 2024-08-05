/* eslint-disable no-unused-vars */
import {Route, Routes} from 'react-router-dom';
import NavBar from './components/NavBar'
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Account from './pages/Account';
import Race from './pages/Race';
import Practice from './pages/Practice';
import './App.css';

function App() {
  
  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/account' element={<Account/>}/>
        <Route path='/race' element={<Race/>}/>
        <Route path='/practice' element={<Practice/>}/>
      </Routes>      
    </>
  )
}

export default App;
