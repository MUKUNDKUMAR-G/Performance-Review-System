const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createAdmin() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Connected to database...');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Admin@123', salt);

        console.log('Hashed password:', hashedPassword);
        await connection.query(
            `INSERT INTO users (email, password, first_name, last_name, role, is_active) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            ['admin@test.com', hashedPassword, 'Admin', 'User', 'admin', true]
        );

        console.log('Admin user created successfully');
        console.log('Email: admin@test.com');
        console.log('Password: Admin@123');

        await connection.end();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

createAdmin();