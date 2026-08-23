const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userService = require('./user.service')

const TOKEN_EXPIRY = '2h'

/**
 * Vérifie les identifiants d'un utilisateur et retourne un token JWT en cas de succès.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token:string, user:{username:string, email:string}}>}
 * @throws {Error} avec `status` 401 si les identifiants sont invalides.
 */
exports.login = async (email, password) => {
    const user = await userService.getByEmailWithPassword(email)

    if (!user) {
        const error = new Error('Email ou mot de passe incorrect')
        error.status = 401
        throw error
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
        const error = new Error('Email ou mot de passe incorrect')
        error.status = 401
        throw error
    }

    const token = jwt.sign(
        { id: user._id, email: user.email, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
    )

    return {
        token,
        user: { username: user.username, email: user.email }
    }
}

/**
 * Vérifie un token JWT et retourne son contenu décodé.
 * @param {string} token
 * @returns {{id:string, email:string, username:string}}
 * @throws {Error} si le token est invalide ou expiré.
 */
exports.verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
}
