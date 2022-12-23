import { useState } from 'react';
// import './App.css';

// const UserInput = () => {

//     const [str, setStr] = useState("");
//     const [substrings, setSubstrings] = useState([]);

//     function getData(event) {
//         setStr(event.target.value);
//     }

//     function handleSubmit(e) {
//         e.preventDefault();
//         const interimList = [...substrings, str]
//         setSubstrings(interimList);
//         console.log(substrings)
//     }

//     return (  
//         <div className="inputArea">
//             <form className="substringForm">
//                 <label>Enter Substrings </label>
//                 <input type="text" onChange={getData}/> 
//                 <button type="inputButton" onClick={ handleSubmit}>Add</button>
//             </form>

//             <div className='substrings'>
//                 {substrings.map((string, index) => (
//                     <h1 className='substringText' key={index}> {string} </h1>
//                 ))}
//             </div>
//         </div>
//     ); 
// }
 
// export default UserInput;




//UNIQUE VERSION
import React from 'react';
import './App.css';
import StringsUnique from './stringsUnique';

const UserInput = () => {
  const [str, setStr] = useState("");
  const [substrings, setSubstrings] = useState([]);
  const [unique, setUnique] = useState(true);

  function getData(event) {
    setStr(event.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    strUnique();

    console.log(unique);
    if (!unique) {
        return;
    }
    //const interimList = [...substrings, str];
    setSubstrings([...substrings, str]);
    console.log(substrings);
  }

  function strUnique() {
    if (substrings.includes(str)) {
        setUnique(false);
    }
    else {
        setUnique(true);
    }
  }

  function deleteWord(word) {
    // find the index of the word in the array
    const index = substrings.indexOf(word);

    // remove the word from the array
    substrings.splice(index, 1);

    // update the state with the new array
    setSubstrings([...substrings]);

    // find the div that contains the word and remove it
    const div = document.querySelector(`div:contains(${word})`);
    div.remove();
  }

  return (
    <div className="inputArea">
      <form className="substringForm">
        <label>Enter Substrings </label>
        <input type="text" onChange={getData} />
        <button type="inputButton" onClick={handleSubmit}>
          Add
        </button>
      </form>

      <StringsUnique  divVisible ={unique}/> 
      <div className="substrings">
        {substrings.map((string, index) => (
          <h1 className="substringText" key={index}>
            {string}{" "}
            <button type="button" onClick={() => deleteWord(string)}>
              X
            </button>
          </h1>
        ))}
      </div>
    </div>
  );
};

export default UserInput;