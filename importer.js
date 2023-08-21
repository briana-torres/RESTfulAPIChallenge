const fs = require('fs');
const readline = require('readline');
const { Client } = require('pg');
require('dotenv').config(); 

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

const rl = readline.createInterface({
    input: fs.createReadStream('restaurants.json'), // Path to your JSON file
    output: process.stdout,
    terminal: false
});

(async () => {
    try {
        await client.connect();

        rl.on('line', async (line) => {
            try {
                const jsonData = JSON.parse(line);

                console.log(jsonData);

            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        });

        rl.on('close', () => {
            console.log('Data insertion complete.');
            client.end();
        });

    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
})();