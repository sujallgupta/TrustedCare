import React from 'react';
import { assets } from '../../assets/assets';

const DoctorDashboard = () => {
  // 🧩 Demo Data
  const dashData = {
    appointments: 12,
    patients: 30,
    latestAppointments: [
      {
        userData: { name: 'Arjun Metha' },
        slotDate: '2025-10-30T09:00:00',
      },
      {
        userData: { name: 'Sujal Gupta' },
        slotDate: '2025-10-31T10:00:00',
      },
      {
        userData: { name: 'Riya Sharma' },
        slotDate: '2025-11-01T14:30:00',
      },
      {
        userData: { name: 'Neha Verma' },
        slotDate: '2025-11-02T01:00:00',
      },
      {
        userData: { name: 'Rohan Das' },
        slotDate: '2025-11-03T17:00:00',
      },
    ],
  };

  return (
    <div className="m-5">
      {/* Summary Cards */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.appointments_icon} alt="Appointments" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{dashData.appointments}</p>
            <p className="text-gray-400">Appointments</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.patients_icon} alt="Patients" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{dashData.patients}</p>
            <p className="text-gray-400">Patients</p>
          </div>
        </div>
      </div>

      {/* Latest Bookings Section */}
      <div className="bg-white mt-10 rounded border shadow-sm">
        <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border-b">
          <img src={assets.list_icon} alt="List" />
          <p className="font-semibold text-gray-700">Latest Bookings</p>
        </div>

        <div className="p-4 text-gray-600 text-sm">
          {dashData.latestAppointments.length > 0 ? (
            dashData.latestAppointments.map((item, index) => (
              <div
                key={index}
                className="flex justify-between py-2 border-b last:border-none hover:bg-gray-50 px-2 rounded transition-all"
              >
                <p className="font-medium text-gray-800">{item.userData.name}</p>
                <p className="text-gray-500">
                  {new Date(item.slotDate).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </p>
              </div>
            ))
          ) : (
            <p>No recent bookings found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
