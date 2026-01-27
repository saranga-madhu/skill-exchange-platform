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
        let query = 'SELECT skills.*, users.name as user_name FROM skills JOIN users ON skills.user_id = users.id';
        const params = [];

        const conditions = [];
        if (type) {
            conditions.push('skills.type = ?');
            params.push(type);
        }
        if (category) {
            if (category === 'Others') {
                // Exclude standard categories
                const standardCategories = ['IT', 'Music', 'Language', 'Design'];
                // Create placeholders like ?, ?, ?, ?
                const placeholders = standardCategories.map(() => '?').join(',');
                conditions.push(`skills.category NOT IN (${placeholders})`);
                params.push(...standardCategories);
            } else {
                conditions.push('skills.category = ?');
                params.push(category);
            }
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
