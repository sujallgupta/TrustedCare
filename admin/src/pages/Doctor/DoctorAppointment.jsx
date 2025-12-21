import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { toast } from "react-toastify";

/* LocalStorage Config */
const STORAGE_KEY = "doctorAppointments";
const STORAGE_TIME_KEY = "appointmentsSavedAt";
const FIVE_MINUTES = 5 * 60 * 1000;

const DoctorAppointment = () => {
  const { dtoken, getAppointments } = useContext(DoctorContext);
  const [appointments, setAppointments] = useState([]);

  /* Helpers*/
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

  /* Sample Data*/
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

  /*  Load From LocalStorage */
  useEffect(() => {
    const storedAppointments = localStorage.getItem(STORAGE_KEY);
    const storedTime = localStorage.getItem(STORAGE_TIME_KEY);

    if (storedAppointments && storedTime) {
      const now = Date.now();

      if (now - Number(storedTime) < FIVE_MINUTES) {
        setAppointments(JSON.parse(storedAppointments));
        return;
      } else {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_TIME_KEY);
      }
    }

    if (dtoken) {
      getAppointments();
    } else {
      setAppointments(sampleData);
    }
  }, [dtoken]);

  /* Save To LocalStorage */
  useEffect(() => {
    if (appointments.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
      localStorage.setItem(STORAGE_TIME_KEY, Date.now().toString());
    }
  }, [appointments]);

  /*  Auto Reset After 5 Minutes */
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_TIME_KEY);
      setAppointments(sampleData);
    }, FIVE_MINUTES);

    return () => clearTimeout(timer);
  }, []);

  /* Actions */
  const cancelAppointment = (id) => {
    setAppointments((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, cancelled: true } : item
      )
    );
    toast.error("Appointment Cancelled");
  };

  const completeAppointment = (id) => {
    setAppointments((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, isCompleted: true } : item
      )
    );
    toast.success("Appointment Completed");
  };

  
  return (
    <div className="w-full max-w-6xl m-5">
     <p className="mb-4 text-2xl font-semibold text-gray-800">
  🩺 All Appointments
</p>



      <div className="bg-white border border-gray-200 rounded-2xl shadow-md text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        {/* Header */}
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] py-4 px-6 border-b font-semibold bg-gray-100">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fee</p>
          <p>Action</p>
        </div>

        {/* Rows */}
        {appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div
              key={item._id}
              className={`sm:grid sm:grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] items-center py-4 px-6 border-b ${
                item.cancelled
                  ? "bg-red-50"
                  : item.isCompleted
                  ? "bg-green-50"
                  : "bg-white"
              }`}
            >
              <p>{index + 1}</p>
              <p className="font-medium">{item.userData.name}</p>

              <p
                className={`text-xs px-2 py-1 rounded-full text-center font-semibold ${
                  item.payment
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {item.payment ? "Online" : "Cash"}
              </p>

              <p className="text-center">
                {calculateAge(item.userData.dob)}
              </p>

              <p>
                {slotDateFormat(item.slotDate)},{" "}
                <span className="font-medium">{item.slotTime}</span>
              </p>

              <p className="font-semibold">₹{item.amount}</p>

              {item.cancelled ? (
                <p className="text-red-500 text-xs font-semibold">
                  Cancelled
                </p>
              ) : item.isCompleted ? (
                <p className="text-green-600 text-xs font-semibold">
                  Completed
                </p>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => completeAppointment(item._id)}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs"
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
