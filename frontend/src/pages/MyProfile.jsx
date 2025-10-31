import React, { useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'

const MyProfile = () => {
  const{userData,setUserData,token,backendURL,loadUserProfileData}=useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)
 const [image,setImage]=useState(false)

 const updateUserProfileData = async()=>{
  try {
    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('phone', userData.phone);
    formData.append('dob', userData.dob);
    formData.append('gender', userData.gender);
    
    image && formData.append('image', image);

    const {data} = await axios.post(backendURL+'/api/user/update-profile', formData, {headers:{token}})
  if(data.success){
    toast.success(data.message)
    await loadUserProfileData()
    setIsEdit(false)
    setImage(false)
  }else{
    toast.error(data.message)
  }
  }catch (error) {
    console.error("Error updating profile:", error);
    toast.error(error.message);
  }}
  return userData && (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl">
        {
          isEdit 
          ?<label htmlFor="image">
        <div className='inline-block relative cursor-pointer'>
          <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image) : userData.image} alt="" />
          <img className='w-10 absolute bottom right'  src={ image ? ''  :assets.upload_icon} alt="" />
        </div>
        <input onChange={(e)=>setImage(e.target.files[0])} type="file" id="image" hidden/>
          </label>
          : <img 
            src={userData.image} 
            alt="profile" 
            className="w-28 h-28 rounded-full border-4 border-blue-500 object-cover shadow-md"
          />
        }
        {/* Profile Image & Name */}
        <div className="flex flex-col items-center">
         
          {isEdit ? (
            <input 
              type="text" 
              onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))} 
              value={userData.name} 
              className="mt-4 text-center text-lg font-semibold border-b-2 border-blue-400 focus:outline-none"
            />
          ) : (
            <p className="mt-4 text-xl font-bold text-gray-800">{userData.name}</p>
          )}
        </div>

        <hr className="my-6 border-gray-300" />

        {/* Contact Information */}
        <div>
          <h2 className="text-lg font-semibold text-blue-600 mb-2">Contact Information</h2>
          <div className="space-y-3 text-gray-700">
            <div>
              <p className="font-medium">Email:</p>
              <p>{userData.email}</p>
            </div>
            <div>
              <p className="font-medium">Phone:</p>
              {isEdit ? (
                <input 
                  type="text" 
                  onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))} 
                  value={userData.phone}
                  className="border rounded-md px-2 py-1 w-full focus:outline-blue-500"
                />
              ) : (
                <p>{userData.phone}</p>
              )}
            </div>
        
          </div>
        </div>

        <hr className="my-6 border-gray-300" />

        {/* Basic Information */}
        <div>
          <h2 className="text-lg font-semibold text-blue-600 mb-2">Basic Information</h2>
          <div className="space-y-3 text-gray-700">
            <div>
              <p className="font-medium">Gender:</p>
              {isEdit ? (
                <select 
                  onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} 
                  value={userData.gender}
                  className="border rounded-md px-2 py-1 focus:outline-blue-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : (
                <p>{userData.gender}</p>
              )}
            </div>
            <div>
              <p className="font-medium">Birthday:</p>
              {isEdit ? (
                <input 
                  type="date" 
                  onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} 
                  value={userData.dob}
                  className="border rounded-md px-2 py-1 focus:outline-blue-500"
                />
              ) : (
                <p>{userData.dob}</p>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-center">
          {isEdit ? (
            <button 
              onClick={updateUserProfileData} 
              className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition"
            >
              Save Information
            </button>
          ) : (
            <button 
              onClick={() => setIsEdit(true)} 
              className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyProfile
