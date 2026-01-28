const pool = require('./config/db');
const bcrypt = require('bcryptjs');

const seedData = async () => {
    try {
        console.log('🌱 Seeding database...');

        // 1. Clear existing data in correct order to avoid FK issues
        console.log('Clearing old data...');
        await pool.query('DELETE FROM messages');
        await pool.query('DELETE FROM requests');
        await pool.query('DELETE FROM skills');
        await pool.query('DELETE FROM users');

        // 2. Create Users
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('password123', salt);

        const users = [
            ['Alice Johnson', 'alice@example.com', password],
            ['Bob Smith', 'bob@example.com', password],
            ['Charlie Brown', 'charlie@example.com', password],
            ['Diana Price', 'diana@example.com', password]
        ];

        console.log('Creating users...');
        const userIds = [];
        for (const user of users) {
            const [result] = await pool.query(
                'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                user
            );
            userIds.push(result.insertId);
        }

        if (userIds.length < 4) {
            throw new Error('Failed to create all seed users');
        }

        const [aliceId, bobId, charlieId, dianaId] = userIds;

        // 3. Create Skills
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

        // 4. Create Requests
        const requests = [
            [aliceId, bobId, skillIds[2], 'Hey Bob, I would love to learn Python!', 'pending'],
            [bobId, aliceId, skillIds[0], 'Hi Alice, can you teach me React?', 'pending'],
            [charlieId, dianaId, skillIds[5], 'Need help with PM', 'accepted'],
            [dianaId, bobId, skillIds[3], 'Hola! Spanish lessons?', 'rejected']
        ];

        console.log('Creating requests...');
        for (const req of requests) {
            await pool.query(
                'INSERT INTO requests (sender_id, receiver_id, skill_id, message, status) VALUES (?, ?, ?, ?, ?)',
                req
            );
        }

        // 5. Create Messages
        const messages = [
            [aliceId, bobId, 'Request: Hey Bob, I would love to learn Python!'],
            [bobId, aliceId, 'Hi Alice! Sure, I can help you with that.'],
            [aliceId, bobId, 'Great! When are you free?'],
            [bobId, aliceId, 'Request: Hi Alice, can you teach me React?'],
            [charlieId, dianaId, 'Request: Need help with PM'],
            [dianaId, charlieId, 'accepted'],
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
        return { success: true, message: 'Database seeded successfully' };

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        throw error;
    }
};

// Allow running directly
if (require.main === module) {
    seedData()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}

module.exports = seedData;

