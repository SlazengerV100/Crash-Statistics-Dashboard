import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';


const RegionCard = ({}) => {
  return (
    <Card sx={{ minWidth: 275, margin: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {regionName}
        </Typography>
        <Typography variant="body2">
          {regionDescription}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RegionCard;