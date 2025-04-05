import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import App from './App';

const baseTheme = createTheme({
  palette: {
    primary: {
      main: '#6888BE', // Light blue
      light: '#CCDBEE',
      dark: '#4470AD',
    },
    secondary: {
      main: '#f50057', // Pink accent
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#e5e5e5', // Light gray background
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

const ThemedApp = () => {
  return (
    <div style={{ 
      backgroundColor: baseTheme.palette.background.default,
      minHeight: '100vh',
      width: '100%'
    }}>
      <ThemeProvider theme={baseTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </div>
  );
};

export default ThemedApp;