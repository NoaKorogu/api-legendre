const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const authRoutes = require('./routes/auth.routes');
const livraison_marchandiseRoutes = require('./routes/livraison_marchandise.routes');
const livraisonRoutes = require('./routes/livraison.routes');
const tourneeRoutes = require('./routes/tournee.routes');
const marchandiseRoutes = require('./routes/marchandise.routes');
const adresseRoutes = require('./routes/adresse.routes');
const clientRoutes = require('./routes/client.routes');
const chauffeurRoutes = require('./routes/chauffeur.routes');

const app = express();

// Middleware global
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/livraison_marchandises', livraison_marchandiseRoutes);
app.use('/api/v1/livraisons', livraisonRoutes);
app.use('/api/v1/tournees', tourneeRoutes);
app.use('/api/v1/marchandises', marchandiseRoutes);
app.use('/api/v1/adresses', adresseRoutes);
app.use('/api/v1/clients', clientRoutes);
app.use('/api/v1/chauffeurs', chauffeurRoutes);

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
