import './App.css';
import DirectButton from './components/PublicMint';
import PriorityButton from './components/priorityButton';
import ReferalButton from './components/referalButton';

function App() {
  return (
    <>
    <div className='flexBox'>
      <ReferalButton/>
      <DirectButton/>
      <PriorityButton/>
    </div>
    </>
  );
}

export default App;
