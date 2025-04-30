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

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
