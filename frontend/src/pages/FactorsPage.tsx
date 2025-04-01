import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

const FactorsPage: React.FC = () => {
    return(
        <>
            <Box sx={{ padding: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Welcome to the Home Page
                </Typography>
                <Typography variant="body1" gutterBottom>
                    This is the page where you can get a breakdown of the factors that contribute to traffic crashes.
                </Typography>
                <Button variant="contained" color="primary">
                    Get Started
                </Button>
            </Box>
        </>
    )
}

export default FactorsPage;