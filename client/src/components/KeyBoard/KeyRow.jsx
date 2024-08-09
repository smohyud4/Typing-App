/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

export default function KeyRow({rowVals, background}) {
  return (
    <>
      {rowVals.map((val,index)=>{
        let accuracy = "N/A";
        if (val.total_typed > 0) {
          accuracy = `${((val.total_correct / val.total_typed)*100).toFixed(2)}%`;
        }
        return(
          <li 
            key={index} 
            style={{backgroundColor: background(val.total_correct, val.total_typed)}}
          >
            {val.character}
            <div className="tooltip">
              <p>{accuracy}</p>
            </div>
          </li>
        )
      })}
    </>
  )
}