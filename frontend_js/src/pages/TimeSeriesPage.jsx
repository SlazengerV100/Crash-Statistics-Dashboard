import React, { useState } from 'react';
import { Box } from '@mui/material';
import ControlPanel from '../components/timeSeriespage/ControlPanel';
import LinegraphPanel from '../components/timeSeriespage/LinegraphPanel';

const TimeSeriesPage = () => {
    const [graphData, setGraphData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLoad = () => {
        setIsLoading(true);
        // TODO: Implement data loading logic here
        setTimeout(() => {
            setIsLoading(false);
            // setGraphData(/* loaded data */);
        }, 1000);
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
            <ControlPanel onLoad={handleLoad} />
            <LinegraphPanel data={graphData} isLoading={isLoading} />
        </Box>
    );
};

export default TimeSeriesPage;
