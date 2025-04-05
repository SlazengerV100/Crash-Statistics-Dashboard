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
    const { selectedRegions, startYear, endYear } = req.body;

    const start = parseInt(startYear);
    const end = parseInt(endYear);

    // Validate years
    if (start > end) {
        return res.status(400).json({ 
            error: 'Invalid year range. startYear must be less than or equal to endYear'
        });
    }

    // Kahu can u make this better if it needs to be?
    const placeholders = selectedRegions.map(() => '?').join(',');
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
    const params = [...selectedRegions, start, end];

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
            const dataByRegion = selectedRegions.reduce((acc, selectedRegions) => {
                acc[selectedRegions] = years.reduce((yearAcc, year) => {
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
                datasets: selectedRegions.map(selectedRegions => ({
                    label: selectedRegions,
                    data: years.map(year => dataByRegion[selectedRegions][year])
                }))
            };

            res.json(response);
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
            const regions = rows.map(row => row.region_name);
            res.json(regions);
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