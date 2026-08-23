const express = require('express')
const router = express.Router()

const authController = require('../controllers/auth.controller')
const { loginRules } = require('../middlewares/validators/auth.validator')
const validate = require('../middlewares/validate')

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Connexion réussie, un cookie de session est posé }
 *       400: { description: Données invalides }
 *       401: { description: Email ou mot de passe incorrect }
 */
router.post('/login', loginRules, validate, authController.login)

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Déconnexion de l'utilisateur courant
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       200: { description: Déconnexion réussie }
 */
router.get('/logout', authController.logout)

module.exports = router
