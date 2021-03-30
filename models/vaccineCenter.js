const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema
const opts = { toJSON: { virtuals: true } }

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
    ],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
}, opts)

vaccineCenterSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/vaccineCenters/${this._id}">${this.name}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
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