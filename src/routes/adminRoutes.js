const express = require('express');
const { adminLogin, getAllVoters } = require('../controllers/adminController');
const authAdmin = require('../middleware/authAdmin');

const router = express.Router();

router.post('/login', adminLogin);
router.get('/voters', authAdmin, getAllVoters);

module.exports = router;
