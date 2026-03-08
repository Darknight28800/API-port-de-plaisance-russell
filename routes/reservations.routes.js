const express = require('express')
const router = express.Router()

const Reservation = require('../models/Reservation')

router.get('/', async (req, res) => {

    try {

        const reservations = await Reservation.find()

        res.render('reservations/list', {
            reservations: reservations
        })

    } catch (error) {

        res.status(500).send(error.message)

    }

})

module.exports = router