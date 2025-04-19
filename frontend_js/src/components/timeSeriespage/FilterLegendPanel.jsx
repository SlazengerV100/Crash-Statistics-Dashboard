import React from 'react';
import { Box, Typography } from '@mui/material';

const emojiMaps = {
    vehicles: {
        'bus': '🚌',
        'bicycle': '🚲',
        'moped': '🛵',
        'car_station_wagon': '🚗',
        'truck': '🚚',
    },
    weather: {
        'Fine': '☀️',
        'Frost': '❄️',
        'Hail or Sleet': '🌨️',
        'Heavy Rain': '🌧️',
        'Light Rain': '🌦️',
        'Mist or Fog': '🌫️',
        'None': '❌',
        'Null': '❌',
        'Snow': '❄️',
        'Strong wind': '🌬️',
    },
    severity: {
        'Non-Injury Crash': '👌',
        'Minor Crash': '⚠️',
        'Serious Crash': '🚨',
        'Fatal Crash': '☠️',
    }
};

const FilterLegendPanel = ({ filters }) => {
    const items = [];

    // VEHICLES
    if (filters.vehicles?.length > 0) {
        filters.vehicles.forEach(vehicle => {
            const emoji = emojiMaps.vehicles[vehicle];
            if (emoji) {
                items.push({ label: vehicle.replace(/_/g, ' '), emoji });
            }
        });
    }

    // WEATHER
    if (filters.weather_condition && emojiMaps.weather[filters.weather_condition]) {
        items.push({
            label: filters.weather_condition,
            emoji: emojiMaps.weather[filters.weather_condition]
        });
    }

    // SEVERITY
    if (filters.severity_description && emojiMaps.severity[filters.severity_description]) {
        items.push({
            label: filters.severity_description.replace(' Crash', ''),
            emoji: emojiMaps.severity[filters.severity_description]
        });
    }

    // SPEED LIMIT
    if (filters.speed_limit?.length > 0) {
        const min = Math.min(...filters.speed_limit);
        const max = Math.max(...filters.speed_limit);
        const range = min === max ? `${min}km` : `${min}–${max}km`;
        items.push({
            label: 'Speed',
            emoji: range
        });
    }

    // NUMBER OF LANES
    if (filters.number_of_lanes?.length > 0) {
        const min = Math.min(...filters.number_of_lanes);
        const max = Math.max(...filters.number_of_lanes);
        const range = min === max ? `${min}` : `${min}–${max}`;
        items.push({
            label: 'Lanes',
            emoji: range
        });
    }

    if (items.length === 0) return null;

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 6,
                left: 20,
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                borderRadius: 2,
                px: 2,
                py: 1,
                boxShadow: 2,
                display: 'flex',
                gap: 3,
                alignItems: 'center',
                flexWrap: 'wrap'
            }}
        >
            {items.map((item, index) => (
                <Box 
                    key={index}
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: 48
                    }}
                >
                    <Typography 
                        fontSize={28} 
                        textAlign="center"
                        lineHeight={1}
                    >
                        {item.emoji}
                    </Typography>
                    <Typography 
                        fontSize={12} 
                        textAlign="center"
                        sx={{ mt: 0.5 }}
                    >
                        {item.label}
                    </Typography>
                </Box>
            ))}

        </Box>
    );
};

export default FilterLegendPanel;

