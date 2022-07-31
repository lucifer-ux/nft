import './App.css';
import React from "react"
import RedirectForm from './components/RedirectForm/RedirectForm';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import HomePage from './components/HomePage';
import formElements from './components/resources/ReferalMintForm';
import priorityFormElements from './components/resources/PriorityMintForm'
import RedirectFormForPriority from './components/resources/RedirectFormForPriority/RedirectFormForPriority'
import { useState } from 'react';
import ProtectedRoute from './components/resources/ProtectedRoute';
import RedirectFormForGenerate from './components/resources/RedirectFormForGenerate/RedirectFormForGenerate';
import generateFormElements from './components/resources/GenerateReferalForm'
function App() {
  const [state , setState] = useState(false)
console.log(state +"sate")
  return (
    <>
    <div className='navbar'>
    </div>
    <Router>
      <Routes>
        <Route element = {<ProtectedRoute state = {state}/>}>
        <Route path = "/form" element={<RedirectForm formElements = {formElements} state={state} />}/>
        <Route path = "/formPriority" element={<RedirectFormForPriority priorityFormElements = {priorityFormElements} state={state}/>}/>
        <Route path = "/formGenerate" element={<RedirectFormForGenerate generateFormElements = {generateFormElements} state={state}/>}/>
        </Route>
        <Route path = "/" element={<HomePage setState={setState}/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
