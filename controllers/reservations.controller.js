const reservationService = require('../services/reservation.service')

/** GET /reservations — liste toutes les réservations, tous catways confondus. */
exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await reservationService.listAll()
        res.json(reservations)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

/** GET /catways/:id/reservations — liste les réservations d'un catway. */
exports.getReservationsByCatway = async (req, res) => {
    try {
        const reservations = await reservationService.listByCatway(req.params.id)
        res.json(reservations)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

/** GET /catways/:id/reservations/:idReservation — détails d'une réservation. */
exports.getReservationById = async (req, res) => {
    try {
        const reservation = await reservationService.getOne(req.params.id, req.params.idReservation)

        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' })
        }

        res.json(reservation)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

/** POST /catways/:id/reservations — crée une réservation. */
exports.createReservation = async (req, res) => {
    try {
        const reservation = await reservationService.create(req.params.id, req.body)
        res.status(201).json(reservation)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

/** PUT /catways/:id/reservations/:idReservation — modifie une réservation. */
exports.updateReservation = async (req, res) => {
    try {
        const reservation = await reservationService.update(req.params.id, req.params.idReservation, req.body)

        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' })
        }

        res.json(reservation)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

/** DELETE /catways/:id/reservations/:idReservation — supprime une réservation. */
exports.deleteReservation = async (req, res) => {
    try {
        const reservation = await reservationService.remove(req.params.id, req.params.idReservation)

        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' })
        }

        res.json({ message: 'Réservation supprimée' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
