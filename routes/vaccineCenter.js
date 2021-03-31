const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const { vaccineCenterSchema } = require('../schemas.js')
const ExpressError = require('../utils/ExpressError')
const vaccineCenter = require('../models/vaccineCenter')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })

// Middleware to validate the creation of a vaccine center to make sure that inputs are appropriate
const validateVaccineCenter = (req, res, next) => {
    console.log(req.body)
    const { error } = vaccineCenterSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(ele => ele.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

// Show all vaccine centers; index page
router.get('/', catchAsync(async (req, res) => {
    const vcs = await vaccineCenter.find({})
    res.render('vaccineCenters/index', { vcs })
}))

// Forward to new vaccine center registration
router.get('/new', (req, res) => {
    res.render('vaccineCenters/new')
})

// Create new vaccine center
router.post('/', validateVaccineCenter, catchAsync(async (req, res, next) => {
    // if (!req.body.vaccineCenter) throw new ExpressError('Invalid Vaccine Center Data', 400)
    const geoData = await geocoder.forwardGeocode({
        query: req.body.vaccineCenter.location,
        limit: 1
    }).send()
    const vc = new vaccineCenter(req.body.vaccineCenter)
    // console.log(geoData.body.features[0])
    vc.geometry = geoData.body.features[0].geometry
    await vc.save()
    req.flash('success', 'Successfully uploaded a new Vaccine Center!')
    res.redirect(`/vaccineCenters/${vc._id}`)
}))


// Show specific vaccine center; show page
router.get('/:id', catchAsync(async (req, res,) => {
    const vc = await vaccineCenter.findById(req.params.id).populate('reviews')
    if (!vc) {
        req.flash('error', 'Cannot find that Vaccine Center!')
        return res.redirect('/vaccineCenters')
    }
    res.render('vaccineCenters/show', { vc })
}))

// Forward to edit vaccine center
router.get('/:id/edit', catchAsync(async (req, res) => {
    const vc = await vaccineCenter.findById(req.params.id)
    if (!vc) {
        req.flash('error', 'Cannot find that Vaccine Center!')
        return res.redirect('/vaccineCenters')
    }
    res.render('vaccineCenters/edit', { vc })
}))

// Update vaccine center
router.put('/:id', validateVaccineCenter, catchAsync(async (req, res) => {
    const { id } = req.params
    const vc = await vaccineCenter.findByIdAndUpdate(id, { ...req.body.vaccineCenter })
    req.flash('success', 'Successfully updated Vaccine Center!')
    res.redirect(`/vaccineCenters/${vc._id}`)
}))

// Delete vaccine center
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    await vaccineCenter.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted Vaccine Center.')
    res.redirect('/vaccineCenters')
}))

module.exports = router