const express = require('express');
const userRoutes = require('./routes/user.routes');

const app = express();

// Middleware global
app.use(express.json());

// Routes
app.use('/api/v1/users', userRoutes);


const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));


module.exports = app;
