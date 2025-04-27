import React, { useState, useEffect } from 'react';
import { Box, IconButton, CircularProgress } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import Sunburst from "../components/factors/Sunburst.jsx";

const SunburstPage = () => {
    const [vehicleCombos, setVehicleCombos] = useState([]);
    const [obstacleCombos, setObstacleCombos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [controlOpen, setControlOpen] = useState(true);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    async function fetchVehicleData(apiEndpoint) {
        const res = await fetch(apiEndpoint);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        return data;
    }

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
        <Box
            sx={{
                display: 'flex',
                gap: 2,
                p: 3,
                height: '90vh',
                boxSizing: 'border-box',
            }}
        >
            {/* Main Content Container */}
            <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Sunburst Charts */}
                <Box sx={{ 
                    flex: 1, 
                    minWidth: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 4,
                    backgroundColor: '#f5f5f5' // Matching the TimeSeriesPage background
                }}>
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <>
                            <Box width="50%">
                                <Sunburst data={vehicleCombos} width={windowWidth / 3} name="Vehicle"/>
                            </Box>
                            <Box width="50%">
                                <Sunburst data={obstacleCombos} width={windowWidth / 3} name="Obstacle"/>
                            </Box>
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default SunburstPage;