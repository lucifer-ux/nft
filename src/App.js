import './App.css';
import RedirectForm from './components/RedirectForm/RedirectForm';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import HomePage from './components/HomePage';
import Logo from "./components/Logo/Logo"
import Banner from './components/Banner/Banner';
import formElements from './components/resources/ReferalMintForm';
import priorityFormElements from './components/resources/PriorityMintForm'
import RedirectFormForPriority from './components/resources/RedirectFormForPriority/RedirectFormForPriority'
function App() {
  return (
    <>
    <div className='navbar'>
    </div>
    <Router>
      <Routes>
        <Route path = "/" element={<HomePage/>}/>
        <Route path = "/form" element={<RedirectForm formElements = {formElements}/>}/>
        <Route path = "/formPriority" element={<RedirectFormForPriority priorityFormElements = {priorityFormElements}/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
