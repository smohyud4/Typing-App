/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar/NavBar';
import Footer from '../components/Footer/Footer';
import KeyBoard from '../components/KeyBoard/KeyBoard';
import './Account.css';

const rowOne = "1234567890-=";
const rowTwo = "qwertyuiop[]";
const rowThree = "asdfghjkl;'";
const rowFour = "zxcvbnm,./";
const rowOneCaps = "!@#$%^&*()_+";
const rowTwoCaps = "QWERTYUIOP{}";
const rowThreeCaps = `ASDFGHJKL:"`;
const rowFourCaps = "ZXCVBNM<>?";


export default function Account() {
  const [auth, setAuth] = useState(false);
  const [error, setError] = useState('');
 
  const [data, setData] = useState({
    races: '', 
    WPM: '',
    bestWPM: '',
    accuracy: '',
    user: '',
    charAccuracies: ''
  });

  const [accuracyData, setAccuracyData] = useState({
    rowOneLower: [],
    rowOneUpper: [],
    rowTwoLower: [],
    rowTwoUpper: [],
    rowThreeLower: [],
    rowThreeUpper: [],
    rowFourLower: [],
    rowFourUpper: [],
    space: []
  });

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
        setData(response.data);
        setAuth(true);
      }
      catch {
        setAuth(false);
      }
    }
    checkAuth();
  }, []);
  
  useEffect(() => {
    if (data.charAccuracies) {
      const charAccuracies = data.charAccuracies;

      let rowOneLower = charAccuracies.filter((entry) => rowOne.includes(entry.character));
      rowOneLower.sort((a, b) => rowOne.indexOf(a.character) - rowOne.indexOf(b.character));

      let rowTwoLower = charAccuracies.filter((entry) => rowTwo.includes(entry.character));
      rowTwoLower.sort((a, b) => rowTwo.indexOf(a.character) - rowTwo.indexOf(b.character));

      let rowThreeLower = charAccuracies.filter((entry) => rowThree.includes(entry.character));
      rowThreeLower.sort((a, b) => rowThree.indexOf(a.character) - rowThree.indexOf(b.character));

      let rowFourLower = charAccuracies.filter((entry) => rowFour.includes(entry.character));
      rowFourLower.sort((a, b) => rowFour.indexOf(a.character) - rowFour.indexOf(b.character));

      let rowOneUpper = charAccuracies.filter((entry) => rowOneCaps.includes(entry.character));
      rowOneUpper.sort((a, b) => rowOneCaps.indexOf(a.character) - rowOneCaps.indexOf(b.character));

      let rowTwoUpper = charAccuracies.filter((entry) => rowTwoCaps.includes(entry.character));
      rowTwoUpper.sort((a, b) => rowTwoCaps.indexOf(a.character) - rowTwoCaps.indexOf(b.character));

      let rowThreeUpper = charAccuracies.filter((entry) => rowThreeCaps.includes(entry.character));
      rowThreeUpper.sort((a, b) => rowThreeCaps.indexOf(a.character) - rowThreeCaps.indexOf(b.character));

      let rowFourUpper = charAccuracies.filter((entry) => rowFourCaps.includes(entry.character));
      rowFourUpper.sort((a, b) => rowFourCaps.indexOf(a.character) - rowFourCaps.indexOf(b.character));

      setAccuracyData({
        rowOneLower: rowOneLower,
        rowTwoLower: rowTwoLower,
        rowThreeLower: rowThreeLower,
        rowFourLower: rowFourLower,
        rowOneUpper: rowOneUpper,
        rowTwoUpper: rowTwoUpper,
        rowThreeUpper: rowThreeUpper,
        rowFourUpper: rowFourUpper,
        space: charAccuracies.filter((entry) => entry.character === ' ')
      });
    }
  }, [data]);


  return (
    <>
      <NavBar isUserSignedIn={auth} user={data.user}/>
      {
        auth ?
          <>
            <div className='auth'>
              <h1>Total Races: {data.races}</h1>
              <div className="profile-container">
                <div className="profile-card">
                  <h2>{data.races === 0 ? 0 : Math.round(data.WPM / data.races)}</h2>
                  <p>WPM</p>
                </div>
                <div className="profile-card">
                  <h2>{Math.round(data.bestWPM)}</h2>
                  <p>Best WPM</p>
                </div>
                <div className="profile-card">
                  <h2>{data.races === 0 ? 0 : (data.accuracy / data.races).toFixed(2)}%</h2>
                  <p>Accuracy</p>
                </div>
              </div>
            </div>
            <div className="key-container">
              <KeyBoard
                rowOneVals={accuracyData.rowOneLower}
                rowTwoVals={accuracyData.rowTwoLower}
                rowThreeVals={accuracyData.rowThreeLower}
                rowFourVals={accuracyData.rowFourLower}
                rowOneCaps={accuracyData.rowOneUpper}
                rowTwoCaps={accuracyData.rowTwoUpper}
                rowThreeCaps={accuracyData.rowThreeUpper}
                rowFourCaps={accuracyData.rowFourUpper}
                space={accuracyData.space}
              >
              </KeyBoard>
            </div>
          </>
        : 
        <div>
          <h1>{error}</h1>
          <h1>Unauthorized</h1>
        </div>
      }
    </>
  )
} 

/*
<div className='auth'>
          <h1>Welcome, Noob</h1>
          <div className="profile-container">
            <div className="profile-card">
              <h2>200</h2>
              <p>WPM</p>
            </div>
            <div className="profile-card">
              <h2>200</h2>
              <p>Best WPM</p>
            </div>
            <div className="profile-card">
              <h2>90%</h2>
              <p>Accuracy</p>
            </div>
          </div>
        </div>
*/