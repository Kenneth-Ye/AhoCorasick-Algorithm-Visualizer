import { useState } from 'react';
import './App.css';
import EmptyString from './emptyStringError';

const MainStringInput = ({setMainstring}) => {
    const [empty, setEmpty] = useState(false);
    var str = ""

    function getData(event) {
        str = event.target.value;
    }

    function handleClick(e) {
        e.preventDefault();
        if (str === "") {
            setEmpty(true);
            return; //if string is empty do not add to array
          }
          else {
            setEmpty(false);
            setMainstring(str);
        }
    }


    return ( 
        <div className='mainstring'>
            <form>
                <label>Enter Main String </label>
                <input type="text" onChange={getData}/> 
                <button className="inputButton" onClick={handleClick}>Set Mainstring</button>
                <div className="mainstringEmpty">
                    <EmptyString showError = {empty}></EmptyString>
                </div>
            </form>
        </div> 
    );
}
 
export default MainStringInput;
