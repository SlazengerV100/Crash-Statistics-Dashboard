import React, { useState } from 'react';
import { Grid, Typography} from '@mui/material';

import MainMap from '../components/homepage/mainMap.jsx';

const HomePage = () => {
    return(
        <div className="page-content">
            <Grid container size={{xs:12}} justifyContent="center" alignItems="center">
                {/* outer grid containing the entire page, justify centre */}
                <Grid size={{xs:12}} justifyContent={"center"}>
                    {/* inner grid containing the map and text */}
                    <MainMap/>
                    {/* <Typography variant="h2" gutterBottom>
                        Welcome to the Home Page
                    </Typography>
                    <Typography variant="body1">
                        THERE WILL BE A MAP HERE
                    </Typography> */}
                </Grid>
            </Grid>
        </div>
    )
}

export default HomePage;