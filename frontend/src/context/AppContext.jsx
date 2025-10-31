import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const AppContext = createContext()

const AppContextProvider = (props)=>{

const currencySymbol='$'
const backendURL=import.meta.env.VITE_BACKEND_URL
const[doctors,setDoctors] = useState([])

const [token,setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):false)

const[userData,setUserData] = useState(false)

const getDoctorsData = async()=>{
   try{
      const {data} = await axios.get(backendURL+'/api/doctor/list')
      if(data?.success){
            setDoctors(data.doctors)
            // toast.success(data.message)
      }
   }catch(error){
      console.error("Error fetching doctors data:", error)
      toast.error(error.message)
   }
}
useEffect(()=>{
   getDoctorsData()
},[])

const loadUserProfileData = async()=>{
   try{
      const {data} = await axios.get(backendURL+'/api/user/get-profile',{headers:{token}})
      if(data.success){
         setUserData(data.userData)
      }else{
         toast.error(data.message)
      }
   }catch(error){
      console.error("Error fetching user data:", error)
      toast.error(error.message)
   }
}
useEffect(()=>{
   if(token){
   loadUserProfileData()
}else{
   setUserData(false)
}
},[token])

   const value = {
   doctors,getDoctorsData,currencySymbol,token,setToken,backendURL,userData,setUserData,loadUserProfileData
   }
   
  

return(
    <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
)
}

export default AppContextProvider