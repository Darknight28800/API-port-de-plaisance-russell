const mongoose = require('mongoose')

/**
 * Ouvre la connexion à MongoDB en utilisant l'URI défini dans les variables
 * d'environnement (MONGO_URI). Arrête le process si la connexion échoue,
 * car l'application ne peut pas fonctionner sans base de données.
 */
const connectDB = async () => {

    const uri = process.env.MONGO_URI

    if (!uri) {
        console.error('MONGO_URI manquant dans les variables d\'environnement (.env)')
        process.exit(1)
    }

    try {

        await mongoose.connect(uri)

        console.log('MongoDB connecté')

    } catch (error) {

        console.error('Échec de connexion à MongoDB :', error.message)

        process.exit(1)

    }

}

module.exports = connectDB
