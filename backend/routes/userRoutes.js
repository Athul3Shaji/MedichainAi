const express = require('express');
const router = express.Router();
const { registerUser, loginUser, get_user, update_user, get_users } = require('../controllers/userController');
const upload = require('../utils/multerConfig');
const authentication = require('../middleware/authentication');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/:id', authentication, get_user);
router.put('/:id', authentication, upload.single('profileImage'), update_user);
router.get('/', authentication, get_users);

module.exports = router; 