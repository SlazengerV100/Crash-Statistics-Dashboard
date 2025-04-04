INSERT INTO weather_conditions
SELECT weatherA
FROM dummy_table
WHERE weatherA IS NOT NULL
UNION
SELECT weatherB
FROM dummy_table
WHERE weatherB IS NOT NULL;

INSERT INTO region
SELECT DISTINCT region
from dummy_table
WHERE region IS NOT NULL;

INSERT INTO crash_severity
SELECT DISTINCT crashSeverity
FROM dummy_table
WHERE dummy_table.crashSeverity IS NOT NULL;

INSERT INTO tla_names
SELECT DISTINCT tlaName
FROM dummy_table
WHERE dummy_table.tlaName IS NOT NULL;

INSERT INTO traffic_control
SELECT DISTINCT trafficControl
FROM dummy_table
WHERE dummy_table.trafficControl IS NOT NULL;

INSERT INTO road_features
SELECT DISTINCT roadCharacter
FROM dummy_table
WHERE dummy_table.roadCharacter IS NOT NULL;

INSERT INTO crashes
SELECT dummy_table.OBJECTID,
       dummy_table.crashYear,
       dummy_table.fatalCount,
       dummy_table.minorInjuryCount,
       dummy_table.seriousInjuryCount,
       dummy_table.speedLimit,
       dummy_table.crashSeverity,
       dummy_table.trafficControl,
       dummy_table.roadCharacter
from dummy_table;

INSERT INTO crash_weather
SELECT dummy_table.OBJECTID,
       CASE WHEN dummy_table.urban = 'Urban' THEN true ELSE false END,
       dummy_table.weatherA,
       dummy_table.weatherB
FROM dummy_table;

INSERT INTO location
SELECT dummy_table.OBJECTID,
       dummy_table.latitude,
       dummy_table.longitude,
       dummy_table.crashLocation1,
       dummy_table.crashLocation2,
       dummy_table.region,
       dummy_table.tlaName
FROM dummy_table;

INSERT INTO holidays
SELECT DISTINCT dummy_table.holiday from dummy_table
WHERE dummy_table.holiday IS NOT NULL;

INSERT INTO crash_stats
(crash_id, bus, bicycle, moped, bridge, car_station_wagon, cliff_bank, advisory_speed, ditch, fence,
 guard_rail, house_or_building, roadworks, number_of_lanes, pedestrian, post_or_pole, motorbike,
 truck, holiday)
SELECT dummy_table.OBJECTID,
       COALESCE(dummy_table.bus, 0),
       COALESCE(dummy_table.bicycle, 0),
       COALESCE(dummy_table.moped, 0),
       COALESCE(dummy_table.bridge, 0),
       COALESCE(dummy_table.carStationWagon, 0),
       COALESCE(dummy_table.cliffBank, 0),
       COALESCE(dummy_table.advisorySpeed, 0),
       COALESCE(dummy_table.ditch, 0),
       COALESCE(dummy_table.fence, 0),
       COALESCE(dummy_table.guardRail, 0),
       COALESCE(dummy_table.houseOrBuilding, 0),
       COALESCE(dummy_table.roadworks, 0),
       COALESCE(dummy_table.numberOfLanes, 0),
       COALESCE(dummy_table.pedestrian, 0),
       COALESCE(dummy_table.postOrPole, 0),
       COALESCE(dummy_table.motorcycle, 0),
       COALESCE(dummy_table.truck, 0),
       dummy_table.holiday
FROM dummy_table;


