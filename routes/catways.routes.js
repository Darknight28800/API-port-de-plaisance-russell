const express = require('express')
const router = express.Router()

const Catway = require('../models/Catway')

/* LISTE CATWAYS */

router.get('/', async (req, res) => {

    const catways = await Catway.find()

    res.render('catways/list', {
        catways: catways
    })

})

/* PAGE CREATION */

router.get('/create', (req, res) => {

    res.render('catways/create')

})

/* CREER CATWAY */

router.post('/create', async (req, res) => {

    const { catwayNumber, catwayType, catwayState } = req.body

    const newCatway = new Catway({
        catwayNumber,
        catwayType,
        catwayState
    })

    await newCatway.save()

    res.redirect('/catways')

})

/* PAGE MODIFIER */

router.get('/edit/:id', async (req, res) => {

    const catway = await Catway.findOne({ catwayNumber: req.params.id })

    res.render('catways/edit', {
        catway: catway
    })

})

/* MODIFIER */

router.post('/edit/:id', async (req, res) => {

    await Catway.updateOne(
        { catwayNumber: req.params.id },
        { catwayState: req.body.catwayState }
    )

    res.redirect('/catways')

})

/* SUPPRIMER */

router.post('/delete/:id', async (req, res) => {

    await Catway.deleteOne({ catwayNumber: req.params.id })

    res.redirect('/catways')

})

module.exports = router