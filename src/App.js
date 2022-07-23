import './App.css';
import RedirectForm from './components/RedirectForm/RedirectForm';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from './components/HomePage';
function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path = "/" element={<HomePage/>}/>
        <Route path = "/form" element={<RedirectForm/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
