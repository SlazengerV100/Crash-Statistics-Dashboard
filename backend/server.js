const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./backend/my_database.db');

const app = express();
const port = 5000;

app.get('/api/crashes', (req, res) => {
    const query = 'SELECT * FROM crashes LIMIT 10';
    db.all(query, (err, rows) => {
        if (err) {
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
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
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
