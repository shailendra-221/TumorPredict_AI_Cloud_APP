const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const dotenv = require('dotenv');
const errorMiddleware = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/mri', require('./routes/mriRoutes'));
app.use('/api/analysis', require('./routes/analysisRoutes'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Error handling
app.use(errorMiddleware);

module.exports = app;
