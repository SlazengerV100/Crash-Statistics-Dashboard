import React, {useEffect, useState} from 'react';
import {Grid, Box, CircularProgress} from '@mui/material';
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

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                        <CircularProgress/>
                    </Box>
                ) : (
                    <Grid display="flex" justifyContent="center" alignItems="center">

                        <Box width="50%">
                            <Sunburst data={vehicleCombos} width={windowWidth / 3} name="Vehicle"/>
                        </Box>
                        <Box width="50%">
                            <Sunburst data={obstacleCombos} width={windowWidth / 3} name="Obstacle"/>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Grid>
    );
};

export default FactorsPage;