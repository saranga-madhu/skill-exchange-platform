const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, feedbackController.createFeedback);
router.get('/user/:userId', feedbackController.getFeedbackForUser);

module.exports = router;
