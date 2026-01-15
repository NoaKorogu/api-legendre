#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const args = process.argv.slice(2);

if (args.length === 0) {
  showHelp();
  process.exit(0);
}

const command = args[0];
const subcommand = args[1];
const modelName = args[2];

if (command === 'generate' && subcommand === 'route' && modelName) {
  generateFullStack(modelName);
} else if (command === 'help' || command === '--help' || command === '-h') {
  showHelp();
} else {
  console.error('❌ Commande inconnue');
  showHelp();
  process.exit(1);
}

async function generateFullStack(modelName) {
  try {
    // Connect to DB
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'api_mvc'
    });

    const connection = await pool.getConnection();
    
    // Get table columns
    const tableName = modelName + 's'; // users, products, etc.
    const [columns] = await connection.query(
      `SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = ? AND TABLE_SCHEMA = ?`,
      [tableName, process.env.DB_NAME || 'api_mvc']
    );

    connection.release();
    pool.end();

    if (columns.length === 0) {
      console.error(`❌ Table '${tableName}' non trouvée dans la base de données`);
      process.exit(1);
    }

    console.log(`✅ Table '${tableName}' trouvée avec ${columns.length} colonnes`);

    // Generate files
    generateRoute(modelName, columns);
    generateModel(modelName, columns);
    generateController(modelName, columns);
    
    console.log(`\n✅ Tous les fichiers ont été générés !`);
    console.log(`📝 Prochaines étapes:`);
    console.log(`   1. Ajouter la route dans app.js:`);
    console.log(`      app.use('/api/v1/${modelName}s', require('./routes/${modelName}.routes'));`);
    console.log(`   2. Tester l'API sur http://localhost:3000/api-docs`);
  } catch (err) {
    console.error(`❌ Erreur: ${err.message}`);
    process.exit(1);
  }
}

function generateRoute(modelName, columns) {
  const routesDir = path.join(__dirname, 'routes');
  const routeFile = path.join(routesDir, `${modelName}.routes.js`);

  if (fs.existsSync(routeFile)) {
    console.error(`❌ La route ${modelName}.routes.js existe déjà`);
    process.exit(1);
  }

  const modelNameCapital = modelName.charAt(0).toUpperCase() + modelName.slice(1);
  const tableName = modelName + 's';
  
  const routeContent = `const express = require('express');
const router = express.Router();
const ${modelNameCapital}Controller = require('../controllers/${modelName}.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const logger = require('../middlewares/logger.middleware');

/**
 * @swagger
 * /api/v1/${tableName}:
 *   get:
 *     summary: Récupérer tous les ${tableName}
 *     tags:
 *       - ${modelNameCapital}s
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des ${tableName}
 *       401:
 *         description: Non authentifié
 *   post:
 *     summary: Créer un nouveau ${modelName}
 *     tags:
 *       - ${modelNameCapital}s
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: ${modelNameCapital} créé
 */
router.get('/', authMiddleware, logger, ${modelNameCapital}Controller.getAll);
router.post('/', authMiddleware, logger, ${modelNameCapital}Controller.create);

/**
 * @swagger
 * /api/v1/${tableName}/{id}:
 *   get:
 *     summary: Récupérer un ${modelName} par ID
 *     tags:
 *       - ${modelNameCapital}s
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: ${modelNameCapital} trouvé
 *       404:
 *         description: Non trouvé
 *   put:
 *     summary: Modifier un ${modelName}
 *     tags:
 *       - ${modelNameCapital}s
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: ${modelNameCapital} modifié
 *   delete:
 *     summary: Supprimer un ${modelName}
 *     tags:
 *       - ${modelNameCapital}s
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: ${modelNameCapital} supprimé
 */
router.get('/:id', authMiddleware, logger, ${modelNameCapital}Controller.getById);
router.put('/:id', authMiddleware, logger, ${modelNameCapital}Controller.update);
router.delete('/:id', authMiddleware, logger, ${modelNameCapital}Controller.delete);

module.exports = router;
`;

  if (!fs.existsSync(routesDir)) {
    fs.mkdirSync(routesDir, { recursive: true });
  }

  fs.writeFileSync(routeFile, routeContent);
  console.log(`✅ Route créée: ${routeFile}`);
}

