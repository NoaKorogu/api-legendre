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
} else if (command === 'register' && subcommand === 'route' && modelName) {
  registerRoute(modelName);
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

    // Get foreign key information
    const [foreignKeys] = await connection.query(
      `SELECT COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME 
       FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
       WHERE TABLE_NAME = ? AND TABLE_SCHEMA = ? AND REFERENCED_TABLE_NAME IS NOT NULL`,
      [tableName, process.env.DB_NAME || 'api_mvc']
    );

    connection.release();
    pool.end();

    if (columns.length === 0) {
      console.error(`❌ Table '${tableName}' non trouvée dans la base de données`);
      process.exit(1);
    }

    console.log(`✅ Table '${tableName}' trouvée avec ${columns.length} colonnes`);
    if (foreignKeys.length > 0) {
      console.log(`🔗 ${foreignKeys.length} clé(s) étrangère(s) détectée(s)`);
    }

    // Generate files
    generateRoute(modelName, columns, foreignKeys);
    generateModel(modelName, columns, foreignKeys);
    generateController(modelName, columns, foreignKeys);
    
    console.log(`\n✅ Tous les fichiers ont été générés !`);
    console.log(`📝 Prochaines étapes:`);
    console.log(`   1. Enregistrer la route avec: node napi-mvc.js register route ${modelName}`);
    console.log(`   2. Redémarrer le serveur`);
    console.log(`   3. Tester l'API sur http://localhost:3000/api-docs`);
  } catch (err) {
    console.error(`❌ Erreur: ${err.message}`);
    process.exit(1);
  }
}

