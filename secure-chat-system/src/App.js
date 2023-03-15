import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import LandingPage from './pages/Landing-Page/LandingPage';
import ChatPage from './pages/Chat-Page/ChatPage';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function App() {
  const {currentUser} = useContext(AuthContext);

  const ProtectedRoute = ({children}) => {
    if (!currentUser) {
      return <Navigate to="/" />
    }

    return children;
  }
  
  return (
    <BrowserRouter className="App">
      <Routes>
        <Route path="/">
          <Route index element={
            <LandingPage />
          } />
          <Route path="/home" element={
            <ProtectedRoute>
              <ChatPage/>
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;