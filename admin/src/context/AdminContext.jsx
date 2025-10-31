import { createContext, useState } from "react";
import axios from 'axios'
import{toast} from 'react-toastify'
import { use } from "react";

export const AdminContext = createContext()

const AdminContextProvider = (props)=>{

   
    const [aToken,setAToken]= useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'')
    const [doctors,setDoctors]= useState([])
    const[appointments,setAppointments] = useState([])
    const[dashData,SetDashData] = useState(false)
 const backendUrl = import.meta.env.VITE_BACKEND_URL


 const getAllDoctors = async()=>{
    try{
const{data}= await axios.post(backendUrl + 'api/admin/all-doctors',{},{headers:{aToken}})
if(data.success){
    setDoctors(data.doctors)
    
}else{
   toast.error(data.message)
    console.log(data.message)
    
}

    }catch(error){
        console.log(error.message)
    }

 }

const changeAvailability = async(docId)=>{
    try{
   const {data} = await axios.post(backendUrl + 'api/admin/change-availability',{docId},{headers:{aToken}})
    if(data.success){
        toast.success(data.message)
        getAllDoctors()
    }else{
        toast.error(data.message)
    }
    } 
    catch(error){
        toast.error(error.message)
        console.log(error)
    }}

    const getAllAppointments = async ()=>{

        try {
            const{data} = await axios.get(backendUrl+'api/admin/appointments',{headers:{aToken}})

            if(data.success){
                setAppointments(data.appointments)
                
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
const cancelAppointment = async(appointmentId)=>{
    try {
        const{data} = await axios.post(backendUrl+'api/admin/cancel-appointment',{appointmentId},{headers:{aToken}})
        if(data.success){
            toast.success(data.message)
            getAllAppointments()
        }
    }catch{
        toast.error(error.message)
    }
    }

  const getDashData = async()=>{
    try {
        const {data}= await axios.get(backendUrl+'api/admin/dashboard',{headers:{aToken}})
        if(data.success){
        SetDashData(data.dashData)
        
        }else{
            toast.error(data.message)
        
        }
    } catch (error) {
         toast.error(error.message)
    }
  }

   const value = {
   aToken,setAToken,
   backendUrl,doctors,getAllDoctors,changeAvailability,
   appointments,setAppointments,getAllAppointments,
   cancelAppointment,dashData,getDashData
   }

return(
    <AdminContext.Provider value={value}>
        {props.children}
    </AdminContext.Provider>
)
}

export default AdminContextProvider
