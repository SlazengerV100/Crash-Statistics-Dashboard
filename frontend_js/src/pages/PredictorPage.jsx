import React from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';

const PredictorPage = () => {
    return (
        <Grid container justifyContent="center">
            {/* Outer Grid occupying 9/12 of the width, centered */}
            <Grid size={{xs:9}}>
                <Grid container spacing={2}>
                    {/* Left Box - 1/3 of 9/12 */}
                    <Grid size={{xs:4}}>
                        <Box sx={{ padding: 2, backgroundColor: 'lightgray', height: '100%' }}>
                            <Typography variant="h6" gutterBottom>
                                Control panel for predictor
                            </Typography>
                            <Typography variant="body2">
                                Enter the necessary data to generate a prediction.
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Right Box - 2/3 of 9/12 */}
                    <Grid size = {{xs:8}}>
                        <Box sx={{ padding: 2, backgroundColor: 'whitesmoke', height: '100%' }}>
                            <Typography variant="h4" gutterBottom>
                                Predictor Output
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                View the prediction results based on your input.
                            </Typography>
                            <Button variant="contained" color="primary">
                                Get Started
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default PredictorPage;