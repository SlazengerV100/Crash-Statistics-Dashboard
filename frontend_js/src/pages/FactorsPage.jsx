import React, { useState } from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';

const FactorsPage = () => {
    return(
        <Grid container justifyContent="center">
            {/* Outer Grid occupying 9/12 of the width, centered */}
            <Grid size={{xs:9}}>
                <Box sx={{ padding: 2, backgroundColor: 'lightgray', height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                        Control Section for factors
                    </Typography>
                    <Typography variant="body2">
                        I haven't made up my mind for this section on how we will change between factors.
                    </Typography>
                </Box>
            </Grid>
        </Grid>
    )
}

export default FactorsPage;