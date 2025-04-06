import React, { useState, useEffect } from 'react';
import { Paper, Autocomplete, TextField, Box, Typography, Button, IconButton, Slider, Checkbox, FormGroup, FormControlLabel, Select, MenuItem, FormControl, InputLabel, Switch } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ControlPanel = ({ onLoad, selectedRegions, setSelectedRegions, yearRange, setYearRange }) => {
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [regions, setRegions] = useState([]);
    const [isPerCapita, setIsPerCapita] = useState(false);
    const [filters, setFilters] = useState({
        speed_limit: [0, 120],
        number_of_lanes: [1, 8],
        vehicles: [],
        severity_description: '',
        weather_condition: ''
    });
    const [filterOptions, setFilterOptions] = useState({
        advisory_speed: [],
        number_of_lanes: [],
        vehicles: ['bus', 'bicycle', 'moped', 'car_station_wagon', 'truck'],
        severity_description: [],
        weather_condition: []
    });
    const [speedLimitRange, setSpeedLimitRange] = useState([0, 120]);
    const [lanesRange, setLanesRange] = useState([1, 8]);

    const handleFetchRegions = async () => {
        const response = await fetch('http://localhost:5000/api/regions');
        const data = await response.json();
        setRegions(data);
    };

    useEffect(() => {
        handleFetchRegions();
    }, []);

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                // Fetch severity options
                const severityRes = await fetch('http://localhost:5000/api/filters/severity');
                const severityData = await severityRes.json();
                
                // Fetch weather options
                const weatherRes = await fetch('http://localhost:5000/api/filters/weather');
                const weatherData = await weatherRes.json();

                // Update filter options
                setFilterOptions(prev => ({
                    ...prev,
                    severity_description: severityData,
                    weather_condition: weatherData
                }));

                console.log('Loaded filter options:', { severityData, weatherData }); // Debug log
            } catch (error) {
                console.error('Error fetching filter options:', error);
            }
        };

        fetchFilterOptions();
    }, []);

    useEffect(() => {
        console.log('Current filter options:', filterOptions);
    }, [filterOptions]);

    const handleRemoveRegion = (region) => {
        setSelectedRegions(selectedRegions.filter(r => r !== region));
    };

    const handleRegionSelect = (event, value) => {
        if (value && !selectedRegions.includes(value)) {
            setSelectedRegions([...selectedRegions, value]);
        }
    };

    const handleTimeRangeChange = (event, newValue) => {
        setYearRange(newValue);
    };

    const handleFilterChange = (category, value) => {
        setFilters(prev => ({
            ...prev,
            [category]: value
        }));
    };

    return (
        <Paper 
            elevation={2} 
            sx={{ 
                p: 2.5,
                width: 300,
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Box sx={{ mb: 2.5 }}>
                <Typography variant="h6" gutterBottom>
                    Search Region
                </Typography>
                <Autocomplete
                    options={regions}
                    onChange={handleRegionSelect}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder="Search region"
                            size="small"
                        />
                    )}
                />
            </Box>

            <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1, 
                mb: 2.5 
            }}>
                {selectedRegions.map(region => (
                    <Paper
                        key={region}
                        sx={{
                            p: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            bgcolor: 'primary.light'
                        }}
                    >
                        <Typography variant="body2">{region}</Typography>
                        <IconButton 
                            size="small" 
                            onClick={() => handleRemoveRegion(region)}
                            sx={{ p: 0 }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Paper>
                ))}
            </Box>

            <Box sx={{ mb: 2.5 }}>
                <Typography variant="h6" gutterBottom>
                    Time period
                </Typography>
                <Box sx={{ px: 1 }}>
                    <Slider
                        value={yearRange}
                        onChange={(e, newValue) => setYearRange(newValue)}
                        min={2003}
                        max={2025}
                        valueLabelDisplay="auto"
                    />
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        color: 'text.secondary'
                    }}>
                        <Typography variant="body2">{yearRange[0]}</Typography>
                        <Typography variant="body2">{yearRange[1]}</Typography>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ mb: 2.5 }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={isPerCapita}
                            onChange={(e) => setIsPerCapita(e.target.checked)}
                            color="primary"
                        />
                    }
                    label={
                        <Typography variant="body2">
                            {isPerCapita ? "Crashes per 100,000 people" : "Total crashes"}
                        </Typography>
                    }
                />
            </Box>

            <Button
                fullWidth
                variant="outlined"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                sx={{ mb: 2 }}
            >
                {isFiltersOpen ? 'Hide Filters' : 'Show Filters'}
            </Button>

            {isFiltersOpen && (
                <Box 
                    sx={{ 
                        flex: 1,
                        overflowY: 'auto',
                        mb: 2
                    }}
                >
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                            Speed Limit
                        </Typography>
                        <Box sx={{ px: 3 }}>
                            <Slider
                                value={speedLimitRange}
                                onChange={(e, newValue) => {
                                    setSpeedLimitRange(newValue);
                                    handleFilterChange('speed_limit', newValue);
                                }}
                                min={0}
                                max={120}
                                valueLabelDisplay="auto"
                                valueLabelFormat={value => `${value} km/h`}
                                sx={{
                                    '& .MuiSlider-thumb': {
                                        color: 'primary.main',
                                    },
                                    '& .MuiSlider-track': {
                                        color: 'primary.main',
                                    },
                                    '& .MuiSlider-rail': {
                                        color: 'grey.300',
                                    },
                                }}
                            />
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                color: 'text.secondary',
                                mt: 1
                            }}>
                                <Typography variant="body2">{speedLimitRange[0]} km/h</Typography>
                                <Typography variant="body2">{speedLimitRange[1]} km/h</Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                            Number of Lanes
                        </Typography>
                        <Box sx={{ px: 3 }}>
                            <Slider
                                value={lanesRange}
                                onChange={(e, newValue) => {
                                    setLanesRange(newValue);
                                    handleFilterChange('number_of_lanes', newValue);
                                }}
                                min={1}
                                max={8}
                                step={1}
                                marks
                                valueLabelDisplay="auto"
                                valueLabelFormat={value => `${value} lanes`}
                                sx={{
                                    '& .MuiSlider-thumb': {
                                        color: 'primary.main',
                                    },
                                    '& .MuiSlider-track': {
                                        color: 'primary.main',
                                    },
                                    '& .MuiSlider-rail': {
                                        color: 'grey.300',
                                    },
                                    '& .MuiSlider-mark': {
                                        backgroundColor: '#bfbfbf',
                                        height: 8,
                                    },
                                    '& .MuiSlider-markActive': {
                                        backgroundColor: '#fff',
                                    }
                                }}
                            />
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                color: 'text.secondary',
                                mt: 1
                            }}>
                                <Typography variant="body2">{lanesRange[0]} lanes</Typography>
                                <Typography variant="body2">{lanesRange[1]} lanes</Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                            Vehicles Present
                        </Typography>
                        <FormGroup>
                            {filterOptions.vehicles.map((vehicle) => (
                                <FormControlLabel
                                    key={vehicle}
                                    control={
                                        <Checkbox
                                            checked={filters.vehicles.includes(vehicle)}
                                            onChange={(e) => {
                                                const newValue = e.target.checked
                                                    ? [...filters.vehicles, vehicle]
                                                    : filters.vehicles.filter(v => v !== vehicle);
                                                handleFilterChange('vehicles', newValue);
                                            }}
                                        />
                                    }
                                    label={vehicle.replace(/_/g, ' ')}
                                />
                            ))}
                        </FormGroup>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="severity-select-label">Crash Severity</InputLabel>
                            <Select
                                labelId="severity-select-label"
                                id="severity-select"
                                value={filters.severity_description}
                                label="Crash Severity"
                                onChange={(e) => handleFilterChange('severity_description', e.target.value)}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {filterOptions.severity_description.map((severity) => (
                                    <MenuItem key={severity} value={severity}>
                                        {severity}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="weather-select-label">Weather Condition</InputLabel>
                            <Select
                                labelId="weather-select-label"
                                id="weather-select"
                                value={filters.weather_condition}
                                label="Weather Condition"
                                onChange={(e) => handleFilterChange('weather_condition', e.target.value)}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {filterOptions.weather_condition.map((weather) => (
                                    <MenuItem key={weather} value={weather}>
                                        {weather}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
            )}

            <Button
                variant="contained"
                onClick={() => onLoad(filters, isPerCapita)}
                sx={{ 
                    mt: 'auto',
                    bgcolor: 'primary.main',
                    '&:hover': {
                        bgcolor: 'primary.dark'
                    }
                }}
            >
                Load
            </Button>
        </Paper>
    );
};

export default ControlPanel; 