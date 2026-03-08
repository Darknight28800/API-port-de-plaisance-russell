const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// POST /login
exports.login = async (req, res) => {

    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
        return res.status(401).json({ message: "Utilisateur incorrect" })
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
        return res.status(401).json({ message: "Mot de passe incorrect" })
    }

    const token = jwt.sign(
        { id: user._id, email: user.email },
        "SECRET_KEY",
        { expiresIn: "1h" }
    )

    res.cookie("token", token)
    res.redirect("/dashboard")
}

// GET /logout
exports.logout = (req, res) => {

    res.clearCookie("token")

    res.json({ message: "Déconnexion réussie" })
}