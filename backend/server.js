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
    console.log('Received request');
    console.log(req.body);
    const { regions, startYear, endYear } = req.body;
    
    // Validate input
    if (!regions || !Array.isArray(regions) || regions.length === 0) {
        return res.status(400).json({ 
            error: 'regions must be a non-empty array of region names'
        });
    }

    if (!startYear || !endYear) {
        return res.status(400).json({ 
            error: 'Both startYear and endYear are required in the request body'
        });
    }

    const start = parseInt(startYear);
    const end = parseInt(endYear);

    // Validate years
    if (isNaN(start) || isNaN(end) || start > end) {
        return res.status(400).json({ 
            error: 'Invalid year range. startYear must be less than or equal to endYear'
        });
    }

    // Create parameterized query with dynamic number of regions
    const placeholders = regions.map(() => '?').join(',');
    const query = `
        SELECT 
            l.region_name,
            c.crash_year,
            COUNT(*) as crash_count
        FROM crashes c
        JOIN location l ON c.id = l.crash_id
        WHERE l.region_name IN (${placeholders})
        AND c.crash_year >= ? AND c.crash_year <= ?
        GROUP BY l.region_name, c.crash_year
        ORDER BY c.crash_year, l.region_name
    `;

    // Combine regions array with year parameters
    const params = [...regions, start, end];

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Error fetching yearly crash counts:', err);
            res.status(500).json({ error: err.message });
        } else {
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
                dataByRegion[row.region_name][row.crash_year] = row.crash_count;
            });

            // Format response for Chart.js
            const response = {
                labels: years,
                datasets: regions.map(region => ({
                    label: region,
                    data: years.map(year => dataByRegion[region][year])
                }))
            };

            res.json(response);
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