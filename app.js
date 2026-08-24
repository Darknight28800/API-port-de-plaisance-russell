const express = require('express')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')

const catwaysRoutes = require('./routes/catways.routes')
const reservationsRoutes = require('./routes/reservations.routes')
const usersRoutes = require('./routes/users.routes')
const authRoutes = require('./routes/auth.routes')
const pagesRoutes = require('./routes/pages.routes')

const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./config/swagger')

const app = express()

// Nécessaire derrière le proxy de Render pour que express-rate-limit (et
// req.ip en général) lise la vraie IP du client via X-Forwarded-For.
app.set('trust proxy', 1)

app.set('view engine', 'ejs')

// En-têtes de sécurité HTTP standards. La CSP par défaut est désactivée car
// les vues EJS et Swagger UI reposent sur des scripts/styles inline.
app.use(helmet({ contentSecurityPolicy: false }))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static('public'))

// Documentation interactive de l'API, accessible sans authentification.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// API REST (JSON), protégée par JWT.
app.use('/catways', catwaysRoutes)
app.use('/reservations', reservationsRoutes)
app.use('/users', usersRoutes)

// Connexion / déconnexion.
app.use('/', authRoutes)

// Pages web (accueil public + tableau de bord et CRUD protégés).
app.use('/', pagesRoutes)

module.exports = app
