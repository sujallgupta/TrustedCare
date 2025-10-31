import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { toast } from "react-toastify";

const DoctorAppointment = () => {
  const { dtoken, getAppointments } = useContext(DoctorContext);
  const [appointments, setAppointments] = useState([]);


  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const ageDiff = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };


  const slotDateFormat = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

//  sample data
  const sampleData = [
    {
      _id: "1",
      userData: { name: "Arjun Mehta", dob: "1990-12-10" },
      payment: true,
      slotDate: "2025-10-30",
      slotTime: "9:00 AM",
      amount: 450,
      cancelled: false,
      isCompleted: false,
      
    },
    {
      _id: "2",
      userData: { name: "Sujal Gupta", dob: "2002-05-15" },
      payment: true,
      slotDate: "2025-10-31",
      slotTime: "10:00 AM",
      amount: 500,
      cancelled: false,
      isCompleted: false,
    },
    {
      _id: "3",
      userData: { name: "Riya Sharma", dob: "1998-08-22" },
      payment: false,
      slotDate: "2025-11-01",
      slotTime: "2:30 PM",
      amount: 600,
      cancelled: false,
      isCompleted: false,
    },
    {
      _id: "4",
      userData: { name: "Neha Verma", dob: "1985-07-19" },
      payment: true,
      slotDate: "2025-11-02",
      slotTime: "1:00 PM",
      amount: 700,
      cancelled: false,
      isCompleted: false,
    },
    {
      _id: "5",
      userData: { name: "Rohan Das", dob: "1999-03-25" },
      payment: false,
      slotDate: "2025-11-03",
      slotTime: "5:00 PM",
      amount: 550,
      cancelled: false,
      isCompleted: false,
    },
  ];

  
  useEffect(() => {
    if (dtoken) {
      getAppointments();
      console.log("Appointments fetched from backend");
    } else {
      setAppointments(sampleData);
    }
  }, [dtoken]);

  // Actions
  const cancelAppointment = (id) =>
    setAppointments((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, cancelled: true } : item
      )
    );

  const completeAppointment = (id) =>
    setAppointments((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, isCompleted: true } : item
      )
    );

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-4 text-2xl font-semibold text-gray-800">
        🩺 All Appointments
      </p>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-md text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll transition-all duration-300">
        {/* Header */}
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-4 px-6 border-b font-semibold bg-gray-100 text-gray-700">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fee</p>
          <p>Action</p>
        </div>

        {/* Appointment Rows */}
        {appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div
              key={index}
              className={`transition-all duration-200 hover:scale-[1.01] hover:bg-gray-50 sm:grid sm:grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] items-center py-4 px-6 border-b ${
                item.cancelled
                  ? "bg-red-50"
                  : item.isCompleted
                  ? "bg-green-50"
                  : "bg-white"
              }`}
            >
              <p className="font-medium text-gray-600">{index + 1}</p>
              <p className="font-medium text-gray-700">{item.userData.name}</p>

              <p
                className={`text-xs text-center px-2 py-1 rounded-full font-semibold ${
                  item.payment
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                }`}
              >
                {item.payment ? "Online" : "Cash"}
              </p>

              <p className="text-gray-600 text-center">{calculateAge(item.userData.dob)}</p>

              <p className="text-gray-600">
                {slotDateFormat(item.slotDate)},{" "}
                <span className="font-medium">{item.slotTime}</span>
              </p>

              <p className="font-semibold text-gray-700">₹{item.amount}</p>

              {item.cancelled ? (
                <p className="text-red-500 text-xs font-semibold">Cancelled</p>
              ) : item.isCompleted ? (
                <p className="text-green-600 text-xs font-semibold">
                  Completed
                </p>
              ) : (
                <div className="flex gap-3">
                 
                  <button
                 onClick={() => {
                 cancelAppointment(item._id);
                 toast.error("Appointment Cancelled");
                  }}
                 className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-full text-xs font-semibold transition"
                  >
                Cancel
                </button>

                  <button
                    onClick={() =>{ completeAppointment(item._id)
                      toast.success("Appointment Completed")}}
                    className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-full text-xs font-semibold transition"
                  >
                    Done
                    
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center py-10 text-gray-400">
            No appointments available
          </p>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointment;
