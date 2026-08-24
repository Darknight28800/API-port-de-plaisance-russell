const express = require('express')
const router = express.Router()

const authenticate = require('../middlewares/auth.middleware')
const { requireAdmin } = require('../middlewares/auth.middleware')
const catwaysController = require('../controllers/catways.controller')
const { createRules, updateRules } = require('../middlewares/validators/catway.validator')
const validate = require('../middlewares/validate')
const catwayReservationsRoutes = require('./catwayReservations.routes')

router.use(authenticate)

/**
 * @swagger
 * /catways:
 *   get:
 *     summary: Liste tous les catways
 *     tags: [Catways]
 *     responses:
 *       200:
 *         description: Liste des catways
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Catway' } }
 *   post:
 *     summary: Crée un catway
 *     tags: [Catways]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Catway' }
 *     responses:
 *       201: { description: Catway créé }
 *       400: { description: Données invalides }
 */
router.get('/', catwaysController.getAllCatways)
router.post('/', requireAdmin, createRules, validate, catwaysController.createCatway)

/**
 * @swagger
 * /catways/{id}:
 *   get:
 *     summary: Détails d'un catway
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Catway trouvé }
 *       404: { description: Catway non trouvé }
 *   put:
 *     summary: Modifie l'état d'un catway (numéro et type non modifiables)
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               catwayState: { type: string }
 *     responses:
 *       200: { description: Catway modifié }
 *       404: { description: Catway non trouvé }
 *   delete:
 *     summary: Supprime un catway
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Catway supprimé }
 *       404: { description: Catway non trouvé }
 */
router.get('/:id', catwaysController.getCatwayById)
router.put('/:id', requireAdmin, updateRules, validate, catwaysController.updateCatway)
router.delete('/:id', requireAdmin, catwaysController.deleteCatway)

router.use('/:id/reservations', catwayReservationsRoutes)

module.exports = router
