const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const errorHandler = require('./middleware/errorMiddleware');

// Route files
const auth = require('./routes/authRoutes');
const tasks = require('./routes/taskRoutes');

const app = express();

// Initialize CORS first so preflight options don't fail by earlier middleware
app.use(cors());
app.use(express.json());

// Security Middleware
app.use(helmet());
app.use(mongoSanitize());

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/tasks', tasks);

// API Health check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running' });
});

// Use Error Handler Middleware
app.use(errorHandler);

module.exports = app;
