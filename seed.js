/**
 * Script d'initialisation de la base de données.
 * Importe les catways et réservations fournis, et crée un compte de test.
 * Usage : npm run seed
 */
require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Catway = require('./models/Catway')
const Reservation = require('./models/Reservation')
const User = require('./models/User')

const catways = require('./data/catways.json')
const reservations = require('./data/reservations.json')

const TEST_USER = {
    username: 'admin',
    email: 'admin@mail.com',
    password: '123456'
}

async function seed() {
    if (!process.env.MONGO_URI) {
        console.error('MONGO_URI manquant dans .env')
        process.exit(1)
    }

    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connecté à MongoDB')

    await Catway.deleteMany({})
    await Catway.insertMany(catways)
    console.log(`${catways.length} catways importés`)

    await Reservation.deleteMany({})
    await Reservation.insertMany(reservations)
    console.log(`${reservations.length} réservations importées`)

    const existingUser = await User.findOne({ email: TEST_USER.email })

    if (!existingUser) {
        const hashedPassword = await bcrypt.hash(TEST_USER.password, 10)
        await User.create({
            username: TEST_USER.username,
            email: TEST_USER.email,
            password: hashedPassword,
            role: 'admin'
        })
        console.log(`Utilisateur de test créé : ${TEST_USER.email} / ${TEST_USER.password} (admin)`)
    } else {
        existingUser.role = 'admin'
        await existingUser.save()
        console.log(`Utilisateur de test déjà existant : ${TEST_USER.email} (rôle admin confirmé)`)
    }

    await mongoose.disconnect()
    console.log('Terminé.')
}

seed().catch((error) => {
    console.error('Échec du seed :', error)
    process.exit(1)
})
