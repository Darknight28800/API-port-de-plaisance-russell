const { body } = require('express-validator')
const catwayService = require('../../services/catway.service')
const reservationService = require('../../services/reservation.service')

const catwayMustExist = async (value, { req }) => {
    const catway = await catwayService.getByNumber(Number(req.params.id))
    if (!catway) {
        throw new Error('Le catway indiqué n\'existe pas')
    }
    return true
}

const datesMustBeCoherent = (value, { req }) => {
    const start = new Date(req.body.startDate)
    const end = new Date(req.body.endDate)

    if (end <= start) {
        throw new Error('La date de fin doit être postérieure à la date de début')
    }
    return true
}

const noOverlap = async (value, { req }) => {
    const overlap = await reservationService.hasOverlap(
        Number(req.params.id),
        new Date(req.body.startDate),
        new Date(req.body.endDate),
        req.params.idReservation
    )

    if (overlap) {
        throw new Error('Ce catway est déjà réservé sur cette période')
    }
    return true
}

/**
 * Règles de validation pour la création d'une réservation.
 */
exports.createRules = [
    body('clientName').trim().notEmpty().withMessage('Le nom du client est obligatoire'),
    body('boatName').trim().notEmpty().withMessage('Le nom du bateau est obligatoire'),
    body('startDate').notEmpty().withMessage('La date de début est obligatoire').isISO8601().withMessage('Date de début invalide'),
    body('endDate').notEmpty().withMessage('La date de fin est obligatoire').isISO8601().withMessage('Date de fin invalide'),
    body('endDate').custom(datesMustBeCoherent),
    body('catwayNumber').custom(catwayMustExist),
    body('endDate').custom(noOverlap)
]

/**
 * Règles de validation pour la mise à jour d'une réservation.
 */
exports.updateRules = [
    body('clientName').trim().notEmpty().withMessage('Le nom du client est obligatoire'),
    body('boatName').trim().notEmpty().withMessage('Le nom du bateau est obligatoire'),
    body('startDate').notEmpty().withMessage('La date de début est obligatoire').isISO8601().withMessage('Date de début invalide'),
    body('endDate').notEmpty().withMessage('La date de fin est obligatoire').isISO8601().withMessage('Date de fin invalide'),
    body('endDate').custom(datesMustBeCoherent),
    body('catwayNumber').custom(catwayMustExist),
    body('endDate').custom(noOverlap)
]
