import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

const PredictorPage: React.FC = () => {
    return(
        <>
            <Box sx={{ padding: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Welcome to the Predictor Page
                </Typography>
                <Typography variant="body1" gutterBottom>
                    This is the page where you can make predictions based on the crash data.
                </Typography>
                <Button variant="contained" color="primary">
                    Get Started
                </Button>
            </Box>
        </>
    )
}

export default PredictorPage;