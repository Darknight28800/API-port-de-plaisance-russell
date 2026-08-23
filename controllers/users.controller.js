const userService = require('../services/user.service')

/** GET /users — liste tous les utilisateurs. */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.list()
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

/** GET /users/:email — détails d'un utilisateur. */
exports.getUserByEmail = async (req, res) => {
    try {
        const user = await userService.getByEmail(req.params.email)

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' })
        }

        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

/** POST /users — crée un utilisateur. */
exports.createUser = async (req, res) => {
    try {
        const user = await userService.create(req.body)
        res.status(201).json(user)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

/** PUT /users/:email — modifie un utilisateur. */
exports.updateUser = async (req, res) => {
    try {
        const user = await userService.update(req.params.email, req.body)

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' })
        }

        res.json(user)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

/** DELETE /users/:email — supprime un utilisateur. */
exports.deleteUser = async (req, res) => {
    try {
        const user = await userService.remove(req.params.email)

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' })
        }

        res.json({ message: 'Utilisateur supprimé' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
