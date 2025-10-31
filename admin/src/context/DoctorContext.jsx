import { useState, useEffect, createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // ✅ Consistent variable name + load from localStorage
  const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");
  const [appointments, setAppointments] = useState([]);
  const [dashData,setDashData] = useState(false)
  // ✅ Automatically update localStorage whenever token changes
  useEffect(() => {
    if (dToken) {
      localStorage.setItem("dToken", dToken);
    } else {
      localStorage.removeItem("dToken");
    }
  }, [dToken]);

  // ✅ Fetch appointments with proper token header
  const getAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendURL}api/doctor/appointments`, 
       {headers:{dToken}})

      if (data.success) {
        setAppointments(data.appointments.reverse());
        
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };
const getDashData = async()=>{
  try {
    
    const{data} = await axios.get(backendURL+'api/doctor/dashboard',{headers:{dToken}})
    if(data.success){
      setDashData(data.dashData)
      
    }else{
      toast.error(data.message)
    }
  } catch (error) {
    console.error(error);
      toast.error(error.message);
  }
}
  const value = {
    dToken,
    setDToken,
    backendURL,
    appointments,
    setAppointments,
    getAppointments,
    dashData,setDashData,getDashData
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
