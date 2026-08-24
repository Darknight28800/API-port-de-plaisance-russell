const bcrypt = require('bcrypt')
const User = require('../models/User')

const SALT_ROUNDS = 10

/**
 * Retourne l'ensemble des utilisateurs (sans le mot de passe).
 * @returns {Promise<Array>}
 */
exports.list = () => {
    return User.find().select('-password')
}

/**
 * Retourne un utilisateur à partir de son email (sans le mot de passe).
 * @param {string} email
 * @returns {Promise<Object|null>}
 */
exports.getByEmail = (email) => {
    return User.findOne({ email }).select('-password')
}

/**
 * Retourne un utilisateur avec son mot de passe haché (usage interne : login).
 * @param {string} email
 * @returns {Promise<Object|null>}
 */
exports.getByEmailWithPassword = (email) => {
    return User.findOne({ email })
}

/**
 * Crée un utilisateur en hachant son mot de passe.
 * @param {{username:string, email:string, password:string, role?:'admin'|'user'}} data
 * @returns {Promise<Object>}
 */
exports.create = async (data) => {
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS)

    const user = new User({
        username: data.username,
        email: data.email,
        password: hashedPassword,
        role: data.role === 'admin' ? 'admin' : 'user'
    })

    await user.save()

    const result = user.toObject()
    delete result.password

    return result
}

/**
 * Met à jour un utilisateur. Si un mot de passe est fourni, il est haché.
 * @param {string} email
 * @param {{username?:string, email?:string, password?:string, role?:'admin'|'user'}} data
 * @returns {Promise<Object|null>}
 */
exports.update = async (email, data) => {
    const update = {}

    if (data.username !== undefined) update.username = data.username
    if (data.email !== undefined) update.email = data.email
    if (data.password) update.password = await bcrypt.hash(data.password, SALT_ROUNDS)
    if (data.role !== undefined) update.role = data.role === 'admin' ? 'admin' : 'user'

    return User.findOneAndUpdate({ email }, update, { returnDocument: 'after', runValidators: true }).select('-password')
}

/**
 * Supprime un utilisateur.
 * @param {string} email
 * @returns {Promise<Object|null>}
 */
exports.remove = (email) => {
    return User.findOneAndDelete({ email })
}
