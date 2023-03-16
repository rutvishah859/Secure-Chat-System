import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthContextProvider } from './context/AuthContext';
import App from './App';
import './index.css';
import { UserContextProvider } from './context/UserContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
    <UserContextProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </UserContextProvider>
  </AuthContextProvider>
);
