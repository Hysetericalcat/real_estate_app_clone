require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const propertiesRouter = require('./routes/properties');
const leadsRouter = require('./routes/leads');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://akshat124b:Akshat%403624@cluster0.hym7t.mongodb.net/estate-sphere?appName=Cluster0';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/properties', propertiesRouter);
app.use('/api/leads', leadsRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Estate Sphere API is running', timestamp: new Date() });
});

// Connect to MongoDB & start server
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB Atlas');
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Estate Sphere API running on port ${PORT}`);
            console.log(`   Health: http://localhost:${PORT}/api/health`);
            console.log(`   Properties: http://localhost:${PORT}/api/properties`);
            console.log(`   Leads: http://localhost:${PORT}/api/leads`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });
