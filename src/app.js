const express = require('express');
const path = require('path');
const cors = require('cors');
const voterRoutes = require('./routes/voterRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/voters', voterRoutes);
app.use('/api/admin', adminRoutes);

// Base route for health check
app.get('/', (req, res) => {
    res.send('Voter Registration API is running...');
});

module.exports = app;
