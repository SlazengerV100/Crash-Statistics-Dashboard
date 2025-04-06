import express from 'express';
import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables
dotenv.config();

const db = new sqlite3.Database(process.env.DATABASE_PATH, (err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

const app = express();

// Use CORS middleware to allow requests from any origin
app.use(cors());

// Add JSON body parser middleware
app.use(express.json());

const port = process.env.PORT || 5001;

// Add error handling middleware
app.use((err, req, res, next) => {
    console.log('ERROR');
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.get('/api/crashes', (req, res) => {
    const query = 'SELECT * FROM crashes LIMIT 10';
    db.all(query, (err, rows) => {
        if (err) {
            console.error('Error fetching crashes:', err);
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

app.get('/api/vehicle-types', (req, res) => {
    const query = 'SELECT * FROM vehicle_types LIMIT 10';
    db.all(query, (err, rows) => {
        if (err) {
            console.error('Error fetching vehicle types:', err);
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Get crash counts by regions across years
app.post('/api/crashes/yearly-counts', (req, res) => {
    const { 
        selectedRegions, 
        startYear, 
        endYear,
        filters
    } = req.body;
    const regions = selectedRegions.map(region => region + " Region");

    const start = parseInt(startYear);
    const end = parseInt(endYear);

    // Validate years
    if (start > end) {
        return res.status(400).json({ 
            error: 'Invalid year range. startYear must be less than or equal to endYear'
        });
    }

    let query = `
        SELECT 
            l.region_name,
            c.crash_year,
            COUNT(*) as crash_count
        FROM crashes c
        JOIN location l ON c.id = l.crash_id
        JOIN crash_stats cs ON c.id = cs.crash_id
        JOIN crash_weather cw ON c.id = cw.crash_id
        WHERE l.region_name IN (${regions.map(() => '?').join(',')})
        AND c.crash_year >= ? AND c.crash_year <= ?
    `;

    const params = [...regions, start, end];

    // Add filter conditions
    if (filters) {
        if (filters.advisory_speed) {
            query += ' AND cs.advisory_speed IN (' + filters.advisory_speed.map(() => '?').join(',') + ')';
            params.push(...filters.advisory_speed);
        }
        if (filters.number_of_lanes) {
            query += ' AND cs.number_of_lanes IN (' + filters.number_of_lanes.map(() => '?').join(',') + ')';
            params.push(...filters.number_of_lanes);
        }
        if (filters.vehicles) {
            const vehicleConditions = [];
            filters.vehicles.forEach(vehicle => {
                vehicleConditions.push('cs.' + vehicle + ' > 0');
            });
            if (vehicleConditions.length > 0) {
                query += ' AND (' + vehicleConditions.join(' OR ') + ')';
            }
        }
        if (filters.severity_description) {
            query += ' AND c.severity_description IN (' + filters.severity_description.map(() => '?').join(',') + ')';
            params.push(...filters.severity_description);
        }
        if (filters.weather_condition) {
            query += ' AND cw.weather_condition IN (' + filters.weather_condition.map(() => '?').join(',') + ')';
            params.push(...filters.weather_condition);
        }
    }

    query += ' GROUP BY l.region_name, c.crash_year ORDER BY c.crash_year, l.region_name';

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Error fetching yearly crash counts:', err);
            res.status(500).json({ error: err.message });
            return;
        }

        try {
            // Generate array of years for x-axis
            const years = Array.from(
                { length: end - start + 1 }, 
                (_, i) => start + i
            );

            // Process data for Chart.js format
            const dataByRegion = regions.reduce((acc, region) => {
                acc[region] = years.reduce((yearAcc, year) => {
                    yearAcc[year] = 0;
                    return yearAcc;
                }, {});
                return acc;
            }, {});

            // Fill in actual crash counts
            rows.forEach(row => {
                if (row.region_name in dataByRegion) {
                    dataByRegion[row.region_name][row.crash_year] = row.crash_count;
                }
            });

            // Format response for Chart.js with consistent region names
            const response = {
                labels: years,
                datasets: regions.map(region => ({
                    label: region.replace(' Region', ''),
                    data: years.map(year => dataByRegion[region][year] || 0)
                }))
            };

            res.json(response);
        } catch (error) {
            console.error('Error processing data:', error);
            res.status(500).json({ error: 'Error processing data' });
        }
    });
});

// Get all unique regions
app.get('/api/regions', (req, res) => {
    const query = `
        SELECT DISTINCT region_name 
        FROM location 
        WHERE region_name IS NOT NULL 
        ORDER BY region_name
    `;

    db.all(query, (err, rows) => {
        if (err) {
            console.error('Error fetching regions:', err);
            res.status(500).json({ error: err.message });
        } else {
            const regions = rows.map(row => row.region_name.replace(' Region', ''));
            res.json(regions);
        }
    });
});

// Add these new endpoints to fetch filter options
app.get('/api/filters/advisory-speeds', (req, res) => {
    const query = 'SELECT DISTINCT advisory_speed FROM crash_stats WHERE advisory_speed IS NOT NULL ORDER BY advisory_speed';
    db.all(query, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows.map(row => row.advisory_speed));
        }
    });
});

app.get('/api/filters/number-of-lanes', (req, res) => {
    const query = 'SELECT DISTINCT number_of_lanes FROM crash_stats WHERE number_of_lanes IS NOT NULL ORDER BY number_of_lanes';
    db.all(query, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows.map(row => row.number_of_lanes));
        }
    });
});

app.get('/api/filters/severity', (req, res) => {
    const query = 'SELECT DISTINCT severity_description FROM crashes WHERE severity_description IS NOT NULL ORDER BY severity_description';
    db.all(query, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows.map(row => row.severity_description));
        }
    });
});

app.get('/api/filters/weather', (req, res) => {
    const query = 'SELECT DISTINCT weather_condition FROM crash_weather WHERE weather_condition IS NOT NULL ORDER BY weather_condition';
    db.all(query, (err, rows) => {
        if (err) {
            console.error('Error fetching weather conditions:', err);
            res.status(500).json({ error: err.message });
        } else {
            // Ensure we're sending an array of weather conditions
            const weatherConditions = rows.map(row => row.weather_condition);
            console.log('Weather conditions:', weatherConditions); // Debug log
            res.json(weatherConditions);
        }
    });
});

const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

// Handle server errors
server.on('error', (error) => {
    console.error('Server error:', error);
});

process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});

// Keep the process running
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});