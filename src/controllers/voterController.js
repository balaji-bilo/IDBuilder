const Voter = require('../models/Voter');

// @desc    Register a new voter
// @route   POST /api/voters/register
// @access  Public
const registerVoter = async (req, res) => {
    try {
        const { fullName, mobile, electionId, address } = req.body;

        let validationErrors = [];

        // Full name: required, no special characters
        if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
            validationErrors.push('Full name is required.');
        } else if (!/^[a-zA-Z\s]+$/.test(fullName.trim())) {
            validationErrors.push('Full name must contain only letters and spaces.');
        }

        // Mobile: exactly 10 digits, no special chars, not all zeros
        if (!mobile || !mobile.trim()) {
            validationErrors.push('Mobile number is required.');
        } else if (!/^\d{10}$/.test(mobile.trim())) {
            validationErrors.push('Mobile number must be exactly 10 digits with no special characters.');
        } else if (/^0+$/.test(mobile.trim())) {
            validationErrors.push('Mobile number cannot be all zeros.');
        }

        // Election ID: required, alphanumeric only
        if (!electionId || typeof electionId !== 'string' || !electionId.trim()) {
            validationErrors.push('ID is required.');
        } else if (!/^[a-zA-Z0-9]+$/.test(electionId.trim())) {
            validationErrors.push(' ID must contain only letters and numbers (no special characters).');
        }

        if (!address || typeof address !== 'string' || !address.trim()) {
            validationErrors.push('Address is required.');
        }
        if (!req.file) {
            validationErrors.push('Passport photo is required.');
        }

        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: validationErrors.join(' ')
            });
        }

        // Check duplicates separately for precise error messages
        const mobileExists = await Voter.findOne({ mobile: mobile.trim() });
        if (mobileExists) {
            return res.status(400).json({
                success: false,
                message: 'This mobile number is already registered.',
            });
        }

        const electionIdExists = await Voter.findOne({ electionId: electionId.trim() });
        if (electionIdExists) {
            return res.status(400).json({
                success: false,
                message: 'This  ID is already registered.',
            });
        }

        const voter = await Voter.create({
            fullName: fullName.trim(),
            mobile: mobile.trim(),
            electionId: electionId.trim(),
            address: address.trim(),
            photoPath: req.file.path,
        });

        res.status(201).json({
            success: true,
            data: voter,
        });
    } catch (error) {
        console.error('Error in registerVoter:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error. Could not register voter.',
        });
    }
};

// @desc    Find voter by mobile or election ID
// @route   POST /api/voters/search
// @access  Public
const searchVoter = async (req, res) => {
    try {
        const { mobile, electionId } = req.body;

        if (!mobile && !electionId) {
            return res.status(400).json({
                success: false,
                message: 'Please provide mobile number or  ID to search.',
            });
        }

        const query = {};
        if (mobile) query.mobile = mobile;
        if (electionId) query.electionId = electionId;

        const voter = await Voter.findOne(query);

        if (!voter) {
            return res.status(404).json({
                success: false,
                message: 'No ID record found.',
            });
        }

        res.status(200).json({
            success: true,
            data: voter,
        });
    } catch (error) {
        console.error('Error in searchVoter:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error. Could not search voter.',
        });
    }
};

// @desc    Get voter by electionId or mobile (for ID card)
// @route   GET /api/voters/list
// @access  Public
const getVotersList = async (req, res) => {
    try {
        const { electionId, mobile } = req.query;

        if (!electionId && !mobile) {
            return res.status(400).json({
                success: false,
                message: 'Please provide Id or mobile.',
            });
        }

        const query = {};
        if (electionId) query.electionId = electionId.trim();
        if (mobile) query.mobile = mobile.trim();

        const voter = await Voter.findOne(query);

        if (!voter) {
            return res.status(404).json({
                success: false,
                message: 'No ID record found.',
            });
        }

        res.status(200).json({
            success: true,
            data: voter,
        });
    } catch (error) {
        console.error('Error in getVotersList:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error. Could not fetch ID.',
        });
    }
};

module.exports = {
    registerVoter,
    searchVoter,
    getVotersList,
};
