# Getting the Backend Loaded

### Loading the Database

Before starting, ensure you have the crash data GeoJSON file. If you don’t already have a database file, follow the steps below to load the data.

---

### 🧰 Steps:

#### 1. **Prepare the Environment**
- Rename your crash data GeoJSON file to `.json` (GeoJSON and JSON formats are interchangeable).
- Place the file in a suitable directory and note its path — you’ll need it in the next step.

#### 2. **Set Up Environment Variables**
Create a `.env` file in your `/backend` directory with the following variables:

| Variable Name    | Description                                  |
|------------------|----------------------------------------------|
| `PORT`           | 5000      |
| `DATABASE_PATH`  | Path to the SQLite database file             |
| `GEOJSON_PATH`   | Path to the GeoJSON (now `.json`) data file  |

> 🔁 Make sure the file paths are correct relative to the backend directory.

#### 3. **Install Dependencies**
In the terminal, navigate to the backend directory and run:
```bash
npm install
```

### 4. **Initialize the Database:**
   Load the database schema by running the following:
   
```bash
   node loadDB.js
```

AND WAIT IT WILL TAKE A WHILE

### 5. **Start server**
    
```bash
    npm start
```

