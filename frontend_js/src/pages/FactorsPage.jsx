import React, {useEffect, useState} from 'react';
import {Grid, Box, Typography, Button} from '@mui/material';
import VehiclesPanel from "../components/factors/VehiclesPanel.jsx";

const FactorsPage = () => {
    const [vehicleCombos, setVehicleCombos] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchVehicleData = async () => {
        try {
            const res = await fetch('http://localhost:5001/api/factors/vehicles');
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            const data = await res.json();
            setVehicleCombos(data);
        } catch (err) {

        } finally {
            setLoading(false);
        }
    };

    useEffect( () => {
        fetchVehicleData()
    }, []);


    return (
        <Grid container justifyContent="center" className="page-content">
            {/* Outer Grid occupying 9/12 of the width, centered */}
            <Grid size={{xs: 9}}>
                <Box sx={{padding: 2, backgroundColor: 'lightgray'}}>
                    <Typography variant="h6" gutterBottom>
                        Control Section for factors
                    </Typography>
                    <Typography variant="body2">
                        I haven't made up my mind for this section on how we will change between factors.
                    </Typography>
                </Box>
                <Box>
                    <VehiclesPanel onLoad={fetchVehicleData} data={vehicleCombos}/>
                </Box>
            </Grid>
        </Grid>
    );
};

export default FactorsPage;