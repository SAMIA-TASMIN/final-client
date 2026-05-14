// contexts/ThemeContext.js
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "civicLight"
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);
    // Optional: apply to document
    document.documentElement.classList.toggle("dark", theme === "civicDark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "civicLight" ? "civicDark" : "civicLight"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
