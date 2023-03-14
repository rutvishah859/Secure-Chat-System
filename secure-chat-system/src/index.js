import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ChatPage from './pages/Chat-Page/ChatPage';
// import LandingPage from './pages/Landing-Page/LandingPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <LandingPage /> */}
    <ChatPage />
  </React.StrictMode>
);
