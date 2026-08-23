const authService = require('../services/auth.service')

/**
 * Protège une route : vérifie le token JWT stocké dans le cookie `token`.
 * - Sur une route de page (préfixe /dashboard), redirige vers l'accueil en cas d'échec.
 * - Sur une route de l'API, répond 401 en JSON en cas d'échec.
 * En cas de succès, attache l'utilisateur décodé à `req.user`.
 */
const authenticate = (req, res, next) => {
    const token = req.cookies?.token

    if (!token) {
        return handleUnauthenticated(req, res, 'Authentification requise.')
    }

    try {
        req.user = authService.verifyToken(token)
        next()
    } catch (error) {
        return handleUnauthenticated(req, res, 'Session invalide ou expirée.')
    }
}

function handleUnauthenticated(req, res, message) {
    if (req.originalUrl.startsWith('/dashboard')) {
        return res.redirect('/?error=' + encodeURIComponent(message))
    }
    return res.status(401).json({ message })
}

module.exports = authenticate
