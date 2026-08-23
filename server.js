require('dotenv').config()
const connectDB = require('./config/db')
const app = require('./app')

const port = process.env.PORT || 8000

/**
 * Le serveur n'ouvre le port qu'une fois la connexion MongoDB confirmée,
 * pour éviter qu'il ne se déclare "lancé" puis se coupe juste après en
 * cas d'échec de connexion (comportement confus en production).
 */
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`🚀 Serveur lancé sur http://localhost:${port}`)
    })
})
