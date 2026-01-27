const express = require('express');
const router = express.Router();
const { createRequest, getMyRequests, updateRequestStatus } = require('../controllers/requestController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createRequest);
router.get('/', authMiddleware, getMyRequests);
router.put('/:id', authMiddleware, updateRequestStatus);

module.exports = router;
