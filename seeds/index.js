const mongoose = require('mongoose')
const cities = require('./cities')
const { names, images } = require('./seedHelpers')
const vaccineCenter = require('../models/vaccineCenter')

mongoose.connect('mongodb://localhost:27017/celp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database connected")
})

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await vaccineCenter.deleteMany({})
    for (let i = 0; i < 150; i++) {
        const place = sample(cities)
        const image = sample(images)
        const random = Math.random()
        const price = Math.floor(random * 20) + 10
        let vaccine = 'Pfizer'
        let service = 'Appointment'
        if (random < 0.33) {
            service = 'Walk-In'
            vaccine = 'Moderna'
        } else if (random < 0.66) {
            service = 'Both'
            vaccine = 'Johnson & Johnson'
        }

        const vc = new vaccineCenter({
            location: `${place.city}, ${place.state}`,
            name: `${sample(names)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            geometry: {
                type: "Point",
                coordinates: [
                    place.longitude,
                    place.latitude,
                ]
            },
            price,
            image,
            service,
            vaccine
        })
        console.log(vc)
        await vc.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})