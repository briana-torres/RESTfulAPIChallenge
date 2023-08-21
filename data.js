const fs = require('fs');
const readline = require('readline');
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function insertRestaurantData(data) {
    const jsonData = JSON.parse(data);

    const {
        address,
        borough,
        cuisine,
        grades,
        name,
        restaurant_id,
    } = jsonData;

    const insertQuery = `
        INSERT INTO restaurants (address, borough, cuisine, grades, name, restaurant_id)
        VALUES ($1, $2, $3, $4, $5, $6)
    `;

    const values = [
        address,
        borough,
        cuisine,
        grades, 
        name,
        restaurant_id,
    ];

    try {
        await client.query(insertQuery, values);
        console.log('Data inserted successfully.');
    } catch (error) {
        console.error('Error inserting data:', error);
    }
}

async function processFileByLine(filePath) {
    try {
        await client.connect();

        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        });

        for await (const line of rl) {
            await insertRestaurantData(line);
        }
    } catch (error) {
        console.error('Error processing file:', error);
    } finally {
        await client.end();
    }
}

const filePath = 'restaurants.json';
processFileByLine(filePath);

