import { useState } from 'react';
import './App.css';

const MainStringInput = ({setMainstring}) => {

    const [str, setStr] = useState("");

    function getData(event) {
        setStr(event.target.value);
    }

    function handleClick(e) {
        e.preventDefault();
        setMainstring(str);
    }


    return ( 
        <div className='mainstring'>
            <form>
                <label>Enter Main String </label>
                <input type="text" onChange={getData}/> 
                <button type="inputButton" onClick={handleClick}>Visualize!</button>
            </form>
        </div> 
    );
}
 
export default MainStringInput;
