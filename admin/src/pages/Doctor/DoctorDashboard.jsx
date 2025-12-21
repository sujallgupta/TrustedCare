import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";

const STORAGE_KEY = "doctorAppointments";

const DoctorDashboard = () => {
  const [dashData, setDashData] = useState({
    appointments: 0,
    patients: 0,
    latestAppointments: [],
  });

  useEffect(() => {
    const storedAppointments = localStorage.getItem(STORAGE_KEY);

    if (!storedAppointments) return;

    const appointments = JSON.parse(storedAppointments);

    // Total appointments
    const totalAppointments = appointments.length;

    // Unique patients
    const uniquePatients = new Set(
      appointments.map((item) => item.userData.name)
    ).size;

    
    const latestAppointments = [...appointments]
      .sort(
        (a, b) =>
          new Date(b.slotDate).getTime() -
          new Date(a.slotDate).getTime()
      )
      .slice(0, 5);

    setDashData({
      appointments: totalAppointments,
      patients: uniquePatients,
      latestAppointments,
    });
  }, []);

  const getStatus = (item) => {
    if (item.isCompleted) {
      return {
        text: "Service Completed",
        className: "text-green-600",
      };
    }

    if (item.cancelled) {
      return {
        text: "Booking Cancelled",
        className: "text-red-500",
      };
    }

    return {
      text: "Upcoming",
      className: "text-blue-500",
    };
  };

  return (
    <div className="m-5">
      {/* Summary Cards */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 hover:scale-105 transition-all">
          <img
            className="w-14"
            src={assets.appointments_icon}
            alt="Appointments"
          />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {dashData.appointments}
            </p>
            <p className="text-gray-400">Appointments</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 hover:scale-105 transition-all">
          <img
            className="w-14"
            src={assets.patients_icon}
            alt="Patients"
          />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {dashData.patients}
            </p>
            <p className="text-gray-400">Patients</p>
          </div>
        </div>
      </div>

      {/* Latest Bookings */}
      <div className="bg-white mt-10 rounded border shadow-sm">
        <div className="flex items-center gap-2.5 px-4 py-4 border-b">
          <img src={assets.list_icon} alt="List" />
          <p className="font-semibold text-gray-700">
            Latest Bookings
          </p>
        </div>

        <div className="p-4 text-sm">
          {dashData.latestAppointments.length > 0 ? (
            dashData.latestAppointments.map((item, index) => {
              const status = getStatus(item);

              return (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b last:border-none hover:bg-gray-50 px-2 rounded transition-all"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {item.userData.name}
                    </p>
                    <p className={`text-xs font-semibold ${status.className}`}>
                      {status.text}
                    </p>
                  </div>

                  <p className="text-gray-500 text-xs">
                    {new Date(item.slotDate).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-400">
              No recent bookings found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
