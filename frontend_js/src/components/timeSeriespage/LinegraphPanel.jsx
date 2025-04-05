import React from 'react';
import { Paper, Box, Typography } from '@mui/material';

const LinegraphPanel = ({ data, isLoading }) => {
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
                    {/* Graph will be rendered here when data is available */}
                </Box>
            )}
        </Paper>
    );
};

export default LinegraphPanel; 