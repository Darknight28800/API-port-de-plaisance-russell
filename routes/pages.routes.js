const express = require('express')
const router = express.Router()

const authenticate = require('../middlewares/auth.middleware')
const { requireAdmin } = require('../middlewares/auth.middleware')
const pagesController = require('../controllers/pages.controller')

/** Page d'accueil publique (présentation + formulaire de connexion + lien vers la doc). */
router.get('/', pagesController.getHome)

// Toutes les pages sous /dashboard nécessitent une session valide.
router.use('/dashboard', authenticate)

router.get('/dashboard', pagesController.getDashboard)

router.get('/dashboard/catways', pagesController.getCatwaysPage)
router.get('/dashboard/catways/create', requireAdmin, pagesController.getCatwayCreatePage)
router.get('/dashboard/catways/:id/edit', requireAdmin, pagesController.getCatwayEditPage)

router.get('/dashboard/reservations', pagesController.getReservationsPage)
router.get('/dashboard/reservations/create', pagesController.getReservationCreatePage)
router.get('/dashboard/reservations/:catwayId/:id/edit', pagesController.getReservationEditPage)

// La gestion des comptes est réservée aux administrateurs.
router.use('/dashboard/users', requireAdmin)
router.get('/dashboard/users', pagesController.getUsersPage)
router.get('/dashboard/users/create', pagesController.getUserCreatePage)
router.get('/dashboard/users/:email/edit', pagesController.getUserEditPage)

module.exports = router
