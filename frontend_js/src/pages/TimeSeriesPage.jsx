import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import ControlPanel from '../components/timeSeriespage/ControlPanel';
import LinegraphPanel from '../components/timeSeriespage/LinegraphPanel';

const TimeSeriesPage = () => {
    const [graphData, setGraphData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRegions, setSelectedRegions] = useState([]);
    const [yearRange, setYearRange] = useState([2008, 2025]);
    const [filters, setFilters] = useState({});
    const [controlOpen, setControlOpen] = useState(true);

    const handleLoad = async (filters, isPerCapita) => {
        setIsLoading(true);
        const [startYear, endYear] = yearRange;
        setFilters(filters);

        const response = await fetch('http://localhost:5000/api/crashes/yearly-counts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                selectedRegions, 
                startYear, 
                endYear,
                filters,
                isPerCapita
            })
        });

        const data = await response.json();
        setGraphData({
            ...data,
            isPerCapita
        });
        setIsLoading(false);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                gap: 2,
                p: 3,
                height: '90vh',
                boxSizing: 'border-box'
            }}
        >
            {/* Main Content Container */}
            <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Control Panel */}
                {controlOpen && (
                    <Box sx={{ flex: '0 0 300px', transition: 'flex 0.3s ease' }}>
                        <ControlPanel
                            onLoad={handleLoad}
                            selectedRegions={selectedRegions}
                            setSelectedRegions={setSelectedRegions}
                            yearRange={yearRange}
                            setYearRange={setYearRange}
                        />
                    </Box>
                )}
    
                {/* Toggle Button */}
                <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
                    <IconButton
                        onClick={() => setControlOpen(!controlOpen)}
                        sx={{
                            width: 36,
                            height: 36,
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            borderRadius: '50%',
                            boxShadow: 1
                        }}
                    >
                        {controlOpen ? <ChevronLeft /> : <ChevronRight />}
                    </IconButton>
                </Box>
    
                {/* Line Graph */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <LinegraphPanel
                        data={graphData}
                        isLoading={isLoading}
                        filters={filters}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default TimeSeriesPage;
