const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('my_database.db');

const initDB = () => {
  const createTable = (tableName, tableDefinition) => {
    const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${tableDefinition})`;

    db.run(query, (err) => {
      if (err) {
        console.error(`Error creating table ${tableName}:`, err.message);
      } else {
        console.log(`Table ${tableName} created or already exists.`);
      }
    });
  };

  const weatherTable = `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    weather_condition TEXT NOT NULL
  `;
  createTable('weather_conditions', weatherTable);

  const crashSeverityTable = `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    severity_description TEXT NOT NULL
  `;
  createTable('crash_severity', crashSeverityTable);

  const regionTable = `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    region_name TEXT NOT NULL
  `;
  createTable('region', regionTable);

  const locationTable = `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    crash_location_1 TEXT,
    crash_location_2 TEXT,
    crash_road_side_road TEXT
  `;
  createTable('location', locationTable);

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
    advisory_speed INTEGER,
    area_unit_id INTEGER,
    crash_financial_year TEXT, -- e.g., "2002/2003"
    crash_year INTEGER,        -- e.g., "2002"
    fatal_count INTEGER,
    minor_injury_count INTEGER,
    serious_injury_count INTEGER,
    number_of_lanes INTEGER,
    speed_limit INTEGER,
    crash_severity_id INTEGER, -- Foreign key to crash_severity table
    region_id INTEGER,         -- Foreign key to region table
    location_id INTEGER,       -- Foreign key to location table
    traffic_control_id INTEGER, -- Foreign key to traffic_control table
    road_features_id INTEGER,  -- Foreign key to road_features table
    vehicle_ids TEXT,          -- Comma-separated vehicle type IDs (many-to-many relation)
    FOREIGN KEY (crash_severity_id) REFERENCES crash_severity(id),
    FOREIGN KEY (region_id) REFERENCES region(id),
    FOREIGN KEY (location_id) REFERENCES location(id),
    FOREIGN KEY (traffic_control_id) REFERENCES traffic_control(id),
    FOREIGN KEY (road_features_id) REFERENCES road_features(id)
  `;
  createTable('crashes', crashesTable);

  const crashWeatherTable = `
    crash_id INTEGER,  -- Foreign key to crashes table
    weather_id INTEGER, -- Foreign key to weather_conditions table
    PRIMARY KEY (crash_id, weather_id),
    FOREIGN KEY (crash_id) REFERENCES crashes(OBJECTID),
    FOREIGN KEY (weather_id) REFERENCES weather_conditions(id)
  `;
  createTable('crash_weather', crashWeatherTable);

  const vehicleTypesTable = `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_type TEXT NOT NULL
  `;
  createTable('vehicle_types', vehicleTypesTable);

  const crashVehicleTable = `
    crash_id INTEGER,           -- Foreign key to crashes table
    vehicle_type_id INTEGER,    -- Foreign key to vehicle_types table
    PRIMARY KEY (crash_id, vehicle_type_id),
    FOREIGN KEY (crash_id) REFERENCES crashes(OBJECTID),
    FOREIGN KEY (vehicle_type_id) REFERENCES vehicle_types(id)
  `;
  createTable('crash_vehicle', crashVehicleTable);

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