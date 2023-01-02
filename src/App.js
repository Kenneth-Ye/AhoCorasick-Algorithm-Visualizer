import './App.css';
import UserInput from "./stringInput"; //section where users input the substrings 
import MainStringInput from './mainStringAlgo'; //section where users input the mainstring
import Automaton from './ahoAutomaton';


function App() {


  return (
    <div className="App">
      <header className="App-header">
        <h1>
          KMP Algorithm Visualizer
        </h1>
        <div className='in'>
          <UserInput/>
        </div>
      </header>
    </div>
  );
}

export default App;
