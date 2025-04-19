import React, {useEffect, useState} from 'react';
import {Grid, Box, Typography, CircularProgress} from '@mui/material';
import Sunburst from "../components/factors/Sunburst.jsx";

const FactorsPage = () => {
    const [vehicleCombos, setVehicleCombos] = useState([]);
    const [obstacleCombos, setObstacleCombos] = useState([]);
    const [loading, setLoading] = useState(false);

    async function fetchVehicleData(apiEndpoint) {
        const res = await fetch(apiEndpoint);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        return data;
    }

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [vehicles, obstacles] = await Promise.all([
                    fetchVehicleData('http://localhost:5001/api/factors/vehicles'),
                    fetchVehicleData('http://localhost:5001/api/factors/obstacles')
                ]);
                setVehicleCombos(vehicles);
                setObstacleCombos(obstacles);
            } catch (err) {
                console.error("Error loading data:", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
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
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box>
                        <Sunburst data={vehicleCombos}/>
                        <Sunburst data={obstacleCombos}/>
                    </Box>
                )}
            </Grid>
        </Grid>
    );
};

export default FactorsPage;