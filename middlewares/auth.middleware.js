const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {

    const token = req.cookies?.token

    if (!token) {
        return res.status(401).json({ message: "Accès refusé. Token manquant." })
    }

    try {

        const decoded = jwt.verify(token, "SECRET_KEY")

        req.user = decoded

        next()

    } catch (error) {

        return res.status(401).json({ message: "Token invalide." })

    }

}

module.exports = authMiddleware