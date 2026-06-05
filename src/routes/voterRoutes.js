const express = require('express');
const { registerVoter, searchVoter, getVotersList } = require('../controllers/voterController');
const uploadPhoto = require('../middleware/uploadPhoto');

const router = express.Router();

router.post('/register', (req, res, next) => {
    uploadPhoto.single('photo')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        next();
    });
}, registerVoter);
router.post('/search', searchVoter);
router.get('/list', getVotersList);

module.exports = router;
