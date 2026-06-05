const jwt = require('jsonwebtoken');
const Voter = require('../models/Voter');
const Admin = require('../models/Admin');

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required.',
            });
        }

        const trimmedEmail = email.trim().toLowerCase();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(trimmedEmail)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address.',
            });
        }

        const admin = await Admin.findOne({ username: trimmedEmail });

        if (!admin || !(await admin.matchPassword(password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid admin email or password.',
            });
        }

        const token = jwt.sign(
            { role: 'admin', username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.status(200).json({
            success: true,
            message: 'Admin login successful.',
            token,
        });
    } catch (error) {
        console.error('Error in adminLogin:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error. Could not login.',
        });
    }
};

// @desc    Get all registered voters (admin only)
// @route   GET /api/admin/voters
// @access  Admin
const getAllVoters = async (req, res) => {
    try {
        const voters = await Voter.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: voters.length,
            data: voters,
        });
    } catch (error) {
        console.error('Error in getAllVoters:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error. Could not fetch registered voters.',
        });
    }
};

module.exports = {
    adminLogin,
    getAllVoters,
};
