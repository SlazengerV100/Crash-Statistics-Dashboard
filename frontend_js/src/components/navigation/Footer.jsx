import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const Footer = () => {
    return (
        <AppBar position="static" sx={{ top: 'auto', bottom: 0, mt: 4 }}>
            <Toolbar sx={{ justifyContent: 'center' }}>
                <Typography 
                    variant="body2" 
                    sx={{ 
                        fontFamily: '"Oswald", "Roboto", "Helvetica", "Arial", sans-serif',
                        fontWeight: 300,
                        color: '#ffffff',
                        letterSpacing: '1px',
                        textAlign: 'center',
                    }}
                >
                    © {new Date().getFullYear()} Crash Statistics NZ. All rights reserved.
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Footer;
