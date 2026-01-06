# API Users – Node.js Express MVC

Mini projet d’API REST développé en Node.js avec Express, en respectant l’architecture MVC (Model – View – Controller).
L’API est versionnée via /api/v1 et consommée par une page HTML simple.

---

## Architecture du projet

api-mvc/

- controllers/        -> Logique des requêtes HTTP  
- models/             -> Gestion des données (en mémoire)  
- routes/             -> Définition des routes API  
- public/             -> Frontend (index.html)  

- app.js              -> Configuration Express  
- server.js           -> Lancement du serveur  
- package.json  
- README.md  

---

## Installation

npm install

---

## Lancer le projet

npm run dev

Serveur accessible sur :
http://localhost:3000

---

## Frontend

Une page HTML simple permet d’interagir avec l’API :

http://localhost:3000

Fonctionnalités :
- Récupérer tous les utilisateurs
- Rechercher un utilisateur par ID
- Modifier un utilisateur
- Supprimer un utilisateur

---

## Endpoints de l’API (v1)

Base URL :
/api/v1/users

- Méthode   Route                    Description
- GET       /api/v1/users            Récupérer tous les users
- GET       /api/v1/users/:id        Récupérer un user par ID
- POST      /api/v1/users            Créer un user
- PUT       /api/v1/users/:id        Modifier un user
- DELETE    /api/v1/users/:id        Supprimer un user

---

## Exemple de requête POST

{
  "name": "David"
}

---

## Technologies utilisées

- Node.js
- Express
- JavaScript
- HTML / Fetch API
- Git & GitHub

---

## Notes

- Les données sont stockées en mémoire (pas de base de données)
- Le projet respecte une séparation claire des responsabilités
- Le versioning permet d’ajouter facilement une future /api/v2
