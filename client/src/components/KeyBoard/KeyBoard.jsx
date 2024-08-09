/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import KeyRow from "./KeyRow";
import "./KeyBoard.css";

export default function KeyBoard({
  rowOneVals, 
  rowTwoVals, 
  rowThreeVals, 
  rowFourVals, 
  rowOneCaps, 
  rowTwoCaps, 
  rowThreeCaps, 
  rowFourCaps,
  space
}) {

  const [caps, setCaps] = useState(false);

  return <>
    <div className="keyBoardContainer">
      <ul>
        <li id="shiftButton" onClick={() => setCaps(prev => !prev)}>
          shift
        </li>
       </ul>
      <ul>
        {!caps ? <KeyRow rowVals={rowOneVals}/> : <KeyRow rowVals={rowOneCaps}/>}
       </ul>
       <ul id="rowTwo">
          {!caps ? <KeyRow rowVals={rowTwoVals}/> : <KeyRow rowVals={rowTwoCaps}/>}
       </ul>
       <ul id="rowThree">
          {!caps ? <KeyRow rowVals={rowThreeVals}/> : <KeyRow rowVals={rowThreeCaps}/>}
       </ul>
       <ul id="rowFour">
          {!caps ? <KeyRow rowVals={rowFourVals}/> : <KeyRow rowVals={rowFourCaps}/>}
       </ul>
       <ul>
        <li id="spaceBtn">
          space
        </li>
       </ul>
    </div>
  </>;
}
