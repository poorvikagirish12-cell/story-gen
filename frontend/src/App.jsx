import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ScriptProvider } from './context/ScriptContext';
import Navbar from './components/Navbar';
import Dashboard from './views/Dashboard';
import StoryView from './views/StoryView';

function App() {
  return (
    <ScriptProvider>
      <Router>
        <div className="min-h-screen bg-sciFiDark flex flex-col">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/story" element={<StoryView />} />
            </Routes>
          </div>
        </div>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #334155',
            },
            success: {
              iconTheme: {
                primary: '#00f3ff',
                secondary: '#1e293b',
              },
            },
          }}
        />
      </Router>
    </ScriptProvider>
  );
}

export default App;
