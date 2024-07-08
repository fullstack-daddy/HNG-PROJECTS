const express = require('express');
const authenticate = require('../middlewares/auth');
const { getUserById } = require('../controllers/userController');

const router = express.Router();

router.get('/users/:id', authenticate, getUserById);

module.exports = router;
