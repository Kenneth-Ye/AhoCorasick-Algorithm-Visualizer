import { useState } from 'react';
import React from 'react';
import './App.css';
import MainStringInput from './mainStringAlgo';
import TrieVisual from './d3visualization';

//components that warn user if string entered is not unique or empty
import StringsUnique from './stringsUnique';
import EmptyString from './emptyStringError';


let substringArr=["main", "string", "ring", "aim"]; //substring array var

const UserInput = () => {

  //hooks
  const [substrings, setSubstrings] = useState(["main", "string", "ring", "aim"]);
  const [unique, setUnique] = useState(true);
  const [empty, setEmpty] = useState(false);
  const [mainstring, setMainstring] = useState("Mainstring");
  const [str, setStr] = useState("");

  function getData(event) {
    //update the str hook as user types into the field
    //setStr(event.target.value);
    setStr(event.target.value);
    console.log(str);
  }

  function handleSubmit(e) {
    console.log(str);
    //prevent refresh
    e.preventDefault();

    //ensure input is not an empty string
    if (str === "") {
      console.log("P")
      setEmpty(true);
      return; //if string is empty do not add to array
    }
    else {
      setEmpty(false);
    }
    

    //check to see if input is unique
    if (substrings.includes(str)) {
      setUnique(false); //if not unique do not add to array
      return;
    }
    else {
      setUnique(true);
    }

    //add the string to the list of substrings
    setSubstrings([...substrings, str]);
    substringArr.push(str)
    console.log(substringArr);
    console.log(str);
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
      <div className='flex'>
        <form className="substringForm">
          <label>Enter Substrings </label>
          <input type="text" onChange={getData} />
          <button type="inputButton" onClick={handleSubmit}>
            Add
          </button>
        </form>

        <div className='mainInputArea'>
          <MainStringInput setMainstring={setMainstring}/>
        </div>
      </div>
      {substrings.length === 0 && <div className='emptySub'>Input a substring to visualize, cant visualize on empty strings</div>}
      <EmptyString showError = {empty}/>
      <StringsUnique  divVisible ={unique}/> 

      {/* map the substring array to show users what substrings they have already inputted */}
      <div className="substrings"> 
        <div className='substringsText'>
          {substrings.map((string, index) => (
            <h1 className="substringText" key={string}>
              {string}{" "}
              <button type="button" onClick={() => deleteWord(string)}>
                X
              </button>
            </h1>
          ))}
        </div>
        <h1 className='mainInput'>{mainstring}</h1>
      </div>
      <div>   
        {substrings.length !== 0 && <TrieVisual mainstring={mainstring} substrings={substrings}/>}
      </div>
    </div>
  );
};

export default UserInput;
