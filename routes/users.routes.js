const express = require('express')
const router = express.Router()

const User = require('../models/User')
const bcrypt = require('bcrypt')

/* LISTE DES UTILISATEURS */
router.get('/', async (req, res) => {

    const users = await User.find()

    res.render('users/list', {
        users: users
    })

})

/* PAGE CREATION UTILISATEUR */
router.get('/create', (req, res) => {

    res.render('users/create')

})

/* CREATION UTILISATEUR */
router.post('/create', async (req, res) => {

    const { username, email, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
        username,
        email,
        password: hashedPassword
    })

    await user.save()

    res.redirect('/users')

})

module.exports = router

module.exports = router