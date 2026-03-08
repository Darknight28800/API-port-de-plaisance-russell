const express = require('express')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')

const catwaysRoutes = require('./routes/catways.routes')
const usersRoutes = require('./routes/users.routes')
const reservationsRoutes = require('./routes/reservations.routes')
const authRoutes = require('./routes/auth.routes')
const dashboardRoutes = require('./routes/dashboard.routes')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./config/swagger')

const app = express()

connectDB()

app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('home')
})

app.use('/catways', catwaysRoutes)
app.use('/users', usersRoutes)
app.use('/reservations', reservationsRoutes)
app.use('/', authRoutes)
app.use('/', dashboardRoutes)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

module.exports = app