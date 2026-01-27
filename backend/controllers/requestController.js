const pool = require('../config/db');

exports.createRequest = async (req, res) => {
    const { receiver_id, skill_id, message } = req.body;
    const senderId = req.user.id; // From auth middleware

    if (!receiver_id || !skill_id) {
        return res.status(400).json({ message: 'Receiver and skill are required' });
    }

    try {
        const [result] = await pool.execute(
            'INSERT INTO requests (sender_id, receiver_id, skill_id, message) VALUES (?, ?, ?, ?)',
            [senderId, receiver_id, skill_id, message]
        );

        // Also create a message to start the conversation
        await pool.execute(
            'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
            [senderId, receiver_id, `Request: ${message}`]
        );

        res.status(201).json({
            id: result.insertId,
            sender_id: senderId,
            receiver_id,
            skill_id,
            message,
            status: 'pending'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMyRequests = async (req, res) => {
    const userId = req.user.id;

    try {
        // Requests sent by me
        const [sent] = await pool.execute(`
      SELECT r.*, s.name as skill_name, u.name as receiver_name 
      FROM requests r
      JOIN skills s ON r.skill_id = s.id
      JOIN users u ON r.receiver_id = u.id
      WHERE r.sender_id = ?
    `, [userId]);

        // Requests received by me
        const [received] = await pool.execute(`
      SELECT r.*, s.name as skill_name, u.name as sender_name 
      FROM requests r
      JOIN skills s ON r.skill_id = s.id
      JOIN users u ON r.sender_id = u.id
      WHERE r.receiver_id = ?
    `, [userId]);

        res.json({ sent, received });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateRequestStatus = async (req, res) => {
    const requestId = req.params.id;
    const { status } = req.body;
    const userId = req.user.id;

    if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        // Verify that the user is the receiver of the request
        const [requests] = await pool.execute('SELECT * FROM requests WHERE id = ? AND receiver_id = ?', [requestId, userId]);

        if (requests.length === 0) {
            return res.status(404).json({ message: 'Request not found or unauthorized' });
        }

        await pool.execute('UPDATE requests SET status = ? WHERE id = ?', [status, requestId]);
        res.json({ message: 'Request updated', status });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
