import React, { useState } from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';

const HelpPage = () => {
    return(
        <>
            <Grid container justifyContent="center">
                {/* Outer Grid occupying 9/12 of the width, centered */}
                <Grid size={{xs:9}}>
                    <Box sx={{ padding: 2, backgroundColor: 'lightgray', height: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                            Help Section
                        </Typography>
                        <Typography variant="body2">
                            Simple help section, could have a theme changer for accessibilty purposes???
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

export default HelpPage;