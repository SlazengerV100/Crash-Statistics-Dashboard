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
    const { selectedRegions, startYear, endYear, filters } = req.body;
    const regions = selectedRegions.map(region => region + " Region");

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
        AND c.crash_year >= ? AND c.crash_year <= ?`;

    const params = [...regions, startYear, endYear];

    if (filters) {
        // Speed limit filter
        if (filters.speed_limit && filters.speed_limit.length === 2) {
            const [minSpeed, maxSpeed] = filters.speed_limit;
            query += ' AND c.speed_limit >= ? AND c.speed_limit <= ?';
            params.push(minSpeed, maxSpeed);
        }

        // Number of lanes filter
        if (filters.number_of_lanes && filters.number_of_lanes.length === 2) {
            const [minLanes, maxLanes] = filters.number_of_lanes;
            query += ' AND cs.number_of_lanes >= ? AND cs.number_of_lanes <= ?';
            params.push(minLanes, maxLanes);
        }

        // Vehicle filter
        if (filters.vehicles && filters.vehicles.length > 0) {
            const vehicleConditions = filters.vehicles.map(vehicle => {
                return `cs.${vehicle} > 0`;
            });
            if (vehicleConditions.length > 0) {
                query += ` AND (${vehicleConditions.join(' OR ')})`;
            }
        }

        // Updated Weather condition filter for single selection
        if (filters.weather_condition) {
            query += ` AND (cw.weather_a = ? OR cw.weather_b = ?)`;
            params.push(filters.weather_condition, filters.weather_condition);
        }

        // Updated Severity filter for single selection
        if (filters.severity_description) {
            query += ` AND c.severity_description = ?`;
            params.push(filters.severity_description);
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
                { length: endYear - startYear + 1 }, 
                (_, i) => startYear + i
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
    const query = `
        SELECT DISTINCT wc.weather_condition 
        FROM weather_conditions wc
        ORDER BY wc.weather_condition`;
        
    db.all(query, (err, rows) => {
        if (err) {
            console.error('Error fetching weather conditions:', err);
            res.status(500).json({ error: err.message });
        } else {
            const weatherConditions = rows.map(row => row.weather_condition);
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