# API – Port de Plaisance de Russell

Documentation interactive complète (schémas, essai des requêtes) :
**`/api-docs`** (Swagger UI), générée depuis les annotations `@swagger` présentes
dans les fichiers du dossier `routes/`.

## Authentification

L'API est privée : toutes les routes (hors `/login`) exigent un cookie `token`
(JWT) posé par `/login`, valable 2 heures.

### POST /login

```json
{
  "email": "admin@mail.com",
  "password": "123456"
}
```

Réponse `200` : pose le cookie `token` et renvoie `{ "message": "...", "user": { "username", "email" } }`.
Réponse `401` : identifiants invalides.

### GET /logout

Supprime le cookie de session.

## Catways

| Méthode | Route | Corps attendu |
|---|---|---|
| GET | `/catways` | – |
| GET | `/catways/:id` | – |
| POST | `/catways` | `{ catwayNumber, catwayType, catwayState }` |
| PUT | `/catways/:id` | `{ catwayState }` (numéro et type non modifiables) |
| DELETE | `/catways/:id` | – |

## Réservations

| Méthode | Route | Corps attendu |
|---|---|---|
| GET | `/reservations` | – (toutes les réservations) |
| GET | `/catways/:id/reservations` | – |
| GET | `/catways/:id/reservations/:idReservation` | – |
| POST | `/catways/:id/reservations` | `{ clientName, boatName, startDate, endDate }` |
| PUT | `/catways/:id/reservations/:idReservation` | `{ clientName, boatName, startDate, endDate }` |
| DELETE | `/catways/:id/reservations/:idReservation` | – |

## Utilisateurs

| Méthode | Route | Corps attendu |
|---|---|---|
| GET | `/users` | – |
| GET | `/users/:email` | – |
| POST | `/users` | `{ username, email, password }` |
| PUT | `/users/:email` | `{ username?, email?, password? }` |
| DELETE | `/users/:email` | – |

## Codes d'erreur

- `400` : données invalides (voir `errors` dans la réponse pour le détail par champ)
- `401` : authentification manquante ou invalide
- `404` : ressource introuvable
- `500` : erreur serveur
