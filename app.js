const express = require('express');
const { Client } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

app.get('/restaurants/:n', async (req, res) => {
    const n = parseInt(req.params.n, 10);

    try {
        await client.connect();

        const query = `
            SELECT name, AVG((grade->>'score')::FLOAT) AS avgScore
            FROM restaurants,
            LATERAL jsonb_array_elements(grades) AS grade
            GROUP BY name
            ORDER BY avgScore DESC
            LIMIT $1
        `;

        const { rows } = await client.query(query, [n]);

        const formattedData = rows.map((row) => ({
            name: row.name,
            avgScore: parseFloat(row.avgscore.toFixed(2)),
        }));

        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.end();
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});




