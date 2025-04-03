const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('my_database.db');

const initDB = () => {
    const createTable = (tableName, tableDefinition) => {
        const query = `CREATE TABLE IF NOT EXISTS ${tableName}
                       (
                           ${tableDefinition}
                       )`;

        db.run(query, (err) => {
            if (err) {
                console.error(`Error creating table ${tableName}:`, err.message);
            } else {
                console.log(`Table ${tableName} created`);
            }
        });
    };

    const weatherTable = `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    weather_condition TEXT NOT NULL
    `;
    createTable('weather_conditions', weatherTable);

    const regionTable = `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    region_name TEXT NOT NULL
    `;
    createTable('region', regionTable);

    const locationTable = `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    crash_id INTEGER, -- This needs to be a foreign key to crashes, as there will be one location entry per crash
    longitude REAL,
    latitude REAL,
    crash_location_1 TEXT,
    crash_location_2 TEXT,
    region_id INTEGER,
    FOREIGN KEY (region_id) REFERENCES region(id),
    FOREIGN KEY (crash_id) REFERENCES crashes(OBJECTID) -- Foreign key to crashes table
    `;
    createTable('location', locationTable);

    const tlaNamesTable = `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tla_name TEXT NOT NULL
    `;
    createTable('tla_names', tlaNamesTable); // Fixed table name mismatch

    const crashSeverityTable = `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    severity_description TEXT NOT NULL
    `;
    createTable('crash_severity', crashSeverityTable);

    const trafficControlTable = `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    traffic_control_description TEXT
    `;
    createTable('traffic_control', trafficControlTable);

    const roadFeaturesTable = `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    feature_name TEXT
    `;
    createTable('road_features', roadFeaturesTable);

    const crashesTable = `
    OBJECTID INTEGER PRIMARY KEY,
    crash_year INTEGER,        -- e.g., "2002"
    fatal_count INTEGER,
    minor_injury_count INTEGER,
    serious_injury_count INTEGER,
    speed_limit INTEGER,
    crash_severity_id INTEGER, -- Foreign key to crash_severity table
    region_id INTEGER,         -- Foreign key to region table
    location_id INTEGER,       -- Foreign key to location table
    traffic_control_id INTEGER, -- Foreign key to traffic_control table
    tla_id INTEGER,             -- Foreign key to tla_names table
    road_features_id INTEGER,  -- Foreign key to road_features table
    FOREIGN KEY (crash_severity_id) REFERENCES crash_severity(id),
    FOREIGN KEY (region_id) REFERENCES region(id),
    FOREIGN KEY (location_id) REFERENCES location(id),
    FOREIGN KEY (traffic_control_id) REFERENCES traffic_control(id),
    FOREIGN KEY (road_features_id) REFERENCES road_features(id),
    FOREIGN KEY (tla_id) REFERENCES tla_names(id) -- Added foreign key to tla_names table
    `;
    createTable('crashes', crashesTable);

    const crashWeatherConditionTable = `
    crash_id INTEGER,  -- Foreign key to crashes table
    urban BOOLEAN, -- Changed to BOOLEAN
    weather_a INTEGER, -- Foreign key to weather_conditions table
    weather_b INTEGER, -- Foreign key to weather_conditions table
    PRIMARY KEY (crash_id, weather_a, weather_b),
    FOREIGN KEY (crash_id) REFERENCES crashes(OBJECTID),
    FOREIGN KEY (weather_a) REFERENCES weather_conditions(id),
    FOREIGN KEY (weather_b) REFERENCES weather_conditions(id)
    `;
    createTable('crash_weather', crashWeatherConditionTable);

    const crashStatsTable = `
    crash_id INTEGER PRIMARY KEY,
    bus INTEGER DEFAULT 0,
    bicycle INTEGER DEFAULT 0,
    moped INTEGER DEFAULT 0,
    bridge INTEGER DEFAULT 0,
    car_station_wagon INTEGER DEFAULT 0,
    cliff_bank INTEGER DEFAULT 0,
    advisory_speed INTEGER DEFAULT 0,
    ditch INTEGER DEFAULT 0,
    fence INTEGER DEFAULT 0,
    guard_rail INTEGER DEFAULT 0,
    house_or_building INTEGER DEFAULT 0,
    roadworks INTEGER DEFAULT 0,
    number_of_lanes INTEGER DEFAULT 0,
    FOREIGN KEY (crash_id) REFERENCES crashes(OBJECTID)
    `;
    createTable('crash_stats', crashStatsTable);

    db.all('SELECT name FROM sqlite_master WHERE type="table";', (err, rows) => {
        if (err) {
            console.error('Error listing tables:', err.message);
        } else {
            console.log('Tables in the database:', rows);
        }
    });

    console.log('Database schema initialized successfully!');
};

initDB();

db.close((err) => {
    if (err) {
        console.error('Error closing the database:', err.message);
    } else {
        console.log('Database connection closed.');
    }
});
