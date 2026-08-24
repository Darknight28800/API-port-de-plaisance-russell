# API Port de Plaisance Russell

Application web de gestion des catways (emplacements d'amarrage) et des réservations
pour la capitainerie du port de plaisance de Russell : API REST sécurisée par JWT et
interface web (pages EJS) pour l'authentification et les opérations CRUD.

## Fonctionnalités

- Authentification par JWT (cookie httpOnly, `Secure` en production)
- Rôles utilisateurs : **admin** (gestion des catways et des comptes) et **user** (lecture + gestion des réservations)
- API REST privée : catways, réservations (sous-ressource des catways), utilisateurs
- Page d'accueil publique avec formulaire de connexion et lien vers la documentation
- Tableau de bord protégé, avec les réservations en cours chargées en asynchrone depuis l'API
- Pages de gestion CRUD pour les catways, réservations et utilisateurs, avec notifications visuelles (toasts)
- Validation des données côté serveur (unicité, formats, cohérence des dates, chevauchement de réservations)
- Documentation interactive de l'API via Swagger UI
- Durcissement production : en-têtes de sécurité (Helmet), limitation des tentatives de connexion
- Suite de tests automatisés (intégration API) exécutée en CI sur chaque push

## Technologies utilisées

- Node.js / Express 5
- MongoDB / Mongoose
- EJS (moteur de templates)
- JWT (jsonwebtoken) + bcrypt pour l'authentification
- express-validator pour la validation des entrées
- swagger-jsdoc / swagger-ui-express pour la documentation de l'API
- helmet / express-rate-limit pour la sécurité
- node:test / supertest / mongodb-memory-server pour les tests, GitHub Actions pour la CI

## Prérequis

- Node.js ≥ 18
- Une base MongoDB (locale ou [MongoDB Atlas](https://www.mongodb.com/atlas))

## Installation

```bash
git clone https://github.com/Darknight28800/API-port-de-plaisance-russell.git
cd API-port-de-plaisance-russell
npm install
```

## Configuration

Créer un fichier `.env` à la racine du projet (voir `.env.example`) :

```
PORT=8000
MONGO_URI=mongodb://localhost:27017/port_russell
JWT_SECRET=une_chaine_secrete_longue_et_aleatoire
```

- `PORT` : port d'écoute du serveur (utilisé en local ; sur Render, la plateforme fournit sa propre valeur).
- `MONGO_URI` : chaîne de connexion MongoDB (locale ou Atlas).
- `JWT_SECRET` : secret utilisé pour signer/vérifier les tokens JWT.

## Initialiser les données

Un script importe les catways et réservations fournis (`data/catways.json`,
`data/reservations.json`) et crée un compte de test :

```bash
npm run seed
```

Compte créé : `admin@mail.com` / `123456` (rôle **admin**).

## Tests

```bash
npm test
```

Suite d'intégration (node:test + supertest) exécutée contre une base MongoDB
en mémoire (mongodb-memory-server), sans dépendre d'une base réelle. Couvre
l'authentification, le CRUD complet des trois ressources, la validation
serveur et les permissions par rôle. Exécutée automatiquement en CI
(GitHub Actions, voir `.github/workflows/ci.yml`) à chaque push/PR sur `main`.

## Lancer le projet

```bash
npm start        # production
npm run dev       # développement, avec rechargement automatique (nodemon)
```

L'application est accessible sur `http://localhost:8000`.

## Déploiement

L'application lit `process.env.PORT` et `process.env.MONGO_URI` : elle est compatible
telle quelle avec Render (ou tout hébergeur Node.js), à condition de renseigner les
variables d'environnement `MONGO_URI` (cluster MongoDB Atlas) et `JWT_SECRET` dans le
tableau de bord du service, et de lancer `npm run seed` une fois (via un shell Render
ou en local en pointant temporairement `MONGO_URI` vers le cluster Atlas) pour peupler
la base hébergée.

## Rôles et permissions

Deux rôles sont disponibles sur un compte utilisateur (`role: 'admin' | 'user'`) :

| Action                                   | admin | user |
|-------------------------------------------|:-----:|:----:|
| Consulter catways / réservations          | ✅    | ✅   |
| Créer / modifier / supprimer une réservation | ✅  | ✅   |
| Créer / modifier / supprimer un catway    | ✅    | ❌ (403) |
| Gérer les comptes utilisateurs (`/users`) | ✅    | ❌ (403) |

Le rôle est encodé dans le token JWT et vérifié par le middleware
`requireAdmin` (`middlewares/auth.middleware.js`), aussi bien sur les routes
API que sur les pages du tableau de bord (redirection si non autorisé).

## Routes principales

### Authentification

| Méthode | Route     | Description                       |
|---------|-----------|------------------------------------|
| POST    | `/login`  | Connexion (pose un cookie JWT)     |
| GET     | `/logout` | Déconnexion                        |

### Catways

| Méthode | Route              | Description                              |
|---------|---------------------|-------------------------------------------|
| GET     | `/catways`          | Liste des catways                         |
| GET     | `/catways/:id`      | Détails d'un catway                       |
| POST    | `/catways`          | Création d'un catway                      |
| PUT     | `/catways/:id`      | Modification de l'état d'un catway        |
| DELETE  | `/catways/:id`      | Suppression d'un catway                   |

### Réservations

| Méthode | Route                                            | Description                          |
|---------|---------------------------------------------------|----------------------------------------|
| GET     | `/reservations`                                   | Liste de toutes les réservations       |
| GET     | `/catways/:id/reservations`                       | Réservations d'un catway               |
| GET     | `/catways/:id/reservations/:idReservation`        | Détails d'une réservation              |
| POST    | `/catways/:id/reservations`                       | Création d'une réservation             |
| PUT     | `/catways/:id/reservations/:idReservation`        | Modification d'une réservation         |
| DELETE  | `/catways/:id/reservations/:idReservation`        | Suppression d'une réservation          |

### Utilisateurs

| Méthode | Route             | Description                     |
|---------|--------------------|-----------------------------------|
| GET     | `/users`           | Liste des utilisateurs            |
| GET     | `/users/:email`    | Détails d'un utilisateur          |
| POST    | `/users`           | Création d'un utilisateur         |
| PUT     | `/users/:email`    | Modification d'un utilisateur     |
| DELETE  | `/users/:email`    | Suppression d'un utilisateur      |

Toutes les routes ci-dessus (hors `/login`) nécessitent le cookie de session posé par
`/login`. La documentation complète et interactive (schémas, essai des requêtes) est
disponible sur **`/api-docs`**.

### Pages web

| Route                              | Accès     | Description                                  |
|-------------------------------------|-----------|-----------------------------------------------|
| `/`                                 | public    | Accueil, formulaire de connexion, lien doc     |
| `/dashboard`                        | connecté  | Tableau de bord (infos utilisateur, réservations en cours) |
| `/dashboard/catways`                | connecté  | Liste + gestion des catways                    |
| `/dashboard/reservations`           | connecté  | Liste + gestion des réservations               |
| `/dashboard/users`                  | connecté  | Liste + gestion des utilisateurs               |

## Architecture du projet

```
app.js                   Configuration Express (middlewares, montage des routes)
server.js                Point d'entrée (chargement .env + démarrage du serveur)
config/                  Connexion MongoDB, configuration Swagger
routes/                  Définition des routes (API + pages), annotations Swagger
controllers/             Gestion des requêtes/réponses HTTP
services/                Logique métier et accès aux données (Mongoose)
middlewares/             Authentification JWT, rôles, validation des entrées, rate-limit
models/                  Schémas Mongoose (User, Catway, Reservation)
views/                   Templates EJS (pages publiques et tableau de bord)
public/                  Assets statiques (CSS, JS : notifications toast)
data/                    Jeux de données fournis (catways.json, reservations.json)
tests/                   Suite de tests d'intégration (node:test + supertest)
.github/workflows/       Pipeline CI (GitHub Actions)
seed.js                  Script d'import des données + création d'un compte de test
```

Les routes délèguent aux controllers, qui délèguent eux-mêmes aux services (aucun accès
direct aux models depuis les controllers), afin de séparer clairement la couche HTTP de
la logique métier.

## Livrable

- Dépôt GitHub : https://github.com/Darknight28800/API-port-de-plaisance-russell
- Application hébergée : (lien Render)
- Compte de test : `admin@mail.com` / `123456`
