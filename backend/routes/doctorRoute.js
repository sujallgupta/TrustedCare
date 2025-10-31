import express from 'express'
import { doctorList,loginDoctor,appointmentsDoctor,doctorDashboard, doctorProfile } from '../controllers/doctorController.js'
import authDoctor from '../middleware/authDoctor.js'

const doctorRouter=express.Router()

doctorRouter.get('/list',doctorList)
doctorRouter.post('/login',loginDoctor)
doctorRouter.get('/appointments',authDoctor,appointmentsDoctor)
doctorRouter.get('/dashboard',authDoctor,doctorDashboard)
doctorRouter.post('/doctor-profile',authDoctor,doctorProfile)
export default doctorRouter;