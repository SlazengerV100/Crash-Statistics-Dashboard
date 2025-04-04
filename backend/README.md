# Getting the Backend Loaded

### Loading the Database:

Before starting, ensure you have the crash data GeoJSON file. If you don't already have a database file, follow the steps below to load the data.

#### Steps:

1. **Prepare the Environment:**
    - Rename the crash data GeoJSON file to `.json` (GeoJSON and JSON formats are interchangeable).
    - Place the file in the appropriate directory (make note of its path for the next step).


2. **Set Up the Environment Variables:**
    - add a .env file to your `/backend` directory
    | Variable Name | Description | Default Value |
    |--------------|-------------|---------------|
    | `PORT` | Port number for the server to listen on | 5002 |
    | `DATABASE_PATH` | Path to the SQLite database file | ./my_database.db |
    | `GEONJSON_PATH` | Path to the GeoJSON data file | ./Crash_Analysis_System_(CAS)_data.geojson |

3. **Install Dependencies:**
   cd to the backend and Run the following command to install required packages:
   ```bash
   npm install
    ```
4. **Initialize the Database:**
   Load the database schema by running the following:
   ```bash
   node loadDB.js
   ```
   AND WAIT IT WILL TAKE A WHILE
