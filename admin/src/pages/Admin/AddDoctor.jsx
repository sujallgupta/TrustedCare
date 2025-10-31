import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddDoctor = () => {

  const [docimg,setDocImg ] = useState(false)
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [experience,setExperience] = useState('1 Year')
  const [fees,setFees] = useState('')
  const [speciality,setSpeciality] = useState('General Physician')
  const [address1,setAddress1] = useState('')
   const [address2,setAddress2] = useState('')
  const [about,setAbout] = useState('')
const [degree,setDegree] = useState('')

const{backendUrl,aToken} = useContext (AdminContext)

const onSubmitHandler = async(event)=>{
  event.preventDefault()
  try {
    if(!docimg){
 return toast.error('Doctor Image is required')
    }

    const formData = new FormData()
    formData.append('image',docimg)
    formData.append('name',name)
    formData.append('email',email)
    formData.append('password',password)
    formData.append('experience',experience)
    formData.append('fees',Number(fees))
    formData.append('speciality',speciality)
    formData.append('address',JSON.stringify({line1:address1,line2:address2}))
    formData.append('about',about)
    formData.append('degree',degree)

    //console log data
    formData.forEach((value,key)=>{
      console.log(`${key}:${value}`)
    })

   const {data} = await axios.post(backendUrl + 'api/admin/add-doctor',formData,{headers:{aToken}})
   if(data.success){
    toast.success(data.message)
    setDocImg(false)
    setName('')
    setEmail('')
    setPassword('')
    setExperience('1 Year')
    setFees('')
    setSpeciality('General Physician')
    setAddress1('')
     setAddress2('')
    setAbout('')
   setDegree('')
   }else{
    toast.error(data.message)
   }
  }catch(error){
   toast.error(error.message)
   
  }
 
}


  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-10 px-4">
      <form onSubmit={onSubmitHandler} className="w-full max-w-6xl bg-white shadow-xl rounded-lg p-8 space-y-8 overflow-y-auto max-h-[90vh]">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Add New Doctor</h2>
          <p className="text-gray-500 mt-1">Fill out the form below to add a doctor to the system</p>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-5">
            {/* Upload Image */}
            <div className="flex items-center gap-4">
              <label htmlFor="doc-img" className="cursor-pointer">
                <img src={docimg ? URL.createObjectURL(docimg) : assets.upload_area} alt="Upload" className="w-24 h-24 object-cover rounded-md border" />
              </label>
              <div>
                <input onChange={(e)=>setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
                <p className="text-gray-600 text-sm">Click to upload doctor's image</p>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Doctor Name</label>
              <input onChange={(e)=>setName(e.target.value)} value={name} type="text" placeholder="Enter Name" required className="input-field" />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder="Enter Email" required className="input-field" />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" placeholder="Enter Password" required className="input-field" />
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium mb-1">Experience</label>
              <select onChange={(e)=>setExperience(e.target.value)} value={experience} required className="input-field">
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={`${i + 1} Year`}>{i + 1} Year</option>
                ))}
                <option value="10+ Year">10+ Years</option>
              </select>
            </div>

            {/* Fees */}
            <div>
              <label className="block text-sm font-medium mb-1">Consultation Fees</label>
              <input onChange={(e)=>setFees(e.target.value)} value={fees} type="number" placeholder="Enter Fees" required className="input-field" />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            {/* Speciality */}
            <div>
              <label className="block text-sm font-medium mb-1">Speciality</label>
              <select onChange={(e)=>setSpeciality(e.target.value)} value={speciality} required className="input-field">
                <option value="General Physician">General Physician</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Pediatricians">Pediatricians</option>
              </select>
            </div>

            {/* Education */}
            <div>
              <label className="block text-sm font-medium mb-1">Education</label>
              <input onChange={(e)=>setDegree(e.target.value)} value={degree} type="text" placeholder="Enter Education" required className="input-field" />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input onChange={(e)=>setAddress1(e.target.value)} value={address1} type="text" placeholder="Address Line 1" required className="input-field mb-2" />
              <input onChange={(e)=>setAddress2(e.target.value)} value={address2} type="text" placeholder="Address Line 2" required className="input-field" />
            </div>

            {/* About */}
            <div>
              <label className="block text-sm font-medium mb-1">About Doctor</label>
              <textarea onChange={(e)=>setAbout(e.target.value)} value={about} rows={5} placeholder="Write about doctor..." required className="w-full px-4 pt-2 border rounded" />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center pt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium transition"
          >
            Add Doctor
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;
