import React, { useEffect } from 'react';
import { Paper, Box, Typography } from '@mui/material';
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

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const LinegraphPanel = ({ data, isLoading }) => {
    // Prepare chart data
    const chartData = {
        labels: data?.labels || [],
        datasets: data?.datasets?.map((dataset, index) => ({
            ...dataset,
            borderColor: `hsl(${index * 137.5}, 70%, 50%)`,
            tension: 0.1,
            fill: false,
            pointRadius: 3,
            pointHoverRadius: 5
        })) || []
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            title: {
                display: true,
                text: 'Crashes by Region Over Time',
                font: {
                    size: 16
                },
                padding: 20
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Crashes',
                    font: {
                        size: 14
                    }
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Year',
                    font: {
                        size: 14
                    }
                }
            }
        }
    };

    useEffect(() => {
        if (data) {
            console.log(data);
        }
    }, [data]);

    return (
        <Paper 
            elevation={2}
            sx={{
                p: 2.5,
                minHeight: 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                bgcolor: 'background.paper'
            }}
        >
            {isLoading ? (
                <Typography 
                    variant="body1" 
                    sx={{ 
                        color: 'text.secondary',
                        textAlign: 'center'
                    }}
                >
                    Loading...
                </Typography>
            ) : !data ? (
                <Typography 
                    variant="body1" 
                    sx={{ 
                        color: 'text.secondary',
                        textAlign: 'center'
                    }}
                >
                    No graph loaded
                </Typography>
            ) : (
                <Box sx={{ width: '100%', height: '100%' }}>
                    <Line data={chartData} options={options} />
                </Box>
            )}
        </Paper>
    );
};

export default LinegraphPanel; 