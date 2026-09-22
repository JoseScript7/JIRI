import React, { createContext, useState, useContext, useEffect } from "react";
import i18n from "./i18n";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState(i18n.locale);

  useEffect(() => {
    i18n.locale = locale;
  }, [locale]);

  const changeLanguage = (lang) => {
    i18n.locale = lang;
    setLocale(lang);
  };

  return (
    <LanguageContext.Provider
      value={{ locale, changeLanguage, t: (key) => i18n.t(key) }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
