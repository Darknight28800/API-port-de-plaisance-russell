const express = require('express')
const router = express.Router({ mergeParams: true })

const reservationsController = require('../controllers/reservations.controller')
const { createRules, updateRules } = require('../middlewares/validators/reservation.validator')
const validate = require('../middlewares/validate')

/**
 * @swagger
 * /catways/{id}/reservations:
 *   get:
 *     summary: Liste les réservations d'un catway
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Liste des réservations
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Reservation' } }
 *   post:
 *     summary: Crée une réservation pour un catway
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Reservation' }
 *     responses:
 *       201: { description: Réservation créée }
 *       400: { description: Données invalides }
 */
router.get('/', reservationsController.getReservationsByCatway)
router.post('/', createRules, validate, reservationsController.createReservation)

/**
 * @swagger
 * /catways/{id}/reservations/{idReservation}:
 *   get:
 *     summary: Détails d'une réservation
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: idReservation
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Réservation trouvée }
 *       404: { description: Réservation non trouvée }
 *   put:
 *     summary: Modifie une réservation
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: idReservation
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Reservation' }
 *     responses:
 *       200: { description: Réservation modifiée }
 *       404: { description: Réservation non trouvée }
 *   delete:
 *     summary: Supprime une réservation
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: idReservation
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Réservation supprimée }
 *       404: { description: Réservation non trouvée }
 */
router.get('/:idReservation', reservationsController.getReservationById)
router.put('/:idReservation', updateRules, validate, reservationsController.updateReservation)
router.delete('/:idReservation', reservationsController.deleteReservation)

module.exports = router
