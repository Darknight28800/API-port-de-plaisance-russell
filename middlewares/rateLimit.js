const rateLimit = require('express-rate-limit')

/**
 * Limite les tentatives de connexion pour ralentir les attaques par force
 * brute : 10 tentatives maximum par IP toutes les 15 minutes.
 */
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Trop de tentatives de connexion. Réessayez dans quelques minutes.' }
})

module.exports = { loginLimiter }