function generateRoute(modelName, columns, foreignKeys = []) {
  const routesDir = path.join(__dirname, 'routes');
  const routeFile = path.join(routesDir, `${modelName}.routes.js`);

  if (fs.existsSync(routeFile)) {
    console.error(`❌ La route ${modelName}.routes.js existe déjà`);
    process.exit(1);
  }

  const modelNameCapital = modelName.charAt(0).toUpperCase() + modelName.slice(1);
  const tableName = modelName + 's';
  
  // Generate properties for schema based on database columns
  const schemaProperties = generateSwaggerProperties(columns, foreignKeys);
  const requiredFields = generateRequiredFields(columns, foreignKeys);
  
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
${schemaProperties}${requiredFields}
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
${schemaProperties}${requiredFields}
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

function generateModel(modelName, columns, foreignKeys = []) {
  const modelsDir = path.join(__dirname, 'models');
  const modelFile = path.join(modelsDir, `${modelName}.model.js`);

  if (fs.existsSync(modelFile)) {
    console.error(`❌ Le modèle ${modelName}.model.js existe déjà`);
    process.exit(1);
  }

  const tableName = modelName + 's';
  const hasUserId = columns.some(col => col.COLUMN_NAME === 'user_id');
  
  // Build foreign key info
  const fkMap = {};
  foreignKeys.forEach(fk => {
    fkMap[fk.COLUMN_NAME] = {
      table: fk.REFERENCED_TABLE_NAME,
      column: fk.REFERENCED_COLUMN_NAME
    };
  });

  const modelContent = `const pool = require('../config/db');

exports.findAll = async (userId = null) => {
  const connection = await pool.getConnection();
  try {
${hasUserId ? `    let query = 'SELECT * FROM ${tableName} WHERE user_id = ?';
    const [rows] = await connection.query(query, [userId]);` : `    const [rows] = await connection.query('SELECT * FROM ${tableName}');`}
    return rows;
  } finally {
    connection.release();
  }
};

exports.findById = async (id, userId = null) => {
  const connection = await pool.getConnection();
  try {
${hasUserId ? `    let query = 'SELECT * FROM ${tableName} WHERE id = ? AND user_id = ?';
    const [rows] = await connection.query(query, [id, userId]);` : `    const [rows] = await connection.query('SELECT * FROM ${tableName} WHERE id = ?', [id]);`}
    return rows.length > 0 ? rows[0] : null;
  } finally {
    connection.release();
  }
};

exports.create = async (data, userId = null) => {
  const connection = await pool.getConnection();
  try {
${hasUserId ? `    // Auto-fill user_id from authenticated user
    data.user_id = userId;` : ''}
    
${Object.keys(fkMap).filter(fk => fk !== 'user_id').map(fk => `    // Validate ${fk} exists
    const [${fk}Check] = await connection.query('SELECT id FROM ${fkMap[fk].table} WHERE id = ?', [data.${fk}]);
    if (${fk}Check.length === 0) {
      throw new Error('${fk} invalide ou inexistant');
    }
`).join('')}
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

exports.update = async (id, data, userId = null) => {
  const connection = await pool.getConnection();
  try {
    const existing = await this.findById(id, userId);
    if (!existing) return null;

${Object.keys(fkMap).filter(fk => fk !== 'user_id').map(fk => `    // Validate ${fk} if provided
    if (data.${fk}) {
      const [${fk}Check] = await connection.query('SELECT id FROM ${fkMap[fk].table} WHERE id = ?', [data.${fk}]);
      if (${fk}Check.length === 0) {
        throw new Error('${fk} invalide ou inexistant');
      }
    }
`).join('')}
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

exports.delete = async (id, userId = null) => {
  const connection = await pool.getConnection();
  try {
    const existing = await this.findById(id, userId);
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

function generateController(modelName, columns, foreignKeys = []) {
  const controllersDir = path.join(__dirname, 'controllers');
  const controllerFile = path.join(controllersDir, `${modelName}.controller.js`);

  if (fs.existsSync(controllerFile)) {
    console.error(`❌ Le contrôleur ${modelName}.controller.js existe déjà`);
    process.exit(1);
  }

  const modelNameCapital = modelName.charAt(0).toUpperCase() + modelName.slice(1);
  const hasUserId = columns.some(col => col.COLUMN_NAME === 'user_id');

  const controllerContent = `const ${modelNameCapital} = require('../models/${modelName}.model');

exports.getAll = async (req, res) => {
  try {
${hasUserId ? `    const items = await ${modelNameCapital}.findAll(req.user?.id);` : `    const items = await ${modelNameCapital}.findAll();`}
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
${hasUserId ? `    const item = await ${modelNameCapital}.findById(req.params.id, req.user?.id);` : `    const item = await ${modelNameCapital}.findById(req.params.id);`}
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
${hasUserId ? `    const newItem = await ${modelNameCapital}.create(req.body, req.user?.id);` : `    const newItem = await ${modelNameCapital}.create(req.body);`}
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
${hasUserId ? `    const updated = await ${modelNameCapital}.update(req.params.id, req.body, req.user?.id);` : `    const updated = await ${modelNameCapital}.update(req.params.id, req.body);`}
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
${hasUserId ? `    const deleted = await ${modelNameCapital}.delete(req.params.id, req.user?.id);` : `    const deleted = await ${modelNameCapital}.delete(req.params.id);`}
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
║    Napi-mvc RAD Tool v2.0 - Auto DB Gen    ║
║    Génération complète à partir de la BD   ║
╚════════════════════════════════════════════╝

Usage:
  napi-mvc generate route <modelName>    Générer route + model + controller
  napi-mvc register route <modelName>    Enregistrer la route dans app.js
  napi-mvc help                          Afficher cette aide

Examples:
  node napi-mvc.js generate route product
  node napi-mvc.js register route product
  node napi-mvc.js generate route category

⚠️  IMPORTANT: 
  La table doit exister dans votre DB!
  Exemple: pour 'product' → table 'products' doit exister

Ce qui est généré automatiquement:
  ✅ routes/<modelName>.routes.js   (avec Swagger complet et champs de BD)
  ✅ models/<modelName>.model.js    (CRUD complet)
  ✅ controllers/<modelName>.controller.js (endpoints)

Après génération:
  1. Exécuter: node napi-mvc.js register route <modelName>
  2. Redémarrer le serveur
  3. Tester sur http://localhost:3000/api-docs
  `);
}

function generateSwaggerProperties(columns, foreignKeys = []) {
  const properties = [];
  const fkColumns = foreignKeys.map(fk => fk.COLUMN_NAME);
  
  columns.forEach(col => {
    const colName = col.COLUMN_NAME;
    // Skip auto-generated and foreign key fields for request body
    if (colName === 'id' || colName === 'created_at' || colName === 'updated_at' || colName === 'user_id' || colName === 'sell_date' || colName === 'sells_date' || fkColumns.includes(colName)) {
      return;
    }
    
    let swaggerType = 'string';
    let example = 'example value';
    
    const dataType = col.DATA_TYPE.toLowerCase();
    if (dataType.includes('int')) {
      swaggerType = 'integer';
      example = 1;
    } else if (dataType.includes('float') || dataType.includes('decimal')) {
      swaggerType = 'number';
      example = 99.99;
    } else if (dataType.includes('text')) {
      swaggerType = 'string';
      example = 'Long text description';
    } else if (dataType.includes('date')) {
      swaggerType = 'string';
      example = '2024-01-16';
    } else if (dataType.includes('time')) {
      swaggerType = 'string';
      example = '10:30:00';
    }
    
    properties.push(`             ${colName}:`);
    properties.push(`               type: ${swaggerType}`);
    properties.push(`               example: ${typeof example === 'string' ? `"${example}"` : example}`);
  });
  
  // Add foreign key properties (excluding user_id which is auto-filled)
  foreignKeys.forEach(fk => {
    if (fk.COLUMN_NAME !== 'user_id') {
      properties.push(`             ${fk.COLUMN_NAME}:`);
      properties.push(`               type: integer`);
      properties.push(`               example: 1`);
    }
  });
  
  return properties.length > 0 ? '\n *             properties:\n *               ' + properties.join('\n *               ') : '';
}

function generateRequiredFields(columns, foreignKeys = []) {
  const required = [];
  const fkColumns = foreignKeys.map(fk => fk.COLUMN_NAME);
  
  columns.forEach(col => {
    const colName = col.COLUMN_NAME;
    // Don't require auto-filled fields
    if (colName !== 'id' && colName !== 'created_at' && colName !== 'updated_at' && colName !== 'user_id' && col.IS_NULLABLE === 'NO' && !fkColumns.includes(colName)) {
      required.push(colName);
    }
  });
  
  // Add required foreign keys (excluding user_id)
  foreignKeys.forEach(fk => {
    if (fk.COLUMN_NAME !== 'user_id') {
      required.push(fk.COLUMN_NAME);
    }
  });
  
  return required.length > 0 ? '\n *             required:\n *               - ' + required.join('\n *               - ') : '';
}

async function registerRoute(modelName) {
  try {
    const appFilePath = path.join(__dirname, 'app.js');
    let appContent = fs.readFileSync(appFilePath, 'utf-8');
    
    const modelNameCapital = modelName.charAt(0).toUpperCase() + modelName.slice(1);
    const tableName = modelName + 's';
    const routeRequire = `const ${modelName}Routes = require('./routes/${modelName}.routes');`;
    const routeUse = `app.use('/api/v1/${tableName}', ${modelName}Routes);`;
    
    // Check if already registered
    if (appContent.includes(`'/api/v1/${tableName}'`)) {
      console.log(`✅ La route /api/v1/${tableName} est déjà enregistrée dans app.js`);
      return;
    }
    
    // Add require statement after other route requires
    const requireRegex = /const \w+Routes = require\('\.\/routes\/\w+\.routes'\);/g;
    const matches = appContent.match(requireRegex);
    
    if (matches) {
      const lastRequire = matches[matches.length - 1];
      appContent = appContent.replace(lastRequire, lastRequire + `\nconst ${modelName}Routes = require('./routes/${modelName}.routes');`);
    }
    
    // Add route use after other route uses (before static files)
    const routeRegex = /app\.use\('\/api\/v1\/\w+',\s*\w+Routes\);/g;
    const routeMatches = appContent.match(routeRegex);
    
    if (routeMatches) {
      const lastRouteMatch = routeMatches[routeMatches.length - 1];
      const lastRouteUseIndex = appContent.lastIndexOf(lastRouteMatch);
      const lineEnd = appContent.indexOf(';', lastRouteUseIndex) + 1;
      const nextLineStart = appContent.indexOf('\n', lineEnd);
      appContent = appContent.slice(0, nextLineStart) + `\napp.use('/api/v1/${tableName}', ${modelName}Routes);` + appContent.slice(nextLineStart);
    }
    
    fs.writeFileSync(appFilePath, appContent);
    console.log(`✅ Route enregistrée dans app.js: /api/v1/${tableName}`);
    console.log(`📝 Redémarrez le serveur et testez sur http://localhost:3000/api-docs`);
  } catch (err) {
    console.error(`❌ Erreur lors de l'enregistrement: ${err.message}`);
    process.exit(1);
  }
}
