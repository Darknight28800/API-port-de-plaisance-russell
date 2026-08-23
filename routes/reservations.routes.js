const express = require('express')
const router = express.Router()

const authenticate = require('../middlewares/auth.middleware')
const reservationsController = require('../controllers/reservations.controller')

router.use(authenticate)

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Liste toutes les réservations, tous catways confondus
 *     tags: [Reservations]
 *     responses:
 *       200:
 *         description: Liste des réservations
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Reservation' } }
 */
router.get('/', reservationsController.getAllReservations)

module.exports = router
