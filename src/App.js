import './App.css';
import DirectButton from './components/PublicMint';
import PriorityButton from './components/priorityButton';
import ReferralButton from './components/referralButton';
import RedirectForm from './components/RedirectForm/RedirectForm';
function App() {
  return (
    <>
    <div className='flexBox'>
      <ReferralButton/>
      <DirectButton/>
      <PriorityButton/>
    </div>
    <RedirectForm/>
    </>
  );
}

export default App;
