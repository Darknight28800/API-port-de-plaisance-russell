const { body } = require('express-validator')
const catwayService = require('../../services/catway.service')

/**
 * Règles de validation pour la création d'un catway.
 */
exports.createRules = [
    body('catwayNumber')
        .notEmpty().withMessage('Le numéro de catway est obligatoire')
        .bail()
        .isInt({ min: 1 }).withMessage('Le numéro de catway doit être un entier positif')
        .bail()
        .custom(async (value) => {
            const existing = await catwayService.getByNumber(Number(value))
            if (existing) {
                throw new Error('Ce numéro de catway existe déjà')
            }
            return true
        }),
    body('catwayType')
        .notEmpty().withMessage('Le type de catway est obligatoire')
        .isIn(['long', 'short']).withMessage('Le type doit être "long" ou "short"'),
    body('catwayState')
        .trim()
        .notEmpty().withMessage('L\'état du catway est obligatoire')
        .isLength({ max: 500 }).withMessage('L\'état ne doit pas dépasser 500 caractères')
]

/**
 * Règles de validation pour la mise à jour de l'état d'un catway
 * (le numéro et le type ne sont pas modifiables).
 */
exports.updateRules = [
    body('catwayState')
        .trim()
        .notEmpty().withMessage('L\'état du catway est obligatoire')
        .isLength({ max: 500 }).withMessage('L\'état ne doit pas dépasser 500 caractères')
]
