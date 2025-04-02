import React, { useState } from 'react';
import { Grid, Typography} from '@mui/material';

const HomePage: React.FC = () => {
    return(
        <>  
            <Grid container size={{xs:12}} justifyContent="center">
                {/* outer grid containing the entire page, justify centre */}
                <Grid size={{xs:12}} >
                    <Typography variant="h2" gutterBottom>
                        Welcome to the Home Page
                    </Typography>
                    <Typography variant="body1">
                        THERE WILL BE A MAP HERE
                    </Typography>
                </Grid>
            </Grid>
        </>
    )
}

export default HomePage;