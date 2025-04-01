import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NavBar : React.FC = () => {
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Crash Statistics App
                    </Typography>
                    <Button color="inherit" component={Link} to="/" disabled={location.pathname === "/"}>
                        Home
                    </Button>
                    <Button color="inherit" component={Link} to="/time-series" disabled={location.pathname === "/time-series"}>
                        Time Series
                    </Button>
                    <Button color="inherit" component={Link} to="/factors" disabled={location.pathname === "/factors"}>
                        Factors
                    </Button>
                    <Button color="inherit" component={Link} to="/predictor" disabled={location.pathname === "/predictor"}>
                        Predictor
                    </Button>
                    <Button color="inherit" component={Link} to="/help" disabled={location.pathname === "/help"}>
                        Help
                    </Button>
                </Toolbar>
            </AppBar>
        </>
    )
}


export default NavBar;