const { body } = require('express-validator')

/**
 * Règles de validation pour la connexion.
 */
exports.loginRules = [
    body('email').trim().notEmpty().withMessage('L\'email est obligatoire').isEmail().withMessage('Email invalide'),
    body('password').notEmpty().withMessage('Le mot de passe est obligatoire')
]
