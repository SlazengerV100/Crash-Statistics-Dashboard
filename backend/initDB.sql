-- This script creates the database schema for the crash data analysis application.
-- It includes tables for crash data, weather conditions, regions, locations, and various vehicle types.
DROP TABLE IF EXISTS dummy_table;

-- create dummy table --
CREATE TABLE dummy_table (
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
    longitude REAL CHECK (longitude >= -180 AND longitude <= 180),
    latitude REAL CHECK (latitude >= -90 AND latitude <= 90)
);

-- Create weather_conditions table
CREATE TABLE IF NOT EXISTS weather_conditions (
                                                  weather_condition TEXT PRIMARY KEY
);

-- Create region table
CREATE TABLE IF NOT EXISTS region (
                                      region_name TEXT PRIMARY KEY
);

-- Create location table
CREATE TABLE IF NOT EXISTS location (
                                        crash_id INTEGER PRIMARY KEY,
                                        longitude REAL CHECK (longitude >= -180 AND longitude <= 180),
                                        latitude REAL CHECK (latitude >= -90 AND latitude <= 90),
                                        crash_location_1 TEXT,
                                        crash_location_2 TEXT,
                                        region_name TEXT,
                                        tla_name TEXT,
                                        FOREIGN KEY (tla_name) REFERENCES tla_names(tla_name),
                                        FOREIGN KEY (region_name) REFERENCES region(region_name),
                                        FOREIGN KEY (crash_id) REFERENCES crashes(id)
);

-- Create tla_names table
CREATE TABLE IF NOT EXISTS tla_names (
                                         tla_name TEXT PRIMARY KEY
);

-- Create crash_severity table
CREATE TABLE IF NOT EXISTS crash_severity (
                                              severity_description TEXT PRIMARY KEY
);

-- Create traffic_control table
CREATE TABLE IF NOT EXISTS traffic_control (
                                               traffic_control_description TEXT PRIMARY KEY
);

-- Create road_features table
CREATE TABLE IF NOT EXISTS road_features (
                                             feature_name TEXT PRIMARY KEY
);

-- Create crashes table
CREATE TABLE IF NOT EXISTS crashes (
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
);

-- Create crash_weather table
CREATE TABLE IF NOT EXISTS crash_weather (
                                             crash_id INTEGER,
                                             urban BOOLEAN,
                                             weather_a TEXT,
                                             weather_b TEXT,
                                             PRIMARY KEY (crash_id, weather_a, weather_b),
                                             FOREIGN KEY (crash_id) REFERENCES crashes(id),
                                             FOREIGN KEY (weather_a) REFERENCES weather_conditions(weather_condition),
                                             FOREIGN KEY (weather_b) REFERENCES weather_conditions(weather_condition)
);

-- Create holidays table
CREATE TABLE IF NOT EXISTS holidays (
                                        holiday TEXT PRIMARY KEY
);

-- Create crash_stats table
CREATE TABLE IF NOT EXISTS crash_stats (
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
);

CREATE TABLE IF NOT EXISTS vehicle_crash_stats
(
    crash_id          INTEGER PRIMARY KEY,
    bicycle           INTEGER DEFAULT 0,
    bus               INTEGER DEFAULT 0,
    car_station_wagon INTEGER DEFAULT 0,
    moped             INTEGER DEFAULT 0,
    motorcycle         INTEGER DEFAULT 0,
    other_vehicle     INTEGER DEFAULT 0,
    unknown_vehicle   INTEGER DEFAULT 0,
    parked_vehicle    INTEGER DEFAULT 0,
    pedestrian        INTEGER DEFAULT 0,
    school_bus        INTEGER DEFAULT 0,
    suv               INTEGER DEFAULT 0,
    taxi              INTEGER DEFAULT 0,
    train             INTEGER DEFAULT 0,
    truck             INTEGER DEFAULT 0,
    van_or_utility    INTEGER DEFAULT 0,
    FOREIGN KEY (crash_id) REFERENCES crashes (id)
);

CREATE TABLE IF NOT EXISTS obstacle_crash_stats
(
    crash_id          INTEGER PRIMARY KEY,
    bridge           INTEGER DEFAULT 0,
    cliffBank               INTEGER DEFAULT 0,
    debris INTEGER DEFAULT 0,
    ditch             INTEGER DEFAULT 0,
    fence        INTEGER DEFAULT 0,
    guardRail     INTEGER DEFAULT 0,
    houseOrBuilding   INTEGER DEFAULT 0,
    kerb    INTEGER DEFAULT 0,
    otherObject        INTEGER DEFAULT 0,
    overBank    INTEGER DEFAULT 0,
    phoneBoxEtc        INTEGER DEFAULT 0,
    postOrPole               INTEGER DEFAULT 0,
    strayAnimal              INTEGER DEFAULT 0,
    trafficIsland             INTEGER DEFAULT 0,
    trafficSign             INTEGER DEFAULT 0,
    tree             INTEGER DEFAULT 0,
    waterRiver    INTEGER DEFAULT 0,
    FOREIGN KEY (crash_id) REFERENCES crashes (id)
);