const pool = require('../config/db');

exports.sendMessage = async (req, res) => {
    const { receiver_id, content } = req.body;
    const senderId = req.user.id; // From auth middleware

    if (!receiver_id || !content) {
        return res.status(400).json({ message: 'Receiver and content are required' });
    }

    try {
        await pool.execute(
            'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
            [senderId, receiver_id, content]
        );
        res.status(201).json({ message: 'Message sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getConversations = async (req, res) => {
    const userId = req.user.id;
    try {
        // Get list of users we have chatted with along with the last message
        // This is a bit complex in SQL. Simplified approach: Get distinct users and fetch last message manually or slightly complex query.
        // Let's do a query to get unique partners and then their details.

        // Find all unique user IDs involved in messages with current user
        const [rows] = await pool.execute(`
            SELECT DISTINCT 
                CASE 
                    WHEN sender_id = ? THEN receiver_id 
                    ELSE sender_id 
                END as partner_id
            FROM messages 
            WHERE sender_id = ? OR receiver_id = ?
        `, [userId, userId, userId]);

        const conversations = [];

        console.log(`Found ${rows.length} unique partners for user ${userId}`);

        for (const row of rows) {
            const partnerId = row.partner_id;

            // Get partner details
            const [users] = await pool.execute('SELECT id, name FROM users WHERE id = ?', [partnerId]);
            const partner = users[0];

            if (!partner) continue;

            // Get last message
            const [msgs] = await pool.execute(`
                SELECT * FROM messages 
                WHERE (sender_id = ? AND receiver_id = ?) 
                   OR (sender_id = ? AND receiver_id = ?)
                ORDER BY created_at DESC 
                LIMIT 1
            `, [userId, partnerId, partnerId, userId]);

            conversations.push({
                id: partner.id,
                name: partner.name,
                lastMessage: msgs.length > 0 ? msgs[0].content : '',
                // Ideally this should be a full conversation object or just summary
            });
        }

        console.log('Returning conversations:', conversations);
        res.json(conversations);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMessages = async (req, res) => {
    const userId = req.user.id;
    const partnerId = req.params.userId;

    try {
        const [messages] = await pool.execute(`
            SELECT * FROM messages 
            WHERE (sender_id = ? AND receiver_id = ?) 
               OR (sender_id = ? AND receiver_id = ?)
            ORDER BY created_at ASC
        `, [userId, partnerId, partnerId, userId]);

        // Transform for frontend if needed (e.g., adding 'from: me/them')
        const formattedMessages = messages.map(msg => ({
            id: msg.id,
            text: msg.content,
            from: msg.sender_id === userId ? 'me' : 'them',
            time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));

        res.json(formattedMessages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
