import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NavBar = () => {
    const location = window.location;


    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Crash Statistics App
                    </Typography>
                    <Button color="inherit" component={Link} to="/" >
                        Home
                    </Button>
                    <Button color="inherit" component={Link} to="/time-series">
                        Time Series
                    </Button>
                    <Button color="inherit" component={Link} to="/factors" >
                        Factors
                    </Button>
                    <Button color="inherit" component={Link} to="/predictor" >
                        Predictor
                    </Button>
                    <Button color="inherit" component={Link} to="/help" >
                        Help
                    </Button>
                </Toolbar>
            </AppBar>
        </>
    )
}


export default NavBar;