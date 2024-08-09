/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import KeyRow from "./KeyRow";
import "./KeyBoard.css";

function getBackgroundColor(correct, total) {
  if (total === 0) {
    return 'transparent';
  }

  const accuracy = correct / total;
  const r = Math.round(200 * (1 - accuracy)); // Red decreases as accuracy increases
  const g = Math.round(200 * accuracy); // Green increases as accuracy increases
  return `rgb(${r}, ${g}, 120)`;
}

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
        {!caps  
          ? <KeyRow rowVals={rowOneVals} background={getBackgroundColor}/> 
          : <KeyRow rowVals={rowOneCaps} background={getBackgroundColor}/>
        }
       </ul>
       <ul id="rowTwo">
         {!caps  
           ? <KeyRow rowVals={rowTwoVals} background={getBackgroundColor}/> 
           : <KeyRow rowVals={rowTwoCaps} background={getBackgroundColor}/>
         }
       </ul>
       <ul id="rowThree">
         {!caps  
           ? <KeyRow rowVals={rowThreeVals} background={getBackgroundColor}/> 
           : <KeyRow rowVals={rowThreeCaps} background={getBackgroundColor}/>
         }
       </ul>
       <ul id="rowFour">
         {!caps  
           ? <KeyRow rowVals={rowFourVals} background={getBackgroundColor}/> 
           : <KeyRow rowVals={rowFourCaps} background={getBackgroundColor}/>
         }
       </ul>
       <ul>
        <li 
          id="spaceBtn" 
          style={{backgroundColor: getBackgroundColor(space[0].total_correct, space[0].total_typed)}}
        >
          space
          <div className="tooltip">
            {space[0].total_typed > 0 
              ? <p>{((space[0].total_correct / space[0].total_typed) * 100).toFixed(2)}%</p>
              : <p>N/A</p>
          }   
          </div>
        </li>
       </ul>
    </div>
  </>;
}
