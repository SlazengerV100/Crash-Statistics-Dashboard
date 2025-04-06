import sqlite3 from 'sqlite3';
import fs from 'fs';
import JSONStream from 'JSONStream';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const jsonDataPath = process.env.GEONJSON_PATH;
const loadDataSQLPath = "load_data.sql";
const initDBPath = "initDB.sql";
const db = new sqlite3.Database('my_database.db');

const executeSQL = (filePath) => {
    const sql = fs.readFileSync(filePath, 'utf8');
    db.exec(sql, (err) => {
        if (err) {
            console.error('Error executing load_data.sql:', err.message);
        } else {
            console.log('load_data.sql executed successfully');
        }
    });
};

executeSQL(initDBPath)

const insertStmt = db.prepare(`
    INSERT INTO dummy_table (OBJECTID, advisorySpeed, areaUnitID, bicycle, bridge, bus, carStationWagon,
                             cliffBank, crashDirectionDescription, crashFinancialYear, crashLocation1,
                             crashLocation2, crashRoadSideRoad, crashSeverity, crashSHDescription, crashYear,
                             debris, directionRoleDescription, ditch, fatalCount, fence, flatHill, guardRail,
                             holiday, houseOrBuilding, intersection, kerb, light, meshblockId, minorInjuryCount,
                             moped, motorcycle, NumberOfLanes, objectThrownOrDropped, otherObject,
                             otherVehicleType, overBank, parkedVehicle, pedestrian, phoneBoxEtc, postOrPole,
                             region, roadCharacter, roadLane, roadSurface, roadworks, schoolBus,
                             seriousInjuryCount, slipOrFlood, speedLimit, strayAnimal, streetLight, suv, taxi,
                             temporarySpeedLimit, tlaId, tlaName, trafficControl, trafficIsland, trafficSign,
                             train, tree, truck, unknownVehicleType, urban, vanOrUtility, vehicle, waterRiver,
                             weatherA, weatherB, longitude, latitude)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

// Stream the JSON file and process each feature incrementally
const stream = fs.createReadStream(jsonDataPath, {encoding: 'utf8'});
const parser = JSONStream.parse('features.*');
let rowsProcessed = 0;

stream.pipe(parser);

db.serialize(() => {
    parser.on('data', (feature) => {
        try {
            const p = feature.properties || {};
            const coords = feature.geometry?.coordinates || [null, null];

            // Insert the data into the dummy table
            insertStmt.run([
                p.OBJECTID ?? null, p.advisorySpeed ?? null, p.areaUnitID ?? null, p.bicycle ?? null,
                p.bridge ?? null, p.bus ?? null, p.carStationWagon ?? null, p.cliffBank ?? null,
                p.crashDirectionDescription ?? null, p.crashFinancialYear ?? null, p.crashLocation1 ?? null,
                p.crashLocation2 ?? null, p.crashRoadSideRoad ?? null, p.crashSeverity ?? null,
                p.crashSHDescription ?? null, p.crashYear ?? null, p.debris ?? null, p.directionRoleDescription ?? null,
                p.ditch ?? null, p.fatalCount ?? null, p.fence ?? null, p.flatHill ?? null, p.guardRail ?? null,
                p.holiday ?? null, p.houseOrBuilding ?? null, p.intersection ?? null, p.kerb ?? null,
                p.light ?? null, p.meshblockId ?? null, p.minorInjuryCount ?? null, p.moped ?? null,
                p.motorcycle ?? null, p.NumberOfLanes ?? null, p.objectThrownOrDropped ?? null, p.otherObject ?? null,
                p.otherVehicleType ?? null, p.overBank ?? null, p.parkedVehicle ?? null, p.pedestrian ?? null,
                p.phoneBoxEtc ?? null, p.postOrPole ?? null, p.region ?? null, p.roadCharacter ?? null,
                p.roadLane ?? null, p.roadSurface ?? null, p.roadworks ?? null, p.schoolBus ?? null,
                p.seriousInjuryCount ?? null, p.slipOrFlood ?? null, p.speedLimit ?? null, p.strayAnimal ?? null,
                p.streetLight ?? null, p.suv ?? null, p.taxi ?? null, p.temporarySpeedLimit ?? null,
                p.tlaId ?? null, p.tlaName ?? null, p.trafficControl ?? null, p.trafficIsland ?? null,
                p.trafficSign ?? null, p.train ?? null, p.tree ?? null, p.truck ?? null,
                p.unknownVehicleType ?? null, p.urban ?? null, p.vanOrUtility ?? null, p.vehicle ?? null,
                p.waterRiver ?? null, p.weatherA ?? null, p.weatherB ?? null,
                coords[0] ?? null, coords[1] ?? null
            ]);

            rowsProcessed++;
            if (rowsProcessed % 10 === 0) {
                console.log(`Processed ${rowsProcessed} rows...`);
            }
        } catch (error) {
            console.error('Error processing feature:', error.message);
        }
    });

    parser.on('end', () => {
        console.log(`Finished processing ${rowsProcessed} features.`);
        console.log('Executing load_data.sql...');
        executeSQL(loadDataSQLPath);
    });

    parser.on('error', (error) => {
        console.error('Error reading or parsing JSON:', error.message);
    });
});
