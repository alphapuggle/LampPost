const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: 'postgres.alphapuggle.dev',
  port: 15432,
  user: 'lamppost_serviceworker',
  password: 'mEGyKC97HPHqQT4&PJ9#',
  database: 'postgres'
});

// POST new incident report
app.post('/api/reports', async (req, res) => {
  const { location, crime, incident, lat, lon } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO incident_reports (location, crime, incident, lat, lon)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [location, crime, incident, lat, lon]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to insert report' });
  }
});

// GET all incident reports
app.get('/api/reports', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM incident_reports ORDER BY reported_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// GET UCR crime data with joined location info
app.get('/api/ucr-crimes', async (req, res) => {
    const query = `
      SELECT 
        ucr_crime_data.ucr_crime_data."OffenseType", 
        ucr_crime_data.ucr_crime_data."ReportedOn", 
        ucr_crime_data.lamppost_data.geoid, 
        ucr_crime_data.lamppost_data.county, 
        ucr_crime_data.lamppost_data.latitude, 
        ucr_crime_data.lamppost_data.longitude
      FROM 
        ucr_crime_data.ucr_crime_data
      INNER JOIN 
        ucr_crime_data.lamppost_data 
        ON ucr_crime_data.ucr_crime_data."GEOID" = ucr_crime_data.lamppost_data.geoid;
    `;
  
    try {
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (err) {
        console.error('Error fetching UCR crime data:', err.message, err.stack);

        res.status(500).json({ error: 'Failed to fetch UCR crime data' });
    }
  });
  

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
