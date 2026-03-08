const Catway = require('../models/Catway')

// GET /catways
exports.getAllCatways = async (req, res) => {
    try {
        const catways = await Catway.find()
        res.json(catways)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// GET /catways/:id
exports.getCatwayById = async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.id })

        if (!catway) {
            return res.status(404).json({ message: "Catway non trouvé" })
        }

        res.json(catway)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// POST /catways
exports.createCatway = async (req, res) => {
    try {

        const newCatway = new Catway({
            catwayNumber: req.body.catwayNumber,
            catwayType: req.body.catwayType,
            catwayState: req.body.catwayState
        })

        const savedCatway = await newCatway.save()

        res.status(201).json(savedCatway)

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// PUT /catways/:id
exports.updateCatway = async (req, res) => {
    try {

        const updatedCatway = await Catway.findOneAndUpdate(
            { catwayNumber: req.params.id },
            { catwayState: req.body.catwayState },
            { new: true }
        )

        if (!updatedCatway) {
            return res.status(404).json({ message: "Catway non trouvé" })
        }

        res.json(updatedCatway)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// DELETE /catways/:id
exports.deleteCatway = async (req, res) => {
    try {

        const deletedCatway = await Catway.findOneAndDelete({
            catwayNumber: req.params.id
        })

        if (!deletedCatway) {
            return res.status(404).json({ message: "Catway non trouvé" })
        }

        res.json({ message: "Catway supprimé" })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}