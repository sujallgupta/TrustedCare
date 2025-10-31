import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import razorpay from "razorpay";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

// =====================
// Register User
// =====================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Please fill all the fields" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    if (!validator.isStrongPassword(password)) {
      return res.json({
        success: false,
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, message: "User registered successfully", token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Server error" });
  }
};

// =====================
// Login User
// =====================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Server error" });
  }
};

// =====================
// Get Profile
// =====================
const getProfile = async (req, res) => {
  try {
    const userData = await userModel.findById(req.userId).select("-password");
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, userData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// =====================
// Update Profile
// =====================
const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Please fill all the fields" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    user.name = name;
    user.phone = phone;
    user.dob = dob;
    user.gender = gender;
    if (address) user.address = address;

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
      user.image = imageUpload.secure_url;
    }

    await user.save();
    res.json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// =====================
// Book Appointment
// =====================
const bookAppointment = async (req, res) => {
  try {
    const { docId, slotTime, slotDate } = req.body;
    const userId = req.userId;

    if (!docId || !slotTime || !slotDate || !userId) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // Convert date string 
    const [day, month, year] = slotDate.split("-");
    const appointmentDate = new Date(year, month - 1, day);

    const userData = await userModel.findById(userId).select("-password");
    const docData = await doctorModel.findById(docId);

    if (!userData || !docData) {
      return res.json({ success: false, message: "User or Doctor not found" });
    }

    // Initialize slots_booked
    if (!docData.slots_booked) docData.slots_booked = {};
    if (!docData.slots_booked[slotDate]) docData.slots_booked[slotDate] = [];

    // Check if slot is already booked
    if (docData.slots_booked[slotDate].includes(slotTime)) {
      return res.json({ success: false, message: "This slot is already booked" });
    }

    // Block slot
    docData.slots_booked[slotDate].push(slotTime);
    await docData.save();

    // Save appointment
    const appointmentData = {
      userId,
      docId,
      slotDate: appointmentDate,
      SlotTime: slotTime,
      userData,
      docData,
      amount: docData.fees,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    res.json({ success: true, message: "Appointment booked successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// =====================
// List User Appointments
// =====================
const listAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const appointments = await appointmentModel.find({ userId }).sort({ date: -1 });

    res.json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// =====================
// Cancel Appointment
// =====================
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.userId;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    if (appointmentData.userId.toString() !== userId) {
      return res.json({ success: false, message: "Not authorized to cancel this appointment" });
    }

    // Mark as cancelled
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    // Release doctor's slot
    const { docId, slotDate, SlotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);

    if (doctorData && doctorData.slots_booked[slotDate]) {
      doctorData.slots_booked[slotDate] = doctorData.slots_booked[slotDate].filter(
        (e) => e !== SlotTime
      );
      await doctorModel.findByIdAndUpdate(docId, { slots_booked: doctorData.slots_booked });
    }

    res.json({ success: true, message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// =====================
// Razorpay Payment
// =====================
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// API to make payment of Appointment using Razorpay
const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // Creating option for Razorpay payment
    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentData._id.toString(),
    };

    // Creation of an order
    const order = await razorpayInstance.orders.create(options);
    res.json({ success: true, order });
 
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


// Api to verify payment
const verifyRazorpay = async (req, res) => {
try{
  const{razorpay_order_id} = req.body
  const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
  
  if(orderInfo.status === 'paid'){
   await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
   res.json({success:true,message:'Payment Successful'})
  }else{
    res.json({success:false,message:'Payment Failed'}) 
  }
}catch{
console.error(error);
res.json({ success: false, message: error.message });
}
}


export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay,
};
