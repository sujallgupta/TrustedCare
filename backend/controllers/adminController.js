import validator from "validator";
import bcrypt from "bcryptjs";
import {v2 as cloudinary} from 'cloudinary';
import doctorModel from "../models/DoctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";




    // Api For Adding Doctor
    const addDoctor = async(req,res)=>{
    try{
     const {name,email,password,speciality,degree,experience,about,fees,address} = req.body;
     const imageFile = req.file;
   
    //  checking For all data to add doctor
    if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
        return res.json ({success:false,message:"Missing Details"})
    }

    // validating email format
    if (!validator.isEmail(email)){
    return res.json ({success:false,message:"Please enter A Valid Email"})
    }

    // Validating Strong Password
    if(password.length<8){
         return res.json ({success:false,message:"Please enter A strong password"})
    }
    
    // Hashing Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

     // Upload Image To Cloudinary
    const imageUploaded = await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"})
    const imageUrl = imageUploaded.secure_url;

    const doctorData = {
    name,
    email,
    password:hashedPassword,
    image:imageUrl,
    speciality,
    degree,
    experience,
    about,
    fees,
    address:JSON.parse(address),
    date:new Date().getDate()
    }
const newDoctor = new  doctorModel(doctorData)
await newDoctor.save()

res.json({success:true,message:"Doctor Added Successfully"})
    
}catch(error){
console.log(error)
res.json({success:false,message:error.message})
    }
}
// Api for Admin Login
const loginAdmin = async (req,res)=>{
try{
    const {email,password} = req.body;
    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
    const token = jwt.sign(email+password,process.env.JWT_SECRET)
    res.json({success:true,message:"Login Successful",token})
        }else{
            return res.json({success:false,message:"Invalid Credentials"})  
        }

}catch (error){
console.log(error)
res.json({success:false,message:error.message})
}
}
// Api TO get All Doctors For Admin Dashboard
const allDoctors = async (req,res)=>{
try{
    const doctors = await doctorModel.find({}).select("-password")
    res.json({success:true,doctors})

}catch (error){
console.log(error)
res.json({success:false,message:error.message})
}
}
// Api to get all appointment list
const appointmentsAdmin = async (req,res)=>{
try {
    const appointments = await appointmentModel.find({})
    res.json({success:true,appointments})
} catch (error) {
    console.log(error)
res.json({success:false,message:error.message})
console.log(error)
}
}

//Api to get dashboard data for admin panel
const adminDashboard = async (req,res)=>{
try {
    const doctors = await doctorModel.find({})
    const users = await userModel.find({})
    const appointments = await appointmentModel.find({})

    const dashData = {
        doctors:doctors.length,
        patients:users.length,
        appointments:appointments.length,
        latestAppointments:appointments.reverse().slice(0,5)
    }
        res.json({success:true,dashData})

    

} catch (error) {
    res.json({success:false,message:error.message})
console.log(error)
}
}


export {addDoctor,loginAdmin,allDoctors,appointmentsAdmin,adminDashboard}