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

INSERT INTO vehicle_crash_stats
(crash_id, bicycle, bus, car_station_wagon, motorcycle, moped, other_vehicle, unknown_vehicle, pedestrian,
 parked_vehicle, school_bus, suv, taxi, train, truck, van_or_utility)
SELECT dummy_table.OBJECTID,
       COALESCE(dummy_table.bicycle, 0),
       COALESCE(dummy_table.bus, 0),
       COALESCE(dummy_table.carStationWagon, 0),
       COALESCE(dummy_table.motorcycle, 0),
       COALESCE(dummy_table.moped, 0),
       COALESCE(dummy_table.otherVehicleType, 0),
       COALESCE(dummy_table.unknownVehicleType, 0),
       COALESCE(dummy_table.pedestrian, 0),
       COALESCE(dummy_table.parkedVehicle, 0),
       COALESCE(dummy_table.schoolBus, 0),
       COALESCE(dummy_table.suv, 0),
       COALESCE(dummy_table.taxi, 0),
       COALESCE(dummy_table.train, 0),
       COALESCE(dummy_table.truck, 0),
       COALESCE(dummy_table.vanOrUtility, 0)
FROM dummy_table;

DROP TABLE dummy_table;

SELECT bicycle > 0                          AS Bicycle,
       bus > 0                              AS Bus,
       car_station_wagon = 1                AS Car,
       car_station_wagon > 1                AS [Multiple Cars],
                          moped > 0                            AS Moped,
                          motorcycle > 0                       AS Motorcycle,
                          other_vehicle > 0 OR unknown_vehicle AS [Other Vehicle],
                          parked_vehicle > 0                   AS [Parked Vehicle],
                          pedestrian > 0                       AS Pedestrian,
                          school_bus > 0                       AS [School Bus],
                          suv > 0                              AS SUV,
                          taxi > 0                             AS Taxi,
                          train > 0                            AS Train,
                          truck > 0                            AS Truck,
                          van_or_utility                       AS [Van or Utility],
                          COUNT(*)                             AS [Crash Count]
FROM vehicle_crash_stats
GROUP BY bicycle > 0,
    bus > 0,
    car_station_wagon = 1,
    car_station_wagon > 1,
    moped > 0,
    motorcycle > 0,
    other_vehicle > 0,
    parked_vehicle > 0,
    pedestrian > 0,
    school_bus > 0,
    suv > 0,
    taxi > 0,
    train > 0,
    truck > 0,
    van_or_utility > 0
ORDER BY [Crash Count] DESC