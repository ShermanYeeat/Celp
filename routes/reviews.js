const express = require('express')
const router = express.Router({ mergeParams: true })

const vaccineCenter = require('../models/vaccineCenter')
const Review = require('../models/review')

const { reviewSchema } = require('../schemas.js')


const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(ele => ele.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}



router.post('/', validateReview, catchAsync(async (req, res) => {
    const vc = await vaccineCenter.findById(req.params.id)
    const review = new Review(req.body.review)
    vc.reviews.push(review)
    await review.save()
    await vc.save()
    req.flash('success', 'Created new review!')
    res.redirect(`/vaccineCenters/${vc._id}`)
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params
    await vaccineCenter.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully deleted review.')
    res.redirect(`/vaccineCenters/${id}`)
}))

module.exports = router