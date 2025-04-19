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

// Get the range of years available in the database
app.get('/api/years', (req, res) => {
    const query = `SELECT DISTINCT crash_year as year FROM crashes
        WHERE crash_year IS NOT NULL
        ORDER BY crash_year;`;

    db.all(query, (err, rows) => {
        if (err) {
            console.error('Error fetching years:', err);
            res.status(500).json({ error: err.message });
        } else {
            const years = rows.map(row => row.year);
            res.json(years);
        }
    });
});



// Get crash counts by regions across years
app.post('/api/crashes/yearly-counts', (req, res) => {
    const { selectedRegions, startYear, endYear, filters, isPerCapita } = req.body;
    const regions = selectedRegions.map(region => region + " Region");

    let query = `
        SELECT 
            l.region_name,
            c.crash_year,
            COUNT(*) as crash_count,
            r.population
        FROM crashes c
        JOIN location l ON c.id = l.crash_id
        JOIN crash_stats cs ON c.id = cs.crash_id
        JOIN crash_weather cw ON c.id = cw.crash_id
        JOIN region r ON l.region_name = r.region_name
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

    query += ' GROUP BY l.region_name, c.crash_year, r.population ORDER BY c.crash_year, l.region_name';

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Error fetching yearly crash counts:', err);
            res.status(500).json({ error: err.message });
            return;
        }

        try {
            const years = Array.from(
                { length: endYear - startYear + 1 }, 
                (_, i) => startYear + i
            );

            const dataByRegion = {};
            regions.forEach(region => {
                dataByRegion[region] = {};
                years.forEach(year => {
                    dataByRegion[region][year] = 0;
                });
            });

            // Fill in actual crash counts
            rows.forEach(row => {
                if (row.region_name in dataByRegion) {
                    const value = isPerCapita 
                        ? (row.crash_count / row.population) * 100000 // Convert to per 100,000 people
                        : row.crash_count;
                    dataByRegion[row.region_name][row.crash_year] = Number(value.toFixed(2));
                }
            });

            const response = {
                labels: years,
                datasets: regions.map(region => ({
                    label: region.replace(' Region', ''),
                    data: years.map(year => dataByRegion[region][year] || 0)
                })),
                isPerCapita
            };

            res.json(response);
        } catch (error) {
            console.error('Error processing data:', error);
            res.status(500).json({ error: 'Error processing data' });
        }
    });
});

// Get all crash locations for a specific year, returns geojson
app.post('/api/crashes/location', (req, res) => {
    // get year from params or null
    const year  = parseInt(req.query.year) || null;

    //fetch all crashes for a given year across nz, stores region, latitude, longitude, severerity and crash_id
    const neededQuery = `SELECT crash_id, region_name, latitude, longitude, severity_description
        FROM crashes c
        JOIN location l ON c.id = l.crash_id
        WHERE c.crash_year = ?
    `;


    db.all(neededQuery, [year], (err, rows) => {
        if (err) {
            console.error('Error fetching crashes:', err);
            res.status(500).json({ error: err.message });
        } else {
        const groupedByRegion = {};

        rows.forEach(row => {
            const region = row.region_name;
            if (!groupedByRegion[region]) {
                groupedByRegion[region] = [];
            }

            groupedByRegion[region].push({
                type: "Feature",
                properties: {
                    crash_id: row.crash_id,
                    severity: row.severity_description
                },
                geometry: {
                    type: "Point",
                    coordinates: [row.longitude, row.latitude]
                }
            });
        });

        // Now each region has its own FeatureCollection
        const geojsonByRegion = Object.fromEntries(
            Object.entries(groupedByRegion).map(([region, features]) => [
                region,
                {
                    type: "FeatureCollection",
                    features
                }
            ])
        );

        res.json(geojsonByRegion);
        };
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
    const query = `
        SELECT DISTINCT severity_description 
        FROM crashes 
        WHERE severity_description IS NOT NULL 
        ORDER BY severity_description`;
    
    db.all(query, (err, rows) => {
        if (err) {
            console.error('Error fetching severity descriptions:', err);
            res.status(500).json({ error: err.message });
        } else {
            const severities = rows.map(row => row.severity_description);
            console.log('Severities found:', severities); // Debug log
            res.json(severities);
        }
    });
});

app.get('/api/filters/weather', (req, res) => {
    const query = `
        SELECT DISTINCT weather_a as condition
        FROM crash_weather
        WHERE weather_a IS NOT NULL
        UNION
        SELECT DISTINCT weather_b as condition
        FROM crash_weather
        WHERE weather_b IS NOT NULL
        ORDER BY condition`;

    db.all(query, (err, rows) => {
        if (err) {
            console.error('Error fetching weather conditions:', err);
            res.status(500).json({ error: err.message });
        } else {
            const conditions = rows.map(row => row.condition);
            console.log('Weather conditions found:', conditions); // Debug log
            res.json(conditions);
        }
    });
});

app.get('/api/factors/vehicles', (req, res) => {
    const query = `
        SELECT 
            bicycle > 0                          AS bicycle,
            bus > 0                              AS bus,
            car_station_wagon = 1                AS car,
            car_station_wagon > 1                AS multipleCars,
            moped > 0                            AS moped,
            motorcycle > 0                       AS motorcycle,
            other_vehicle > 0 OR unknown_vehicle AS otherVehicle,
            parked_vehicle > 0                   AS parkedVehicle,
            pedestrian > 0                       AS pedestrian,
            school_bus > 0                       AS schoolBus,
            suv > 0                              AS suv,
            taxi > 0                             AS taxi,
            train > 0                             AS train,
            truck > 0                             AS truck,
            van_or_utility > 0                   AS vanOrUtility,
            COUNT(*)                             AS crashCount
        FROM vehicle_crash_stats
        GROUP BY 
            bicycle > 0,
            bus > 0,
            car_station_wagon = 1,
            car_station_wagon > 1,
            moped > 0,
            motorcycle > 0,
            other_vehicle > 0 OR unknown_vehicle,
            parked_vehicle > 0,
            pedestrian > 0,
            school_bus > 0,
            suv > 0,
            taxi > 0,
            train > 0,
            truck > 0,
            van_or_utility > 0
        ORDER BY crashCount DESC
    `;
    const vehicles = [
        'bicycle',
        'bus',
        'car',
        'multipleCars',
        'moped',
        'motorcycle',
        'otherVehicle',
        'parkedVehicle',
        'pedestrian',
        'schoolBus',
        'suv',
        'taxi',
        'train',
        'truck',
        'vanOrUtility'
    ];
    const vehicleLabels = {
        bicycle: 'Bicycle',
        bus: 'Bus',
        car: 'Car',
        multipleCars: 'Multiple Cars',
        moped: 'Moped',
        motorcycle: 'Motorcycle',
        otherVehicle: 'Other Vehicle',
        parkedVehicle: 'Parked Vehicle',
        pedestrian: 'Pedestrian',
        schoolBus: 'School Bus',
        suv: 'SUV',
        taxi: 'Taxi',
        train: 'Train',
        truck: 'Truck',
        vanOrUtility: 'Van or Utility'
    };

    db.all(query, (err, rows) => {
        if (err) {
            console.error('Error querying database:', err.message);
            return res.status(500).json({ error: 'Database query failed' });
        }

        const result = rows.map(row => {
            const involvedVehicles = vehicles
                .filter(flag => row[flag])
                .map(flag => vehicleLabels[flag])
                .sort()
                .join('-');

            return [involvedVehicles, row.crashCount];
        });

        res.json(result);
    });
});

app.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
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
