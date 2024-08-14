/* eslint-disable no-unused-vars */
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
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
  const [dataProcessed, setDataProcessed] = useState(false);
  const navigate = useNavigate();
 
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
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${apiUrl}/account`, {withCredentials: true});
        if (response.data.error) {
          setAuth(false);
          setError(response.data.error);
          console.log(response.data.error);
          return;
        }

        setData(response.data);
        setAuth(true);
      }
      catch {
        setAuth(false);
        navigate('../login');
      }
    }
    checkAuth();
  }, [navigate]);
  
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

      setDataProcessed(true);
    }
  }, [data]);


  return (
    <>
      <NavBar isUserSignedIn={auth} user={data.user}/>
      {
        auth ?
          <main>
           <section className='auth'>
              <header>
                <h2>Total Races: {data.races}</h2>
              </header>
      
              <section className="profile-container">
                <article className="profile-card">
                  <h3>{data.races === 0 ? 0 : Math.round(data.WPM / data.races)}</h3>
                  <p>WPM</p>
                </article>
                <article className="profile-card">
                  <h3>{Math.round(data.bestWPM)}</h3>
                  <p>Best WPM</p>
                </article>
                <article className="profile-card">
                  <h3>{data.races === 0 ? 0 : (data.accuracy / data.races).toFixed(2)}%</h3>
                  <p>Accuracy</p>
                </article>
              </section>
            </section>

            <section className="key-container">
              {dataProcessed && (
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
                />
              )}
            </section>
          </main>
        : 
        <main id='loader-container'>
          <div className="loader"></div>
        </main>
      }
    </>
  )
} 
