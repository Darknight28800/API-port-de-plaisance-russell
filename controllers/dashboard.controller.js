const Reservation = require('../models/Reservation')

exports.getDashboard = async (req, res) => {

    try {

        const reservations = await Reservation.find()

        res.render('dashboard', {
            user: req.user,
            date: new Date().toLocaleDateString(),
            reservations
        })

    } catch (error) {

        res.status(500).send(error.message)

    }

}