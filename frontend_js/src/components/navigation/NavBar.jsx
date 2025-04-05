import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            flexGrow: 1,
                            fontFamily: '"Oswald", "Roboto", "Helvetica", "Arial", sans-serif',
                            fontWeight: 500,
                            letterSpacing: '2px',
                            color: '#ffffff'
                        }}
                    >
                        Crash Statistics NZ
                    </Typography>
                    <Button 
                        color="inherit" 
                        component={Link} 
                        to="/"
                        sx={{ 
                            backgroundColor: isActive('/') ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
                            '&:hover': {
                                backgroundColor: isActive('/') ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'
                            }
                        }}
                    >
                        Home
                    </Button>
                    <Button 
                        color="inherit" 
                        component={Link} 
                        to="/time-series"
                        sx={{ 
                            backgroundColor: isActive('/time-series') ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
                            '&:hover': {
                                backgroundColor: isActive('/time-series') ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'
                            }
                        }}
                    >
                        Region Comparison
                    </Button>
                    <Button 
                        color="inherit" 
                        component={Link} 
                        to="/factors"
                        sx={{ 
                            backgroundColor: isActive('/factors') ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
                            '&:hover': {
                                backgroundColor: isActive('/factors') ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'
                            }
                        }}
                    >
                        Factors
                    </Button>
                    <Button 
                        color="inherit" 
                        component={Link} 
                        to="/predictor"
                        sx={{ 
                            backgroundColor: isActive('/predictor') ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
                            '&:hover': {
                                backgroundColor: isActive('/predictor') ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'
                            }
                        }}
                    >
                        Predictor
                    </Button>
                    <Button 
                        color="inherit" 
                        component={Link} 
                        to="/help"
                        sx={{ 
                            backgroundColor: isActive('/help') ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
                            '&:hover': {
                                backgroundColor: isActive('/help') ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'
                            }
                        }}
                    >
                        Help
                    </Button>
                </Toolbar>
            </AppBar>
        </>
    );
};

export default NavBar;