const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

async function setupDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            // Connect without database selected first to create it
        });

        console.log('Connected to MySQL server.');

        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'skillexchange'}`);
        console.log(`Database '${process.env.DB_NAME || 'skillexchange'}' created or already exists.`);

        await connection.changeUser({ database: process.env.DB_NAME || 'skillexchange' });

        const schemaPath = path.join(__dirname, 'database.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Split by semicolon to execute queries one by one
        const queries = schemaSql.split(';').filter(query => query.trim() !== '');

        for (const query of queries) {
            if (query.trim()) {
                await connection.query(query);
            }
        }

        console.log('Tables created successfully.');
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error setting up database:', error);
        process.exit(1);
    }
}

setupDatabase();
