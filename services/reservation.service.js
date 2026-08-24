const Reservation = require('../models/Reservation')

/**
 * Retourne l'ensemble des réservations, toutes catways confondus.
 * @returns {Promise<Array>}
 */
exports.listAll = () => {
    return Reservation.find().sort({ startDate: -1 })
}

/**
 * Retourne les réservations d'un catway donné.
 * @param {number|string} catwayNumber
 * @returns {Promise<Array>}
 */
exports.listByCatway = (catwayNumber) => {
    return Reservation.find({ catwayNumber }).sort({ startDate: -1 })
}

/**
 * Retourne une réservation précise d'un catway.
 * @param {number|string} catwayNumber
 * @param {string} reservationId
 * @returns {Promise<Object|null>}
 */
exports.getOne = (catwayNumber, reservationId) => {
    return Reservation.findOne({ _id: reservationId, catwayNumber })
}

/**
 * Indique si une période chevauche une réservation existante sur le même catway.
 * @param {number|string} catwayNumber
 * @param {Date} startDate
 * @param {Date} endDate
 * @param {string} [excludeId] réservation à ignorer (cas d'une mise à jour)
 * @returns {Promise<boolean>}
 */
exports.hasOverlap = async (catwayNumber, startDate, endDate, excludeId) => {
    const query = {
        catwayNumber,
        startDate: { $lt: endDate },
        endDate: { $gt: startDate }
    }

    if (excludeId) {
        query._id = { $ne: excludeId }
    }

    const conflict = await Reservation.findOne(query)

    return Boolean(conflict)
}

/**
 * Crée une réservation pour un catway.
 * @param {number|string} catwayNumber
 * @param {{clientName:string, boatName:string, startDate:Date, endDate:Date}} data
 * @returns {Promise<Object>}
 */
exports.create = (catwayNumber, data) => {
    const reservation = new Reservation({
        catwayNumber,
        clientName: data.clientName,
        boatName: data.boatName,
        startDate: data.startDate,
        endDate: data.endDate
    })

    return reservation.save()
}

/**
 * Met à jour une réservation existante.
 * @param {number|string} catwayNumber
 * @param {string} reservationId
 * @param {Object} data
 * @returns {Promise<Object|null>}
 */
exports.update = (catwayNumber, reservationId, data) => {
    return Reservation.findOneAndUpdate(
        { _id: reservationId, catwayNumber },
        {
            clientName: data.clientName,
            boatName: data.boatName,
            startDate: data.startDate,
            endDate: data.endDate
        },
        { returnDocument: 'after', runValidators: true }
    )
}

/**
 * Supprime une réservation.
 * @param {number|string} catwayNumber
 * @param {string} reservationId
 * @returns {Promise<Object|null>}
 */
exports.remove = (catwayNumber, reservationId) => {
    return Reservation.findOneAndDelete({ _id: reservationId, catwayNumber })
}
