const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);

<<<<<<< HEAD
module.exports = router;
=======
module.exports = router; 
>>>>>>> e1fe2e3 (first commit)
