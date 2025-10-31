import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyAppointments = () => {
  const { backendURL, token } = useContext(AppContext)
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/user/appointments`, {
        headers: { token },
      })
      if (data.success) {
        setAppointments(data.appointments.reverse())
        
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const cancleAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  const initPay = (order)=>{
const options = {
  key:import.meta.env.VITE_RAZORPAY_KEY_ID,
  amount:order.amount,
  currency:order.currency,
  name:'Appointment Payment',
  description:'Appointment Payment',
  order_id:order.id,
  receipt:order.receipt,
  handler:async(response)=>{
    console.log(response)

    try {
      const{data} = await axios.post(backendURL+'/api/user/verifyRazorpay',response,{headers:{token}})
      if(data.success){
        getUserAppointments()
        navigate('/my-appointments')
      }else{
        console.log(error)
        toast.error(error.message)
      }
    } catch (error) {
      
    }
  }
}
const rzp = new window.Razorpay(options)

rzp.open()

}
  



  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/payment-razorpay`,
        { appointmentId },
        { headers: { token } }
      )
      if (data.success) {
        initPay(data.order )
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      {/* Header */}
      <p className="pb-3 mt-12 sm:mt-8 font-semibold text-lg text-zinc-700 border-b">
        My Appointments
      </p>

      <div className="mt-6 space-y-6">
        {appointments.map((item, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-4 border rounded-xl shadow-sm bg-white hover:shadow-md transition-all"
          >
            {/* Doctor Image */}
            <div className="flex-shrink-0">
              <img
                className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-indigo-50 rounded-full object-cover"
                src={item.docData.image}
                alt={item.docData.name}
              />
            </div>

            {/* Doctor Info */}
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-base sm:text-lg text-neutral-800 font-medium">
                {item.docData.name}
              </p>
              <p className="text-sm sm:text-base">{item.docData.speciality}</p>

              <p className="text-zinc-700 font-medium mt-2">Address:</p>
              <p className="text-xs sm:text-sm">{item.docData.address.line1}</p>
              <p className="text-xs sm:text-sm">{item.docData.address.line2}</p>

              <p className="text-xs sm:text-sm mt-2">
                <span className="text-sm sm:text-base text-neutral-700 font-medium">
                  Date & Time:
                </span>{' '}
                {new Date(item.slotDate).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}{' '}
                | {item.SlotTime}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:flex-col mt-4 sm:mt-0">
              
              {!item.cancelled && item.payment &&<button className='px-3 py-2 sm:px-4 sm:py-2 bg-green-500 text-white rounded-lg text-xs sm:text-sm hover:bg-green-600 transition"'>Paid</button>}
              {!item.cancelled && !item.payment &&  
                <button
                  onClick={() => appointmentRazorpay(item._id)}
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-indigo-600 text-white rounded-lg text-xs sm:text-sm hover:bg-indigo-700 transition"
                >
                  Pay Online
                </button>
              }
              {!item.cancelled && 
                <button
                  onClick={() => cancleAppointment(item._id)}
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-red-500 text-white rounded-lg text-xs sm:text-sm hover:bg-red-600 transition"
                >
                  Cancel Appointment
                </button>
              }
              {item.cancelled && 
                <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                  Appointment Cancelled
                </button>
              }
              
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments
