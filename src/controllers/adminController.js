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

// @desc    Get all registered voters (admin only) - with pagination
// @route   GET /api/admin/voters?page=1&limit=10
// @access  Admin
const getAllVoters = async (req, res) => {
    try {
        // Get pagination parameters from query
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Validate pagination parameters
        if (page < 1) {
            return res.status(400).json({
                success: false,
                message: 'Page number must be greater than 0.',
            });
        }

        if (limit < 1 || limit > 100) {
            return res.status(400).json({
                success: false,
                message: 'Limit must be between 1 and 100.',
            });
        }

        // Calculate skip value for database query
        const skip = (page - 1) * limit;

        // Get total count of all voters
        const totalVoters = await Voter.countDocuments();

        // Get paginated voters
        const voters = await Voter.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Calculate total pages
        const totalPages = Math.ceil(totalVoters / limit);

        res.status(200).json({
            success: true,
            data: voters,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalVoters: totalVoters,
                limit: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
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
