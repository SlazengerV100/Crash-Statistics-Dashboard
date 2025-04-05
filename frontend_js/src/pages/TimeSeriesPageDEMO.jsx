import React, { useState } from 'react';
import { Grid, Box, Typography, TextField, IconButton, Slider, Stack, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const TimeSeriesPageDEMO = () => {
    const [regions, setRegions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [yearRange, setYearRange] = useState([2008, 2025]);
    const [chartData, setChartData] = useState(null);

    const handleAddRegion = (region) => {
        if (!regions.includes(region)) {
            setRegions([...regions, region]);
        }
        setSearchQuery('');
    };

    const handleRemoveRegion = (region) => {
        setRegions(regions.filter(r => r !== region));
    };

    const handleYearRangeChange = (event, newValue) => {
        setYearRange(newValue);
    };

    const handleFetchData = async () => {
        const [startYear, endYear] = yearRange;
        console.log('Fetching data...');
        console.log(JSON.stringify({ regions, startYear, endYear }));
        const response = await fetch('http://localhost:5004/api/crashes/yearly-counts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ regions, startYear, endYear })
        });
        const data = await response.json();
        setChartData(data);
    };

    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            {/* Left Panel - 1/3 width */}
            <Grid item xs={4}>
                <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                    <Stack spacing={3}>
                        {/* Search Region Section */}
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Search Region
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Region"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </Box>

                        {/* Selected Regions */}
                        <Box>
                            {regions.map((region) => (
                                <Paper
                                    key={region}
                                    sx={{
                                        p: 1,
                                        mb: 1,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        bgcolor: 'background.default'
                                    }}
                                >
                                    <Typography>{region}</Typography>
                                    <IconButton size="small" onClick={() => handleRemoveRegion(region)}>
                                        <CloseIcon />
                                    </IconButton>
                                </Paper>
                            ))}
                        </Box>

                        {/* Time Period Slider */}
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Time period
                            </Typography>
                            <Slider
                                value={yearRange}
                                onChange={handleYearRangeChange}
                                min={2008}
                                max={2025}
                                valueLabelDisplay="auto"
                            />
                            <Typography variant="body2" color="text.secondary" align="center">
                                {yearRange[0]} - {yearRange[1]}
                            </Typography>
                        </Box>

                        {/* Filters Section */}
                        <Box>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                Filters <FilterAltIcon />
                            </Typography>
                            {/* Add filter options here */}
                        </Box>

                        {/* Load Button */}
                        <Box sx={{ mt: 2 }}>
                            <button
                                onClick={handleFetchData}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    backgroundColor: '#1a1a1a',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Load
                            </button>
                        </Box>
                    </Stack>
                </Paper>
            </Grid>

            {/* Right Panel - 2/3 width */}
            <Grid item xs={8}>
                <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                    {chartData ? (
                        <Line data={chartData} />
                    ) : (
                        <Typography variant="body1" align="center">
                            Select regions and time period to view crash statistics
                        </Typography>
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
};

export default TimeSeriesPageDEMO;