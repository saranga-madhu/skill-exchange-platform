const pool = require('./config/db');
const bcrypt = require('bcryptjs');

const seedData = async () => {
    try {
        console.log('🌱 Seeding database...');

        // 1. Create Users
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('password123', salt);

        const users = [
            ['Alice Johnson', 'alice@example.com', password],
            ['Bob Smith', 'bob@example.com', password],
            ['Charlie Brown', 'charlie@example.com', password],
            ['Diana Price', 'diana@example.com', password]
        ];

        console.log('Creating users...');
        // We use INSERT IGNORE to skip if email exists
        await pool.query('DELETE FROM requests');
        await pool.query('DELETE FROM skills');
        await pool.query('DELETE FROM users'); // Clear old data for clean seed
        // Reset auto increment is safer often but let's just insert

        const userIds = [];
        for (const user of users) {
            const [result] = await pool.query(
                'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                user
            );
            userIds.push(result.insertId);
        }

        const [aliceId, bobId, charlieId, dianaId] = userIds;

        // 2. Create Skills
        const skills = [
            [aliceId, 'React Development', 'IT', 'Expert React developer', 'offered'],
            [aliceId, 'Guitar Lessons', 'Music', 'Beginner to Intermediate', 'offered'],
            [bobId, 'Python Programming', 'IT', 'Data Science mostly', 'offered'],
            [bobId, 'Spanish Tutoring', 'Language', 'Native speaker', 'offered'],
            [charlieId, 'UI/UX Design', 'Design', 'Figma expert', 'offered'],
            [dianaId, 'Project Management', 'Business', 'Certified PMP', 'offered'],
            [dianaId, 'French Conversation', 'Language', 'Conversational', 'wanted'],
            [bobId, 'Cooking', 'Lifestyle', 'Italian cuisine', 'wanted'],
            [aliceId, 'Photography', 'Art', 'DSLR basics', 'wanted']
        ];

        console.log('Creating skills...');
        const skillIds = [];
        for (const skill of skills) {
            const [result] = await pool.query(
                'INSERT INTO skills (user_id, name, category, description, type) VALUES (?, ?, ?, ?, ?)',
                skill
            );
            skillIds.push(result.insertId);
        }

        // 3. Create Requests
        // Alice wants to learn Python from Bob
        // Bob wants to learn React from Alice
        const requests = [
            [aliceId, bobId, skillIds[2], 'Hey Bob, I would love to learn Python!', 'pending'], // Alice asks Bob for Python
            [bobId, aliceId, skillIds[0], 'Hi Alice, can you teach me React?', 'pending'],      // Bob asks Alice for React
            [charlieId, dianaId, skillIds[5], 'Need help with PM', 'accepted'],                 // Charlie asks Diana
            [dianaId, bobId, skillIds[3], 'Hola! Spanish lessons?', 'rejected']                 // Diana asks Bob
        ];

        console.log('Creating requests...');
        for (const req of requests) {
            await pool.query(
                'INSERT INTO requests (sender_id, receiver_id, skill_id, message, status) VALUES (?, ?, ?, ?, ?)',
                req
            );
        }

        // 4. Create Messages
        await pool.query('DELETE FROM messages');
        const messages = [
            [aliceId, bobId, 'Request: Hey Bob, I would love to learn Python!'],
            [bobId, aliceId, 'Hi Alice! Sure, I can help you with that.'],
            [aliceId, bobId, 'Great! When are you free?'],
            [bobId, aliceId, 'Request: Hi Alice, can you teach me React?'],
            [charlieId, dianaId, 'Request: Need help with PM'],
            [dianaId, charlieId, 'accepted'], // Assuming system message or simple reply
            [dianaId, bobId, 'Request: Hola! Spanish lessons?'],
            [bobId, dianaId, 'Sorry, I am busy right now.']
        ];

        console.log('Creating messages...');
        for (const msg of messages) {
            await pool.query(
                'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
                msg
            );
        }

        console.log('✅ Database seeded successfully!');
        console.log('User logins (password: password123):');
        users.forEach(u => console.log(`- ${u[1]}`));

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
