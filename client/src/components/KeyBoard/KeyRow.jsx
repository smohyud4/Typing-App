/* eslint-disable react/prop-types */
export default function KeyRow({rowVals}) {
  return (
    <>
      {rowVals.map((val,index)=>{
        return(
          <li key={index}> 
            {val.character}
          </li>
        )
      })}
    </>
  )
}