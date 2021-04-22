const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    service: {
        type: String,
        enum: ['Walk-In', 'Appointment', 'Both']
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model("Review", reviewSchema)

