import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ControlPanel from '../components/timeSeriespage/ControlPanel';
import LinegraphPanel from '../components/timeSeriespage/LinegraphPanel';

const TimeSeriesPage = () => {
    const [graphData, setGraphData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRegions, setSelectedRegions] = useState([]);
    const [yearRange, setYearRange] = useState([2008, 2025]);

    const handleLoad = async () => {
        setIsLoading(true);
        const [startYear, endYear] = yearRange;

        const response = await fetch('http://localhost:5004/api/crashes/yearly-counts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ selectedRegions, startYear, endYear })
        });

        const data = await response.json();
        
        setGraphData(data);

        setIsLoading(false);
    };
    
    return (
        <Box
            sx={{
                display: 'flex',
                gap: 3,
                p: 3,
                height: '90vh',
                boxSizing: 'border-box'
            }}
        >
            <ControlPanel onLoad={handleLoad} selectedRegions={selectedRegions} setSelectedRegions={setSelectedRegions} yearRange={yearRange} setYearRange={setYearRange} />
            <LinegraphPanel data={graphData} isLoading={isLoading} />
        </Box>
    );
};

export default TimeSeriesPage;
