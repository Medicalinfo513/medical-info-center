import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext({ lang: 'en', setLang: () => {} });

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');
  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);
