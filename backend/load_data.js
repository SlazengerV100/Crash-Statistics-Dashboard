const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const readline = require('readline');

// Initialize SQLite DB connection
const db = new sqlite3.Database('my_database.db');

// Create a read stream for the large file
const fileStream = fs.createReadStream('/Users/kahu/Downloads/Crash_Analysis_System_(CAS)_data.geojson', 'utf8');
const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
});

let currentLine = '';
let isGeoJSONStart = false;
let isGeoJSONEnd = false;
let totalLines = 0;
let processedLines = 0;
let totalFeatures = 0;
let processedFeatures = 0;

// First, count the total lines and features for progress tracking
rl.on('line', (line) => {
    totalLines++;
});

rl.on('close', () => {
    console.log(`Total lines in file: ${totalLines}`);
});

// Process each line of the GeoJSON file
rl.on('line', (line) => {
    currentLine += line.trim();

    // Check if the start of the GeoJSON file is found
    if (currentLine.startsWith('{') && !isGeoJSONStart) {
        isGeoJSONStart = true;
    }

    // Check if the end of the GeoJSON file is found
    if (currentLine.endsWith('}') && !isGeoJSONEnd && isGeoJSONStart) {
        isGeoJSONEnd = true;

        try {
            // Parse the GeoJSON content
            const geojson = JSON.parse(currentLine);
            totalFeatures = geojson.features.length;

            // Loop through each feature and insert weather data into the database
            geojson.features.forEach((feature, index) => {
                const properties = feature.properties;
                const weatherCondition = properties.weatherA;

                if (weatherCondition) {
                    insertWeatherConditions(weatherCondition);
                }

            });

            console.log('Weather data processed successfully.');
        } catch (parseError) {
            console.error('Error parsing the GeoJSON content:', parseError);
        }

        // Close the read stream once processing is done
        rl.close();
    }

    processedLines++;

    // Show progress every 100 lines processed
  console.log(`${processedLines} ${totalLines}`)
});

// Handle any stream errors
fileStream.on('error', (err) => {
    console.error('Error reading the file stream:', err);
});

// Function to insert weather data into the weather_conditions table
const insertWeatherConditions = (weatherCondition) => {
    const query = `INSERT INTO weather_conditions (weather_condition) VALUES (?)`;

    db.run(query, [weatherCondition], function (err) {
        if (err) {
            console.error('Error inserting weather condition:', err.message);
        } else {
            // You can also log progress of successful inserts if needed
        }
    });
};

// Close the database connection once done
rl.on('close', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing the database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
    });
});
