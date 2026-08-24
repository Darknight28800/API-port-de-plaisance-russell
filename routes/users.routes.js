const express = require('express')
const router = express.Router()

const authenticate = require('../middlewares/auth.middleware')
const { requireAdmin } = require('../middlewares/auth.middleware')
const usersController = require('../controllers/users.controller')
const { createRules, updateRules } = require('../middlewares/validators/user.validator')
const validate = require('../middlewares/validate')

// La gestion des comptes est réservée aux administrateurs.
router.use(authenticate, requireAdmin)

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Liste tous les utilisateurs
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/User' } }
 *   post:
 *     summary: Crée un utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/User' }
 *     responses:
 *       201: { description: Utilisateur créé }
 *       400: { description: Données invalides }
 */
router.get('/', usersController.getAllUsers)
router.post('/', createRules, validate, usersController.createUser)

/**
 * @swagger
 * /users/{email}:
 *   get:
 *     summary: Détails d'un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Utilisateur trouvé }
 *       404: { description: Utilisateur non trouvé }
 *   put:
 *     summary: Modifie un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/User' }
 *     responses:
 *       200: { description: Utilisateur modifié }
 *       404: { description: Utilisateur non trouvé }
 *   delete:
 *     summary: Supprime un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Utilisateur supprimé }
 *       404: { description: Utilisateur non trouvé }
 */
router.get('/:email', usersController.getUserByEmail)
router.put('/:email', updateRules, validate, usersController.updateUser)
router.delete('/:email', usersController.deleteUser)

module.exports = router
