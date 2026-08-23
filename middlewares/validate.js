const { validationResult } = require('express-validator')

/**
 * Middleware générique : arrête la requête avec un 400 et des messages
 * explicites si une des règles express-validator déclarées avant lui a échoué.
 */
const validate = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Données invalides',
            errors: errors.array().map((e) => ({ field: e.path, message: e.msg }))
        })
    }

    next()
}

module.exports = validate
