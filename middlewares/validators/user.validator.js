const { body } = require('express-validator')
const userService = require('../../services/user.service')

/**
 * Règles de validation pour la création d'un utilisateur.
 */
exports.createRules = [
    body('username')
        .trim()
        .notEmpty().withMessage('Le nom d\'utilisateur est obligatoire')
        .isLength({ min: 2 }).withMessage('Le nom d\'utilisateur doit contenir au moins 2 caractères'),
    body('email')
        .trim()
        .notEmpty().withMessage('L\'email est obligatoire')
        .isEmail().withMessage('Email invalide')
        .bail()
        .custom(async (value) => {
            const existing = await userService.getByEmail(value.toLowerCase())
            if (existing) {
                throw new Error('Cet email est déjà utilisé')
            }
            return true
        }),
    body('password')
        .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
]

/**
 * Règles de validation pour la mise à jour d'un utilisateur.
 * Le mot de passe est optionnel (il n'est mis à jour que s'il est fourni).
 */
exports.updateRules = [
    body('username')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 2 }).withMessage('Le nom d\'utilisateur doit contenir au moins 2 caractères'),
    body('email')
        .optional({ checkFalsy: true })
        .trim()
        .isEmail().withMessage('Email invalide')
        .bail()
        .custom(async (value, { req }) => {
            const existing = await userService.getByEmail(value.toLowerCase())
            if (existing && existing.email !== req.params.email.toLowerCase()) {
                throw new Error('Cet email est déjà utilisé')
            }
            return true
        }),
    body('password')
        .optional({ checkFalsy: true })
        .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
]
