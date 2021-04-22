const express=require('express')
const router=express.Router()
const VaccineCenters=require('../controllers/VaccineCenters')
const catchAsync=require('../utils/catchAsync')
const { isLoggedIn, isAuthor, validateVaccineCenter }=require('../middleware')
const multer=require('multer')
const { storage }=require('../cloudinary')
const upload=multer({ storage })

router.route('/')
    .get(catchAsync(VaccineCenters.index))
    .post(isLoggedIn, upload.array('image'), validateVaccineCenter, catchAsync(VaccineCenters.createVaccineCenter))

router.get('/new', isLoggedIn, VaccineCenters.renderNewForm)

router.route('/:id')
    .get(catchAsync(VaccineCenters.showVaccineCenter))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateVaccineCenter, catchAsync(VaccineCenters.updateVaccineCenter))
    .delete(isLoggedIn, isAuthor, catchAsync(VaccineCenters.deleteVaccineCenter))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(VaccineCenters.renderEditForm))

module.exports=router