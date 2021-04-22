const mongoose=require('mongoose')
const cities=require('./cities')
const { places }=require('./seedHelpers')
const VaccineCenter=require('../models/VaccineCenter')
const Review=require('../models/review')

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
    await VaccineCenter.deleteMany({})
    for (let i=0; i<150; i++) {
        const images=['lyl2inhxzgbic16vtvby', 'qr917bhocfbgdfrubba6', 'zmaheuqq0gbnegwer0r8', 'yehthaqjac2wpn7saoqe',
            'oitrz5w0uooariniz25t', 'jz9fvijyixmx9smpybts', 'rd4ztygliamq69zbsod8', 'hufwm4bbsrqsg6rmmjty',
            'bjhldlo8ql6qprtsb2un', 'vchazvwvcymq4nqw7isc', 'oz2vwqvnedzv1iidpahs', 'tw6avugvxd3ne7kqepur']
        const random=Math.random()
        const random1000=Math.floor(random*1000)
        const price=Math.floor(random*20)+10
        const randomImage=images[Math.floor(Math.random()*12)]
        const rating=Math.floor(random*5)
        let service='Appointment'
        if (random<0.33) {
            service='Walk-In'
        } else if (random<0.66) {
            service='Both'
        }
        const review=new Review({
            body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In euismod facilisis tortor, in tristique orci auctor sed. Donec blandit faucibus leo sed volutpat. Suspendisse potenti. Cras dapibus vestibulum molestie. Fusce.',
            rating,
            service,
            author: '606142837b624a1f70272214'
        })
        await review.save()

        const vaccineCenter=new VaccineCenter({
            author: '606142837b624a1f70272214',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ultrices, mauris id consequat varius, nibh quam congue purus, eget dapibus ex nunc sit amet ipsum. Fusce at nisi sapien. Duis euismod eleifend metus, a ultricies ipsum lacinia pellentesque. Etiam fermentum nec ipsum ac congue. Suspendisse sed dui in massa volutpat.',
            price,
            service,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: `https://res.cloudinary.com/do9ny2l0e/image/upload/v1616987374/Celp/${randomImage}.jpg`,
                    filename: `Celp/${randomImage}`
                }
            ],
            reviews: [
                review._id
            ]
        })
        await vaccineCenter.save()

    }
}

seedDB().then(() => {
    mongoose.connection.close()
})