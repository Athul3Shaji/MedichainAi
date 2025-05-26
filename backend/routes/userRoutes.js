const express = require('express');
const router = express.Router();
const { registerUser, loginUser, get_user, update_user } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', get_user);
router.put('/:id', update_user);

module.exports = router; 