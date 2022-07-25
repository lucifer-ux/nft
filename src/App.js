import './App.css';
import RedirectForm from './components/RedirectForm/RedirectForm';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from './components/HomePage';
import Logo from "./components/Logo/Logo"
function App() {
  return (
    <>
    <Logo/>
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
