require('dotenv').config(); // Load environment variables from .env
const mysql = require('mysql2'); // Use 'pg' for PostgreSQL

// Create a database connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306 // Default MySQL port
});

// Test the connection
connection.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database successfully!');
    connection.end(); // Close the connection after testing
});
