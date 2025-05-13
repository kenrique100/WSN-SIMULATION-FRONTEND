import React, { createContext, useContext, useMemo, useState } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import { darkTheme, lightTheme } from '@/assets/theme';

interface ThemeContextType {
  toggleTheme: () => void;
  mode: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    return savedTheme || 'light';
  });

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newMode);
      return newMode;
    });
  };

  const theme = useMemo(() => {
    return mode === 'light' ? lightTheme : darkTheme;
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);