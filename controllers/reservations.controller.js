const Reservation = require('../models/Reservation')

// GET /catways/:id/reservations
exports.getReservationsByCatway = async (req, res) => {
    try {

        const reservations = await Reservation.find({
            catwayNumber: req.params.id
        })

        res.json(reservations)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// GET /catways/:id/reservations/:idReservation
exports.getReservationById = async (req, res) => {
    try {

        const reservation = await Reservation.findById(req.params.idReservation)

        if (!reservation) {
            return res.status(404).json({ message: "Réservation non trouvée" })
        }

        res.json(reservation)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// POST /catways/:id/reservations
exports.createReservation = async (req, res) => {
    try {

        const newReservation = new Reservation({
            catwayNumber: req.params.id,
            clientName: req.body.clientName,
            boatName: req.body.boatName,
            startDate: req.body.startDate,
            endDate: req.body.endDate
        })

        const savedReservation = await newReservation.save()

        res.status(201).json(savedReservation)

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// PUT /catways/:id/reservations/:idReservation
exports.updateReservation = async (req, res) => {
    try {

        const updatedReservation = await Reservation.findByIdAndUpdate(
            req.params.idReservation,
            req.body,
            { new: true }
        )

        if (!updatedReservation) {
            return res.status(404).json({ message: "Réservation non trouvée" })
        }

        res.json(updatedReservation)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// DELETE /catways/:id/reservations/:idReservation
exports.deleteReservation = async (req, res) => {
    try {

        const deletedReservation = await Reservation.findByIdAndDelete(
            req.params.idReservation
        )

        if (!deletedReservation) {
            return res.status(404).json({ message: "Réservation non trouvée" })
        }

        res.json({ message: "Réservation supprimée" })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}