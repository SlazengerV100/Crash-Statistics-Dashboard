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
                console.log(`Table ${tableName} created or already exists.`);
            }
        });
    };

    const dummyTable = `
    OBJECTID INTEGER PRIMARY KEY,
    advisorySpeed TEXT,
    areaUnitID INTEGER,
    bicycle INTEGER,
    bridge INTEGER,
    bus INTEGER,
    carStationWagon INTEGER,
    cliffBank INTEGER,
    crashDirectionDescription TEXT,
    crashFinancialYear TEXT,
    crashLocation1 TEXT,
    crashLocation2 TEXT,
    crashRoadSideRoad TEXT,
    crashSeverity TEXT,
    crashSHDescription TEXT,
    crashYear INTEGER,
    debris INTEGER,
    directionRoleDescription TEXT,
    ditch INTEGER,
    fatalCount INTEGER,
    fence INTEGER,
    flatHill TEXT,
    guardRail INTEGER,
    holiday TEXT,
    houseOrBuilding INTEGER,
    intersection TEXT,
    kerb INTEGER,
    light TEXT,
    meshblockId INTEGER,
    minorInjuryCount INTEGER,
    moped INTEGER,
    motorcycle INTEGER,
    NumberOfLanes INTEGER,
    objectThrownOrDropped INTEGER,
    otherObject INTEGER,
    otherVehicleType INTEGER,
    overBank INTEGER,
    parkedVehicle INTEGER,
    pedestrian INTEGER,
    phoneBoxEtc INTEGER,
    postOrPole INTEGER,
    region TEXT,
    roadCharacter TEXT,
    roadLane TEXT,
    roadSurface TEXT,
    roadworks INTEGER,
    schoolBus INTEGER,
    seriousInjuryCount INTEGER,
    slipOrFlood INTEGER,
    speedLimit INTEGER,
    strayAnimal INTEGER,
    streetLight TEXT,
    suv INTEGER,
    taxi INTEGER,
    temporarySpeedLimit INTEGER,
    tlaId INTEGER,
    tlaName TEXT,
    trafficControl TEXT,
    trafficIsland INTEGER,
    trafficSign INTEGER,
    train INTEGER,
    tree INTEGER,
    truck INTEGER,
    unknownVehicleType INTEGER,
    urban TEXT,
    vanOrUtility INTEGER,
    vehicle INTEGER,
    waterRiver INTEGER,
    weatherA TEXT,
    weatherB TEXT,
    longitude REAL,
    latitude REAL
`;

     createTable('dummy_table', dummyTable)

    const weatherTable = `
    weather_condition TEXT PRIMARY KEY
    `
    createTable('weather_conditions', weatherTable)

    const regionTable = `
    region_name TEXT PRIMARY KEY
    `
    createTable('region', regionTable)

    const locationTable = `
    crash_id INTEGER PRIMARY KEY,
    longitude REAL,
    latitude REAL,
    crash_location_1 TEXT,
    crash_location_2 TEXT,
    region_name TEXT,
    tla_name TEXT,
    FOREIGN KEY (tla_name) REFERENCES tla_names(tla_name),
    FOREIGN KEY (region_name) REFERENCES region(region_name),
    FOREIGN KEY (crash_id) REFERENCES crashes(id)
`;
    createTable('location', locationTable)

    const tlaNamesTable = `
    tla_name TEXT PRIMARY KEY
    `
    createTable('tla_names', tlaNamesTable)

    const crashSeverityTable = `
    severity_description TEXT PRIMARY KEY
    `
    createTable('crash_severity', crashSeverityTable)

    const trafficControlTable = `
    traffic_control_description TEXT PRIMARY KEY
    `
    createTable('traffic_control', trafficControlTable)

    const roadFeaturesTable = `
    feature_name TEXT PRIMARY KEY
    `
    createTable('road_features', roadFeaturesTable)

    const crashesTable = `
    id INTEGER PRIMARY KEY,
    crash_year INTEGER,
    fatal_count INTEGER,
    minor_injury_count INTEGER,
    serious_injury_count INTEGER,
    speed_limit INTEGER,
    severity_description TEXT,
    traffic_control_description TEXT,
    feature_name TEXT,
    FOREIGN KEY (severity_description) REFERENCES crash_severity(severity_description),
    FOREIGN KEY (traffic_control_description) REFERENCES traffic_control(traffic_control_description),
    FOREIGN KEY (feature_name) REFERENCES road_features(feature_name)
    `
    createTable('crashes', crashesTable)

    const crashWeatherConditionTable = `
    crash_id INTEGER,
    urban BOOLEAN,
    weather_a TEXT,
    weather_b TEXT,
    PRIMARY KEY (crash_id, weather_a, weather_b),
    FOREIGN KEY (crash_id) REFERENCES crashes(id),
    FOREIGN KEY (weather_a) REFERENCES weather_conditions(weather_condition),
    FOREIGN KEY (weather_b) REFERENCES weather_conditions(weather_condition)
    `
    createTable('crash_weather', crashWeatherConditionTable)

    const holidaysTable = `
    holiday TEXT PRIMARY KEY
    `;
    createTable('holidays', holidaysTable)
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
    pedestrian INTEGER DEFAULT 0,
    post_or_pole INTEGER DEFAULT 0,
    motorbike INTEGER DEFAULT 0,
    truck INTEGER DEFAULT 0,
    holiday TEXT,
    FOREIGN KEY (holiday) REFERENCES holidays(holiday),
    FOREIGN KEY (crash_id) REFERENCES crashes(id)
    `
    createTable('crash_stats', crashStatsTable)

    db.all('SELECT name FROM sqlite_master WHERE type="table"', (err, rows) => {
        if (err) {
            console.error('Error listing tables:', err.message)
        } else {
            console.log('Tables in the database:', rows.map(r => r.name))
        }
    })

    console.log('Database schema initialized successfully!')
}

initDB()

db.close((err) => {
    if (err) {
        console.error('Error closing the database:', err.message)
    } else {
        console.log('Database connection closed.')
    }
})