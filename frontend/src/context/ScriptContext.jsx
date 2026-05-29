import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const ScriptContext = createContext();

export const ScriptProvider = ({ children }) => {
  const [seriesList, setSeriesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchScripts = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await fetch(`${API_URL}/api/scripts/`);
      if (!response.ok) throw new Error('Failed to fetch scripts');
      const data = await response.json();
      setSeriesList(data);
    } catch (error) {
      console.error(error);
      toast.error('Could not connect to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScripts();
  }, []);

  return (
    <ScriptContext.Provider value={{ seriesList, loading, fetchScripts }}>
      {children}
    </ScriptContext.Provider>
  );
};
