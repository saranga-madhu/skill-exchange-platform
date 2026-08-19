const pool = require('../config/db');

exports.createSkill = async (req, res) => {
    const { name, category, description, type } = req.body;
    const userId = req.user.id; // Added by auth middleware

    if (!name || !type) {
        return res.status(400).json({ message: 'Name and type are required' });
    }

    try {
        const [result] = await pool.execute(
            'INSERT INTO skills (user_id, name, category, description, type) VALUES (?, ?, ?, ?, ?)',
            [userId, name, category, description, type]
        );

        res.status(201).json({
            id: result.insertId,
            user_id: userId,
            name,
            category,
            description,
            type
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getSkills = async (req, res) => {
    try {
        const { type, category, user_id } = req.query;
        let query = `
            SELECT 
                skills.*, 
                users.name as user_name,
                (SELECT AVG(rating) FROM feedbacks WHERE feedbacks.skill_id = skills.id) as average_rating
            FROM skills 
            JOIN users ON skills.user_id = users.id
        `;
        const params = [];
        const conditions = [];

        if (category && category !== 'All') {
            conditions.push('skills.category = ?');
            params.push(category);
        }
        if (type) {
            conditions.push('skills.type = ?');
            params.push(type);
        }
        if (user_id) {
            conditions.push('skills.user_id = ?');
            params.push(user_id);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const [skills] = await pool.execute(query, params);
        res.json(skills);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteSkill = async (req, res) => {
    const skillId = req.params.id;
    const userId = req.user.id; // From auth middleware

    try {
        // Check if skill exists and belongs to user
        const [skills] = await pool.execute('SELECT * FROM skills WHERE id = ? AND user_id = ?', [skillId, userId]);

        if (skills.length === 0) {
            return res.status(404).json({ message: 'Skill not found or not authorized' });
        }

        await pool.execute('DELETE FROM skills WHERE id = ?', [skillId]);
        res.json({ message: 'Skill removed' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateSkill = async (req, res) => {
    const skillId = req.params.id;
    const userId = req.user.id;
    const { name, category, description, type } = req.body;

    if (!name || !type) {
        return res.status(400).json({ message: 'Name and type are required' });
    }

    try {
        // Check ownership
        const [skills] = await pool.execute('SELECT * FROM skills WHERE id = ? AND user_id = ?', [skillId, userId]);
        if (skills.length === 0) {
            return res.status(404).json({ message: 'Skill not found or not authorized' });
        }

        await pool.execute(
            'UPDATE skills SET name = ?, category = ?, description = ?, type = ? WHERE id = ?',
            [name, category, description, type, skillId]
        );

        res.json({ message: 'Skill updated successfully', id: skillId, name, category, description, type });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
