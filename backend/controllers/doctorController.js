import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

// Toggle doctor availability
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    if (!docId) {
      return res.status(400).json({ success: false, message: "Doctor ID is required" });
    }

    const updatedDoctor = await doctorModel.findByIdAndUpdate(
      docId,
      [{ $set: { available: { $not: "$available" } } }],
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    res.json({ success: true, message: "Doctor availability changed", doctor: updatedDoctor });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all doctors
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Api to Doctor login

const loginDoctor = async (req, res) => {


  try {
    
    const{email,password} = req.body;
  const doctor = await doctorModel.findOne({email})
 
    if(!doctor){
      return res.json({success:false,message:"Invalid Credentials"})
    
    }
    const isMatch = await bcrypt.compare(password,doctor.password)
    if(isMatch){

      const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET)
      res.json({success:true,message:"Login Successful",token})
    }else{
      res.json({success:false,message:"Invalid Credentials"})
    }

  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }

}

// Api to Get doctor appointments for doctor panel

const appointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};
//  API to get dashboard data for doctor panel
const doctorDashboard = async(req,res)=>{

  try {
    const{docId} = req.body

    const appointments = await appointmentModel.find({docId})

    let earnings = 0

    appointments.map(()=>{
    if(item.isCompleted || item.payment){
      earnings+=item.amount
    }
    })
   let patients = []
   appointments.map(()=>{
    if(!patients.includes(item.userId)){
      patients.push(item.userId)
    }
   })
   const dashData = {
    appointments:appointments.length,
    patients:patients.length,
    earnings:earnings,
    latestAppointments:appointments.reverse().slice(0,5)
   }
   res.json({success:true,dashData})

  } catch (error) {
     console.log("error:", error);
     res.json({ success: false, message: error.message });
  }
}

// Api to get Doctor Profile For DocPanel
const doctorProfile = async(req,res)=>{
  try {
    const {docId} = req.body
    const profileData = await doctorModel.findById(docId).select("-password")
    res.json({success:true,profileData})
  } catch (error) {
     console.log("error:", error);
     res.json({ success: false, message: error.message });
  
  }
}
export { changeAvailability, doctorList,loginDoctor,appointmentsDoctor,doctorDashboard,doctorProfile };
