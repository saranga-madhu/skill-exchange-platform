const express = require('express');
const router = express.Router();
const { sendMessage, getConversations, getMessages } = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, sendMessage);
router.get('/conversations', authMiddleware, getConversations);
router.get('/:userId', authMiddleware, getMessages);

module.exports = router;
