const mongoose=require('mongoose')
const cities=require('./cities')
const { places, images }=require('./seedHelpers')
const vaccineCenter=require('../models/vaccineCenter')

mongoose.connect('mongodb://localhost:27017/celp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db=mongoose.connection

db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database connected")
})

const sample=array => array[Math.floor(Math.random()*array.length)]

const seedDB=async () => {
    await vaccineCenter.deleteMany({})
    for (let i=0; i<150; i++) {
        const random=Math.random()
        const random1000=Math.floor(random*1000)
        const price=Math.floor(random*20)+10
        let service='Appointment'
        if (random<0.33) {
            service='Walk-In'
        } else if (random<0.66) {
            service='Both'
        }
        image=images[Math.floor(random*images.length)]
        const vc=new vaccineCenter({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            name: `${sample(places)}`,
            image,
            service,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
        })
        await vc.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})