function generateModel(modelName, columns) {
  const modelsDir = path.join(__dirname, 'models');
  const modelFile = path.join(modelsDir, `${modelName}.model.js`);

  if (fs.existsSync(modelFile)) {
    console.error(`❌ Le modèle ${modelName}.model.js existe déjà`);
    process.exit(1);
  }

  const tableName = modelName + 's';

  const modelContent = `const pool = require('../config/db');

exports.findAll = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM ${tableName}');
    return rows;
  } finally {
    connection.release();
  }
};

exports.findById = async (id) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM ${tableName} WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  } finally {
    connection.release();
  }
};

exports.create = async (data) => {
  const connection = await pool.getConnection();
  try {
    const fields = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);
    
    const [result] = await connection.query(
      \`INSERT INTO ${tableName} (\${fields}) VALUES (\${placeholders})\`,
      values
    );
    
    return { id: result.insertId, ...data };
  } finally {
    connection.release();
  }
};

exports.update = async (id, data) => {
  const connection = await pool.getConnection();
  try {
    const existing = await this.findById(id);
    if (!existing) return null;

    const fields = Object.keys(data).map(k => \`\${k} = ?\`).join(', ');
    const values = [...Object.values(data), id];

    await connection.query(
      \`UPDATE ${tableName} SET \${fields} WHERE id = ?\`,
      values
    );

    return { id, ...data };
  } finally {
    connection.release();
  }
};

exports.delete = async (id) => {
  const connection = await pool.getConnection();
  try {
    const existing = await this.findById(id);
    if (!existing) return null;

    await connection.query('DELETE FROM ${tableName} WHERE id = ?', [id]);
    return existing;
  } finally {
    connection.release();
  }
};
`;

  if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true });
  }

  fs.writeFileSync(modelFile, modelContent);
  console.log(`✅ Modèle créé: ${modelFile}`);
}

function generateController(modelName, columns) {
  const controllersDir = path.join(__dirname, 'controllers');
  const controllerFile = path.join(controllersDir, `${modelName}.controller.js`);

  if (fs.existsSync(controllerFile)) {
    console.error(`❌ Le contrôleur ${modelName}.controller.js existe déjà`);
    process.exit(1);
  }

  const modelNameCapital = modelName.charAt(0).toUpperCase() + modelName.slice(1);

  const controllerContent = `const ${modelNameCapital} = require('../models/${modelName}.model');

exports.getAll = async (req, res) => {
  try {
    const items = await ${modelNameCapital}.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await ${modelNameCapital}.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: '${modelName} non trouvé' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newItem = await ${modelNameCapital}.create(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await ${modelNameCapital}.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: '${modelName} non trouvé' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await ${modelNameCapital}.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: '${modelName} non trouvé' });
    }
    res.json({ message: '${modelName} supprimé', item: deleted });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
`;

  if (!fs.existsSync(controllersDir)) {
    fs.mkdirSync(controllersDir, { recursive: true });
  }

  fs.writeFileSync(controllerFile, controllerContent);
  console.log(`✅ Contrôleur créé: ${controllerFile}`);
}

function showHelp() {
  console.log(`
╔════════════════════════════════════════════╗
║    Napi-mvc RAD Tool v2.0 - Auto DB Gen   ║
║    Génération complète à partir de la BD   ║
╚════════════════════════════════════════════╝

Usage:
  napi-mvc generate route <modelName>    Générer route + model + controller
  napi-mvc help                          Afficher cette aide

Examples:
  node napi-mvc.js generate route product
  node napi-mvc.js generate route category

⚠️  IMPORTANT: 
  La table doit exister dans votre DB!
  Exemple: pour 'product' → table 'products' doit exister

Ce qui est généré automatiquement:
  ✅ routes/<modelName>.routes.js   (avec Swagger)
  ✅ models/<modelName>.model.js    (CRUD complet)
  ✅ controllers/<modelName>.controller.js (endpoints)

Après génération:
  1. Ajouter dans app.js:
     app.use('/api/v1/<modelName>s', require('./routes/<modelName>.routes'));
  2. Redémarrer le serveur
  3. Tester sur http://localhost:3000/api-docs
  `);
}
