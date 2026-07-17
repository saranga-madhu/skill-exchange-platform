const express = require('express');
const router = express.Router();
const { createSkill, getSkills, deleteSkill, updateSkill } = require('../controllers/skillController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createSkill);
router.get('/', getSkills); // Public access to view skills? Assuming yes.
router.delete('/:id', authMiddleware, deleteSkill);
router.put('/:id', authMiddleware, updateSkill);

module.exports = router;
