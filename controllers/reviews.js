const VaccineCenter=require('../models/VaccineCenter')
const Review=require('../models/review')

module.exports.createReview=async (req, res) => {
    const vaccineCenter=await VaccineCenter.findById(req.params.id)
    const review=new Review(req.body.review)
    review.author=req.user._id
    vaccineCenter.reviews.push(review)
    await review.save()
    await vaccineCenter.save()
    req.flash('success', 'Created new review!')
    res.redirect(`/VaccineCenters/${vaccineCenter._id}`)
}

module.exports.deleteReview=async (req, res) => {
    const { id, reviewId }=req.params
    await VaccineCenter.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/VaccineCenters/${id}`)
}
