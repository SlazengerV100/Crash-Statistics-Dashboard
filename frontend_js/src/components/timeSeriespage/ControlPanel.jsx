import React, { useState, useEffect } from 'react';
import { Paper, Autocomplete, TextField, Box, Typography, Button, IconButton, Slider, Checkbox, FormGroup, FormControlLabel, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ControlPanel = ({ onLoad, selectedRegions, setSelectedRegions, yearRange, setYearRange }) => {
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [regions, setRegions] = useState([]);
    const [filters, setFilters] = useState({
        advisory_speed: [],
        number_of_lanes: [],
        vehicles: [],
        severity_description: [],
        weather_condition: []
    });
    const [filterOptions, setFilterOptions] = useState({
        advisory_speed: [],
        number_of_lanes: [],
        vehicles: ['bus', 'bicycle', 'moped', 'car_station_wagon'],
        severity_description: [],
        weather_condition: []
    });

    const handleFetchRegions = async () => {
        const response = await fetch('http://localhost:5004/api/regions', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
  
        setRegions(data);
    };

    useEffect(() => {
        handleFetchRegions();
    }, []);

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const [
                    advisorySpeedsRes,
                    numberOfLanesRes,
                    severityRes,
                    weatherRes
                ] = await Promise.all([
                    fetch('http://localhost:5004/api/filters/advisory-speeds'),
                    fetch('http://localhost:5004/api/filters/number-of-lanes'),
                    fetch('http://localhost:5004/api/filters/severity'),
                    fetch('http://localhost:5004/api/filters/weather')
                ]);

                if (!advisorySpeedsRes.ok || !numberOfLanesRes.ok || !severityRes.ok || !weatherRes.ok) {
                    throw new Error('One or more requests failed');
                }

                const [
                    advisorySpeeds,
                    numberOfLanes,
                    severityDescriptions,
                    weatherConditions
                ] = await Promise.all([
                    advisorySpeedsRes.json(),
                    numberOfLanesRes.json(),
                    severityRes.json(),
                    weatherRes.json()
                ]);

                setFilterOptions(prev => ({
                    ...prev,
                    advisory_speed: Array.isArray(advisorySpeeds) ? advisorySpeeds : [],
                    number_of_lanes: Array.isArray(numberOfLanes) ? numberOfLanes : [],
                    severity_description: Array.isArray(severityDescriptions) ? severityDescriptions : [],
                    weather_condition: Array.isArray(weatherConditions) ? weatherConditions : []
                }));
            } catch (error) {
                console.error('Error fetching filter options:', error);
                setFilterOptions(prev => ({
                    ...prev,
                    advisory_speed: [],
                    number_of_lanes: [],
                    severity_description: [],
                    weather_condition: []
                }));
            }
        };

        fetchFilterOptions();
    }, []);

    useEffect(() => {
        console.log('Filter options updated:', filterOptions);
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
                maxHeight: '100%',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
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
                        onChange={handleTimeRangeChange}
                        min={2003}
                        max={2025}
                        valueLabelDisplay="auto"
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
                        color: 'text.secondary'
                    }}>
                        <Typography variant="body2">{yearRange[0]}</Typography>
                        <Typography variant="body2">{yearRange[1]}</Typography>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ mb: 2.5 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    endIcon={<ExpandMoreIcon />}
                >
                    Filters
                </Button>
                {isFiltersOpen && (
                    <Paper sx={{ mt: 1, p: 2 }}>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>Advisory Speed</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormGroup>
                                    {filterOptions.advisory_speed.map((speed) => (
                                        <FormControlLabel
                                            key={speed}
                                            control={
                                                <Checkbox
                                                    checked={filters.advisory_speed.includes(speed)}
                                                    onChange={(e) => {
                                                        const newValue = e.target.checked
                                                            ? [...filters.advisory_speed, speed]
                                                            : filters.advisory_speed.filter(s => s !== speed);
                                                        handleFilterChange('advisory_speed', newValue);
                                                    }}
                                                />
                                            }
                                            label={`${speed} km/h`}
                                        />
                                    ))}
                                </FormGroup>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>Number of Lanes</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormGroup>
                                    {filterOptions.number_of_lanes.map((lanes) => (
                                        <FormControlLabel
                                            key={lanes}
                                            control={
                                                <Checkbox
                                                    checked={filters.number_of_lanes.includes(lanes)}
                                                    onChange={(e) => {
                                                        const newValue = e.target.checked
                                                            ? [...filters.number_of_lanes, lanes]
                                                            : filters.number_of_lanes.filter(l => l !== lanes);
                                                        handleFilterChange('number_of_lanes', newValue);
                                                    }}
                                                />
                                            }
                                            label={`${lanes} lanes`}
                                        />
                                    ))}
                                </FormGroup>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>Vehicles Present</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
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
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>Crash Severity</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormGroup>
                                    {filterOptions.severity_description.map((severity) => (
                                        <FormControlLabel
                                            key={severity}
                                            control={
                                                <Checkbox
                                                    checked={filters.severity_description.includes(severity)}
                                                    onChange={(e) => {
                                                        const newValue = e.target.checked
                                                            ? [...filters.severity_description, severity]
                                                            : filters.severity_description.filter(s => s !== severity);
                                                        handleFilterChange('severity_description', newValue);
                                                    }}
                                                />
                                            }
                                            label={severity}
                                        />
                                    ))}
                                </FormGroup>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>Weather Conditions</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormGroup>
                                    {Array.isArray(filterOptions.weather_condition) && filterOptions.weather_condition.map((weather) => (
                                        <FormControlLabel
                                            key={weather}
                                            control={
                                                <Checkbox
                                                    checked={filters.weather_condition.includes(weather)}
                                                    onChange={(e) => {
                                                        const newValue = e.target.checked
                                                            ? [...filters.weather_condition, weather]
                                                            : filters.weather_condition.filter(w => w !== weather);
                                                        handleFilterChange('weather_condition', newValue);
                                                    }}
                                                />
                                            }
                                            label={weather}
                                        />
                                    ))}
                                </FormGroup>
                            </AccordionDetails>
                        </Accordion>
                    </Paper>
                )}
            </Box>

            <Button
                variant="contained"
                onClick={() => onLoad(filters)}
                sx={{ mt: 'auto' }}
            >
                Load
            </Button>
        </Paper>
    );
};

export default ControlPanel; 