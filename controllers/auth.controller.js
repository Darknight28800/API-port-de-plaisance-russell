const authService = require('../services/auth.service')

const COOKIE_OPTIONS = {
    httpOnly: true,
    maxAge: 2 * 60 * 60 * 1000, // 2h, aligné sur l'expiration du token
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
}

/**
 * POST /login
 * Authentifie un utilisateur et pose un cookie JWT httpOnly.
 * Redirige vers /dashboard si la requête vient du formulaire web,
 * répond en JSON si elle vient d'un client API.
 */
exports.login = async (req, res) => {
    const { email, password } = req.body
    const wantsHtml = req.accepts(['html', 'json']) === 'html'

    try {
        const { token, user } = await authService.login(email, password)

        res.cookie('token', token, COOKIE_OPTIONS)

        if (wantsHtml) {
            return res.redirect('/dashboard')
        }

        return res.json({ message: 'Connexion réussie', user })

    } catch (error) {
        const status = error.status || 500

        if (wantsHtml) {
            return res.redirect('/?error=' + encodeURIComponent(error.message))
        }

        return res.status(status).json({ message: error.message })
    }
}

/**
 * GET /logout
 * Supprime le cookie de session et redirige vers la page d'accueil.
 */
exports.logout = (req, res) => {
    res.clearCookie('token')

    if (req.accepts(['html', 'json']) === 'html') {
        return res.redirect('/')
    }

    return res.json({ message: 'Déconnexion réussie' })
}
