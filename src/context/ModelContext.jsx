import React, { createContext, useState, useContext, useEffect } from 'react';

const ModelContext = createContext();

export const ModelProvider = ({ children }) => {
  const [selectedModel, setSelectedModel] = useState(() => {
    return localStorage.getItem('intellicoreModel') || 'gpt';
  });

  useEffect(() => {
    localStorage.setItem('intellicoreModel', selectedModel);
  }, [selectedModel]);

  const models = [
    { id: 'gpt', name: 'ChatGPT-4 Turbo', provider: 'OpenAI' },
    { id: 'gemini', name: 'Gemini Pro', provider: 'Google' }
  ];

  return (
    <ModelContext.Provider value={{ selectedModel, setSelectedModel, models }}>
      {children}
    </ModelContext.Provider>
  );
};

export const useModel = () => useContext(ModelContext);
