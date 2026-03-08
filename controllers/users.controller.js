const User = require('../models/User')
const bcrypt = require('bcrypt')

// GET /users
exports.getAllUsers = async (req, res) => {
    const users = await User.find()
    res.json(users)
}

// GET /users/:email
exports.getUserByEmail = async (req, res) => {

    const user = await User.findOne({ email: req.params.email })

    if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" })
    }

    res.json(user)
}

// POST /users
exports.createUser = async (req, res) => {

    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    })

    const savedUser = await newUser.save()

    res.status(201).json(savedUser)
}

// PUT /users/:email
exports.updateUser = async (req, res) => {

    const updatedUser = await User.findOneAndUpdate(
        { email: req.params.email },
        req.body,
        { new: true }
    )

    if (!updatedUser) {
        return res.status(404).json({ message: "Utilisateur non trouvé" })
    }

    res.json(updatedUser)
}

// DELETE /users/:email
exports.deleteUser = async (req, res) => {

    const deletedUser = await User.findOneAndDelete({
        email: req.params.email
    })

    if (!deletedUser) {
        return res.status(404).json({ message: "Utilisateur non trouvé" })
    }

    res.json({ message: "Utilisateur supprimé" })
}