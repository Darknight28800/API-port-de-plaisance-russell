const Catway = require('../models/Catway')

/**
 * Retourne l'ensemble des catways, triés par numéro.
 * @returns {Promise<Array>}
 */
exports.list = () => {
    return Catway.find().sort({ catwayNumber: 1 })
}

/**
 * Retourne un catway à partir de son numéro.
 * @param {number|string} catwayNumber
 * @returns {Promise<Object|null>}
 */
exports.getByNumber = (catwayNumber) => {
    return Catway.findOne({ catwayNumber })
}

/**
 * Crée un nouveau catway.
 * @param {{catwayNumber:number, catwayType:string, catwayState:string}} data
 * @returns {Promise<Object>}
 */
exports.create = (data) => {
    const catway = new Catway({
        catwayNumber: data.catwayNumber,
        catwayType: data.catwayType,
        catwayState: data.catwayState
    })

    return catway.save()
}

/**
 * Met à jour uniquement l'état d'un catway (le numéro et le type sont fixes).
 * @param {number|string} catwayNumber
 * @param {string} catwayState
 * @returns {Promise<Object|null>}
 */
exports.updateState = (catwayNumber, catwayState) => {
    return Catway.findOneAndUpdate(
        { catwayNumber },
        { catwayState },
        { returnDocument: 'after', runValidators: true }
    )
}

/**
 * Supprime un catway.
 * @param {number|string} catwayNumber
 * @returns {Promise<Object|null>}
 */
exports.remove = (catwayNumber) => {
    return Catway.findOneAndDelete({ catwayNumber })
}
