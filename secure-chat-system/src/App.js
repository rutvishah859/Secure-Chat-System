import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import LandingPage from './pages/Landing-Page/LandingPage';
import ChatPage from './pages/Chat-Page/ChatPage';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function App() {
  const {currentUser} = useContext(AuthContext); 
  console.log(currentUser);
  
  return (
    <BrowserRouter className="App">
      <Routes>
        <Route path="/">
          <Route index element={<LandingPage />} /> 
          <Route path="/home" element={<ChatPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;