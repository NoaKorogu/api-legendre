const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');

const app = express();

// Middleware global
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

module.exports = app;
