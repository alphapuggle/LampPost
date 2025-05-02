require('dotenv').config();
console.log('Loaded from .env:', require('fs').readFileSync('.env', 'utf-8'));
console.log("PG_HOST =", process.env.PG_HOST);

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

console.log()


const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE
});

app.post('/api/reports', async (req, res) => {
  const { location, crime, incident, lat, lon } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO ucr_crime_data.incident_data (location, crime, incident, lat, lon)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [location, crime, incident, lat, lon]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error inserting report:', err.message);
    res.status(500).json({ error: 'Failed to insert report' });
  }
});

app.get('/api/reports', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM ucr_crime_data.incident_data ORDER BY reported_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching reports:', err.message);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

app.get('/api/ucr-crimes', async (req, res) => {
  const query = `
    SELECT 
      ucd."OffenseType", 
      ucd."ReportedOn", 
      lpd."GEOID", 
      lpd."County", 
      lpd."Latitude", 
      lpd."Longitude"
    FROM 
      ucr_crime_data.ucr_crime_data AS ucd
    INNER JOIN 
      ucr_crime_data.lamppost_data AS lpd 
      ON ucd."GEOID"::text = lpd."GEOID"::text;
  `;

  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch UCR crime data' });
  }
});

app.get('/api/ucr-crimes/county', async (req, res) => {
  const county = req.query.name;

  if (!county) {
    return res.status(400).json({ error: 'County name is required' });
  }

  const query = `
    SELECT 
      ucd."OffenseType", 
      ucd."ReportedOn", 
      lpd."GEOID", 
      lpd."County", 
      lpd."Latitude", 
      lpd."Longitude"
    FROM 
      ucr_crime_data.ucr_crime_data AS ucd
    INNER JOIN 
      ucr_crime_data.lamppost_data AS lpd 
      ON ucd."GEOID"::text = lpd."GEOID"::text
    WHERE 
      LOWER(lpd."County") = LOWER($1)
  `;

  try {
    const result = await pool.query(query, [county]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching filtered data:', err.message);
    res.status(500).json({ error: 'Failed to fetch filtered UCR crime data' });
  }
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});