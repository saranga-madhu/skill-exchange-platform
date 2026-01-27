const pool = require('./config/db');

async function testConversations() {
    try {
        console.log("Testing conversation retrieval...");

        // 1. Get a user
        const [users] = await pool.execute("SELECT * FROM users LIMIT 1");
        if (users.length === 0) {
            console.log("No users found.");
            return;
        }
        const userId = users[0].id; // Alice usually
        console.log(`Testing for user ID: ${userId} (${users[0].name})`);

        // 2. Check messages count
        const [msgCount] = await pool.execute("SELECT COUNT(*) as count FROM messages WHERE sender_id = ? OR receiver_id = ?", [userId, userId]);
        console.log(`Total messages for user: ${msgCount[0].count}`);

        // 3. Run the query from controller
        const [rows] = await pool.execute(`
            SELECT DISTINCT 
                CASE 
                    WHEN sender_id = ? THEN receiver_id 
                    ELSE sender_id 
                END as partner_id
            FROM messages 
            WHERE sender_id = ? OR receiver_id = ?
        `, [userId, userId, userId]);

        console.log("Raw partners found:", rows);

        // 4. Simulate full logic
        const conversations = [];
        for (const row of rows) {
            const partnerId = row.partner_id;
            const [partners] = await pool.execute('SELECT id, name FROM users WHERE id = ?', [partnerId]);
            if (partners.length > 0) {
                conversations.push(partners[0]);
            }
        }
        console.log("Conversations resolved:", conversations);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

testConversations();
