import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

const HomePage: React.FC = () => {
    return(
        <>
            <Box sx={{ padding: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Welcome to the Home Page
                </Typography>
                <Typography variant="body1" gutterBottom>
                    This is the main page of the application.
                </Typography>
                <Button variant="contained" color="primary">
                    Get Started
                </Button>
            </Box>
        </>
    )
}

export default HomePage;