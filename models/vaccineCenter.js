const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema

const vaccineCenterSchema = new Schema({
    name: String,
    description: String,
    image: String,
    price: Number,
    service: {
        type: String,
        enum: ['Walk-In', 'Appointment', 'Both']
    },
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

vaccineCenterSchema.post('findOneAndDelete', async function (document) {
    if (document) {
        await Review.deleteMany({
            _id: {
                $in: document.reviews
            }
        })
    }
})

module.exports = mongoose.model('VaccineCenter', vaccineCenterSchema)