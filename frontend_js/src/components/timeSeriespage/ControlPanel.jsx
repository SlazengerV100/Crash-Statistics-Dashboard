import React, { useState } from 'react';
import { Paper, Autocomplete, TextField, Box, Typography, Button, IconButton, Slider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ControlPanel = ({ onLoad }) => {
    const [selectedRegions, setSelectedRegions] = useState(['Wellington', 'Auckland', 'Canterbury']);
    const [timeRange, setTimeRange] = useState([2008, 2025]);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    // Placeholder regions for the Autocomplete
    const regions = [
        'Wellington',
        'Auckland',
        'Canterbury',
        'Otago',
        'Waikato',
        'Bay of Plenty',
        'Manawatu-Wanganui',
        'Hawke\'s Bay',
        'Taranaki',
        'Northland'
    ];

    const handleRemoveRegion = (region) => {
        setSelectedRegions(selectedRegions.filter(r => r !== region));
    };

    const handleRegionSelect = (event, value) => {
        if (value && !selectedRegions.includes(value)) {
            setSelectedRegions([...selectedRegions, value]);
        }
    };

    const handleTimeRangeChange = (event, newValue) => {
        setTimeRange(newValue);
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
                        value={timeRange}
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
                        <Typography variant="body2">{timeRange[0]}</Typography>
                        <Typography variant="body2">{timeRange[1]}</Typography>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ mb: 2.5 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                >
                    Filters
                </Button>
                {isFiltersOpen && (
                    <Paper sx={{ mt: 1, p: 2 }}>
                        {/* Add filter options here */}
                    </Paper>
                )}
            </Box>

            <Button
                variant="contained"
                onClick={onLoad}
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