import { useState } from 'react';
import React from 'react';
import './App.css';

//components that warn user if string entered is not unique or empty
import StringsUnique from './stringsUnique';
import EmptyString from './emptyStringError';

let substringArr=[]; //substring array var

const UserInput = () => {

  //hooks
  const [str, setStr] = useState("");
  const [substrings, setSubstrings] = useState([]);
  const [unique, setUnique] = useState(true);
  const [empty, setEmpty] = useState(false);


  function getData(event) {
    //update the str hook as user types into the field
    setStr(event.target.value);
    console.log(str);
  }

  function handleSubmit(e) {

    //prevent refresh
    e.preventDefault();

    //ensure input is not an empty string
    if (str === "") {
      setEmpty(true);
      return;
    }
    else {
      setEmpty(false);
    }
    

    //check to see if input is unique
    if (substringArr.includes(str)) {
      setUnique(false);
      return;
    }
    else {
      setUnique(true);
    }

    //add the string to the list of substrings
    setSubstrings([...substrings, str]);
    substringArr.push(str)
    console.log(substringArr);
  }




  function deleteWord(word) {
    // find the index of the word in the array
    const index = substrings.indexOf(word);

    // remove the word from the array
    substrings.splice(index, 1);
    substringArr.splice(index, 1);

    // update the state with the new array
    setSubstrings([...substrings]);

    // find the div that contains the word and remove it
    const div = document.querySelector(index);
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
      <EmptyString showError = {empty}/>
      <StringsUnique  divVisible ={unique}/> 

      {/* map the substring array to show users what substrings they have already inputted */}
      <div className="substrings"> 
        {substrings.map((string, index) => (
          <h1 className="substringText" key={string}>
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
