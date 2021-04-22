const VaccineCenter = require('../models/VaccineCenter')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })
const { cloudinary } = require("../cloudinary")


module.exports.index = async (req, res) => {
    const vaccineCenters = await VaccineCenter.find({}).populate('popupText')
    res.render('VaccineCenters/index', { vaccineCenters })
}

module.exports.renderNewForm = (req, res) => {
    res.render('VaccineCenters/new')
}

module.exports.createVaccineCenter = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.VaccineCenter.location,
        limit: 1
    }).send()
    const vaccineCenter = new VaccineCenter(req.body.VaccineCenter)
    vaccineCenter.geometry = geoData.body.features[0].geometry
    vaccineCenter.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    vaccineCenter.author = req.user._id
    await vaccineCenter.save()
    console.log(vaccineCenter)
    req.flash('success', 'Successfully made a new Vaccine Center!')
    res.redirect(`/VaccineCenters/${vaccineCenter._id}`)
}

module.exports.showVaccineCenter = async (req, res,) => {
    const vaccineCenter = await VaccineCenter.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if (!vaccineCenter) {
        req.flash('error', 'Cannot find that Vaccine Center!')
        return res.redirect('/VaccineCenters')
    }
    res.render('VaccineCenters/show', { vaccineCenter })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params
    const vaccineCenter = await VaccineCenter.findById(id)
    if (!vaccineCenter) {
        req.flash('error', 'Cannot find that Vaccine Center!')
        return res.redirect('/VaccineCenters')
    }
    res.render('VaccineCenters/edit', { vaccineCenter })
}

module.exports.updateVaccineCenter = async (req, res) => {
    const { id } = req.params
    console.log(req.body)
    const vaccineCenter = await VaccineCenter.findByIdAndUpdate(id, { ...req.body.VaccineCenter })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    vaccineCenter.images.push(...imgs)
    await vaccineCenter.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await vaccineCenter.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated Vaccine Center!')
    res.redirect(`/VaccineCenters/${vaccineCenter._id}`)
}

module.exports.deleteVaccineCenter = async (req, res) => {
    const { id } = req.params
    await vaccineCenter.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted Vaccine Center!')
    res.redirect('/VaccineCenters')
}