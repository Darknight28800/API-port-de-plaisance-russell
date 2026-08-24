const catwayService = require('../services/catway.service')
const reservationService = require('../services/reservation.service')
const userService = require('../services/user.service')

/** GET / — page d'accueil publique avec formulaire de connexion. */
exports.getHome = (req, res) => {
    res.render('home', { error: req.query.error || null })
}

/** GET /dashboard — tableau de bord de l'utilisateur connecté. */
exports.getDashboard = (req, res) => {
    res.render('dashboard', {
        user: req.user,
        date: new Date().toLocaleDateString('fr-FR')
    })
}

/** GET /dashboard/catways — liste des catways. */
exports.getCatwaysPage = async (req, res) => {
    const catways = await catwayService.list()
    res.render('catways/list', { catways, user: req.user })
}

/** GET /dashboard/catways/create — formulaire de création d'un catway (admin). */
exports.getCatwayCreatePage = (req, res) => {
    res.render('catways/create', { user: req.user })
}

/** GET /dashboard/catways/:id/edit — formulaire de modification d'un catway (admin). */
exports.getCatwayEditPage = async (req, res) => {
    const catway = await catwayService.getByNumber(req.params.id)

    if (!catway) {
        return res.redirect('/dashboard/catways')
    }

    res.render('catways/edit', { catway, user: req.user })
}

/** GET /dashboard/reservations — liste de toutes les réservations. */
exports.getReservationsPage = async (req, res) => {
    const reservations = await reservationService.listAll()
    res.render('reservations/list', { reservations, user: req.user })
}

/** GET /dashboard/reservations/create — formulaire de création d'une réservation. */
exports.getReservationCreatePage = async (req, res) => {
    const catways = await catwayService.list()
    res.render('reservations/create', { catways, user: req.user })
}

/** GET /dashboard/reservations/:catwayId/:id/edit — formulaire de modification d'une réservation. */
exports.getReservationEditPage = async (req, res) => {
    const reservation = await reservationService.getOne(req.params.catwayId, req.params.id)

    if (!reservation) {
        return res.redirect('/dashboard/reservations')
    }

    res.render('reservations/edit', { reservation, user: req.user })
}

/** GET /dashboard/users — liste des utilisateurs (admin). */
exports.getUsersPage = async (req, res) => {
    const users = await userService.list()
    res.render('users/list', { users, user: req.user })
}

/** GET /dashboard/users/create — formulaire de création d'un utilisateur (admin). */
exports.getUserCreatePage = (req, res) => {
    res.render('users/create', { user: req.user })
}

/** GET /dashboard/users/:email/edit — formulaire de modification d'un utilisateur (admin). */
exports.getUserEditPage = async (req, res) => {
    const user = await userService.getByEmail(req.params.email)

    if (!user) {
        return res.redirect('/dashboard/users')
    }

    res.render('users/edit', { editedUser: user, user: req.user })
}
