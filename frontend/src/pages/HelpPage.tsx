import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

const HelpPage: React.FC = () => {
    return(
        <>
            <Box sx={{ padding: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Welcome to the Help Page
                </Typography>
                <Typography variant="body1" gutterBottom>
                    This is the page where you can get help and support for using the application.
                </Typography>
                <Button variant="contained" color="primary">
                    Get Started
                </Button>
            </Box>
        </>
    )
}

export default HelpPage;