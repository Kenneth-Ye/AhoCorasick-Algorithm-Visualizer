import { useState } from 'react';
import './App.css';

const MainStringInput = () => {
    const [str, setStr] = useState("");

    function getData(event) {
        setStr(event.target.value);
    }

    function ahoCorasick() {
        console.log("d")
    }
    
    function handleClick(e) {
        e.preventDefault();
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