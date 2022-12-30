import './App.css';
import UserInput from "./stringInput"; //section where users input the substrings 
import MainStringInput from './mainStringAlgo'; //section where users input the mainstring


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          KMP Algorithm Visualizer
        </h1>
        <div className='flex'>
          <UserInput/>
          <MainStringInput/>
        </div>
      </header>
    </div>
  );
}

export default App;
