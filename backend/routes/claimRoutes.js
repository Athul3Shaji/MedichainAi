const express = require('express');
const router = express.Router();
const {
    createClaim,
    getClaims,
    getClaim,
    updateClaim,
    deleteClaim
} = require('../controllers/claimController');
const upload = require('../utils/multerConfig');
const authentication = require('../middleware/authentication');

// All claim routes are protected
router.post('/', authentication, upload.single('file'), createClaim);
router.get('/', authentication, getClaims);
router.get('/:id', authentication, getClaim);
router.put('/:id', authentication, upload.single('file'), updateClaim);
router.delete('/:id', authentication, deleteClaim);

module.exports = router; 