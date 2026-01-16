const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const sellRoutes = require('./routes/sell.routes');

const app = express();

// Middleware global
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/sells', sellRoutes);

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoutes);

module.exports = app;
