const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reviewSchema = new Schema({
    description: String,
    rating: Number,
    service: {
        type: String,
        enum: ['Walk-In', 'Appointment', 'Both']
    }
})

module.exports = mongoose.model("Review", reviewSchema)

