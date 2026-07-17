const pool = require('./config/db');

async function migrate() {
    try {
        console.log('🚀 Starting migration...');

        // Check if education_level column exists
        const [columns] = await pool.query('SHOW COLUMNS FROM users LIKE "education_level"');

        if (columns.length === 0) {
            console.log('Adding education_level column to users table...');
            await pool.query('ALTER TABLE users ADD COLUMN education_level VARCHAR(255) DEFAULT "University Student" AFTER password');
            console.log('✅ Column added successfully.');
        } else {
            console.log('ℹ️ Column education_level already exists.');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrate();
