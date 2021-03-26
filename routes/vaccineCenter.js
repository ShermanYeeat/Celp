const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { vaccineCenterSchema } = require('../schemas.js')

const ExpressError = require('../utils/ExpressError');
const vaccineCenter = require('../models/vaccineCenter')

const validateVaccineCenter = (req, res, next) => {
    console.log(req.body)
    const { error } = vaccineCenterSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(ele => ele.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const vcs = await vaccineCenter.find({});
    res.render('vaccineCenters/index', { vcs })
}));

router.get('/new', (req, res) => {
    res.render('vaccineCenters/new');
})


router.post('/', validateVaccineCenter, catchAsync(async (req, res, next) => {
    // if (!req.body.vaccineCenter) throw new ExpressError('Invalid vaccineCenter Data', 400);
    console.log(req.body.vaccineCenter)
    const vc = new vaccineCenter(req.body.vaccineCenter);
    await vc.save();
    req.flash('success', 'Successfully uploaded a new Vaccine Center!');
    res.redirect(`/vaccineCenters/${vc._id}`)
}))

router.get('/:id', catchAsync(async (req, res,) => {
    const vc = await vaccineCenter.findById(req.params.id).populate('reviews');
    if (!vc) {
        req.flash('error', 'Cannot find that vaccineCenter!');
        return res.redirect('/vaccineCenters');
    }
    res.render('vaccineCenters/show', { vc });
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const vc = await vaccineCenter.findById(req.params.id)
    if (!vc) {
        req.flash('error', 'Cannot find that Vaccine Center!');
        return res.redirect('/vaccineCenters');
    }
    res.render('vaccineCenters/edit', { vc });
}))

router.put('/:id', validateVaccineCenter, catchAsync(async (req, res) => {
    const { id } = req.params;
    const vc = await vaccineCenter.findByIdAndUpdate(id, { ...req.body.vaccineCenter });
    req.flash('success', 'Successfully updated Vaccine Center!');
    res.redirect(`/vaccineCenters/${vc._id}`)
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await vaccineCenter.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Vaccine Center.')
    res.redirect('/vaccineCenters');
}));

module.exports = router;