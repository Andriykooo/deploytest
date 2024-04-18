"use client";

import React, { createContext, useState } from "react";

const LocaleContext = createContext();

const LocaleProvider = ({ children, locale }) => {
  const [localeData, setSetLocaleData] = useState(locale);

  return (
    <LocaleContext.Provider value={{ localeData, setSetLocaleData }}>
      {children}
    </LocaleContext.Provider>
  );
};

export { LocaleContext, LocaleProvider };
