const pool = require('../config/db');

exports.createFeedback = async (req, res) => {
    const { receiver_id, skill_id, rating, comment } = req.body;
    const sender_id = req.user.id;

    if (!receiver_id || !rating) {
        return res.status(400).json({ message: 'Receiver ID and rating are required' });
    }

    try {
        const [result] = await pool.execute(
            'INSERT INTO feedbacks (sender_id, receiver_id, skill_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
            [sender_id, receiver_id, skill_id || null, rating, comment || null]
        );

        res.status(201).json({
            id: result.insertId,
            sender_id,
            receiver_id,
            skill_id,
            rating,
            comment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getFeedbackForUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const [feedbacks] = await pool.execute(
            `SELECT feedbacks.*, users.name as sender_name 
             FROM feedbacks 
             JOIN users ON feedbacks.sender_id = users.id 
             WHERE feedbacks.receiver_id = ?`,
            [userId]
        );

        res.json(feedbacks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
