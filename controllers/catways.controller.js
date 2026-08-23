const catwayService = require('../services/catway.service')

/** GET /catways — liste tous les catways. */
exports.getAllCatways = async (req, res) => {
    try {
        const catways = await catwayService.list()
        res.json(catways)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

/** GET /catways/:id — détails d'un catway. */
exports.getCatwayById = async (req, res) => {
    try {
        const catway = await catwayService.getByNumber(req.params.id)

        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' })
        }

        res.json(catway)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

/** POST /catways — crée un catway. */
exports.createCatway = async (req, res) => {
    try {
        const catway = await catwayService.create(req.body)
        res.status(201).json(catway)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

/** PUT /catways/:id — modifie l'état d'un catway (numéro et type non modifiables). */
exports.updateCatway = async (req, res) => {
    try {
        const catway = await catwayService.updateState(req.params.id, req.body.catwayState)

        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' })
        }

        res.json(catway)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

/** DELETE /catways/:id — supprime un catway. */
exports.deleteCatway = async (req, res) => {
    try {
        const catway = await catwayService.remove(req.params.id)

        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' })
        }

        res.json({ message: 'Catway supprimé' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
