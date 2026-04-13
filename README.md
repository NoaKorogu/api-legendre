# API Logistique LEGENDRE

API REST sécurisée de gestion des tournées et livraisons pour l'entreprise de transport LEGENDRE.

## Technologies

- Node.js + Express
- MySQL + mysql2
- JWT (jsonwebtoken) + bcryptjs
- Swagger / OpenAPI 3.0
- Jest + Supertest

## Installation

```bash
git clone https://github.com/NoaKorogu/api-mvc
cd api-mvc
npm install
```

Crée un fichier `.env` à la racine :

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=ton_mdp
DB_NAME=api_legendre
SECRET_KEY=une_cle_secrete_longue
```

Importe le script SQL dans MySQL Workbench, puis lance :

```bash
npm run dev
```

## Documentation Swagger

```
http://localhost:3000/api-docs
```

## Endpoints

### Authentification
| Méthode | Route | Description |
|--------|-------|-------------|
| POST | /api/v1/auth/register | Créer un compte chauffeur ou client |
| POST | /api/v1/auth/login | Se connecter, retourne un JWT |

### Chauffeurs
| Méthode | Route | Description |
|--------|-------|-------------|
| GET | /api/v1/chauffeurs | Liste tous les chauffeurs |
| GET | /api/v1/chauffeurs/:id | Détail d'un chauffeur |
| GET | /api/v1/chauffeurs/:id/tournees | Tournées d'un chauffeur |
| POST | /api/v1/chauffeurs | Créer un chauffeur |
| PUT | /api/v1/chauffeurs/:id | Modifier un chauffeur |
| DELETE | /api/v1/chauffeurs/:id | Supprimer un chauffeur |

### Tournées
| Méthode | Route | Description |
|--------|-------|-------------|
| GET | /api/v1/tournees | Liste toutes les tournées |
| GET | /api/v1/tournees/:id | Détail d'une tournée |
| GET | /api/v1/tournees/:id/livraisons | Livraisons d'une tournée |
| POST | /api/v1/tournees | Créer une tournée |
| PUT | /api/v1/tournees/:id | Modifier une tournée |
| DELETE | /api/v1/tournees/:id | Supprimer une tournée |

### Livraisons
| Méthode | Route | Description |
|--------|-------|-------------|
| GET | /api/v1/livraisons | Liste toutes les livraisons |
| GET | /api/v1/livraisons/:id | Détail d'une livraison |
| PATCH | /api/v1/livraisons/:id/statut | Mettre à jour le statut |
| POST | /api/v1/livraisons | Créer une livraison |
| PUT | /api/v1/livraisons/:id | Modifier une livraison |
| DELETE | /api/v1/livraisons/:id | Supprimer une livraison |

### Clients
| Méthode | Route | Description |
|--------|-------|-------------|
| GET | /api/v1/clients | Liste tous les clients |
| GET | /api/v1/clients/:id | Détail d'un client |
| POST | /api/v1/clients | Créer un client |
| PUT | /api/v1/clients/:id | Modifier un client |
| DELETE | /api/v1/clients/:id | Supprimer un client |

### Marchandises
| Méthode | Route | Description |
|--------|-------|-------------|
| GET | /api/v1/marchandises | Liste toutes les marchandises |
| GET | /api/v1/marchandises/:id | Détail d'une marchandise |
| POST | /api/v1/marchandises | Créer une marchandise |
| PUT | /api/v1/marchandises/:id | Modifier une marchandise |
| DELETE | /api/v1/marchandises/:id | Supprimer une marchandise |

### Adresses
| Méthode | Route | Description |
|--------|-------|-------------|
| GET | /api/v1/adresses | Liste toutes les adresses |
| GET | /api/v1/adresses/:id | Détail d'une adresse |
| POST | /api/v1/adresses | Créer une adresse |
| PUT | /api/v1/adresses/:id | Modifier une adresse |
| DELETE | /api/v1/adresses/:id | Supprimer une adresse |

## Gestion des rôles

| Rôle | Accès |
|------|-------|
| chauffeur | Ses tournées, mise à jour statut livraison |
| client | Ses livraisons |
| admin | Accès complet |

## Tests

```bash
npm test
```

6 tests couvrant : register, login, mauvais password, accès sans token, accès avec token, statut invalide.

## Architecture

```
api-mvc/
  controllers/   Logique métier
  models/        Accès base de données
  routes/        Définition des routes + Swagger
  middlewares/   auth, role, logger
  config/        db.js, swagger.js
  test/          Tests Jest + Supertest
  app.js         Configuration Express
  server.js      Lancement du serveur
```