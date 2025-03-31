import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';

import App from './App';

const baseTheme = createTheme();

const ThemedApp : React.FC = () => {
  return (
    <>
        <ThemeProvider theme = {baseTheme}>
            <App/>
        </ThemeProvider>
    </>
  )
}

export default ThemedApp