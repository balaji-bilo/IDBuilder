require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const DEFAULT_ADMIN = {
    username: 'admin@gmail.com',
    password: 'Admin@123',
};

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for admin seed...');

        const existingAdmin = await Admin.findOne({ username: DEFAULT_ADMIN.username });

        if (existingAdmin) {
            console.log('Admin user already exists. Seed skipped.');
        } else {
            await Admin.create(DEFAULT_ADMIN);
            console.log('Admin user created successfully.');
            console.log(`Username: ${DEFAULT_ADMIN.username}`);
        }

        await mongoose.disconnect();
        console.log('Admin seed completed.');
        process.exit(0);
    } catch (error) {
        console.error('Admin seed failed:', error.message);
        process.exit(1);
    }
};

seedAdmin();
