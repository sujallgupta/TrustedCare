import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const AllAppointment = () => {
  const { aToken, appointments, getAllAppointments,} = useContext(AdminContext);
  const { calculateAge } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium text-gray-800">All Appointments</p>

      <div className="bg-white border rounded-lg text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll shadow-sm">
        {/* Header Row for Desktop */}
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b bg-gray-50 font-semibold text-gray-700">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor Name</p>
          <p>Fees</p>
          <p>Status</p>
        </div>

        {/* Appointment List */}
        {appointments && appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-start sm:items-center py-4 px-4 sm:px-6 border-b text-gray-600 hover:bg-gray-50 transition-all gap-2"
            >
              {/* Index */}
              <p className="sm:max-sm:hidden font-medium">{index + 1}</p>

              {/* Patient Info */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <img
                  className="hidden sm:block w-10 h-10 rounded-full border"
                  src={item?.userData?.image || "/default-user.png"}
                  alt="patient"
                />
                <p className="font-medium">{item?.userData?.name || "N/A"}</p>
              </div>

              {/* Age */}
              <p className="sm:max-sm:hidden w-full sm:w-auto">
                {item?.userData?.dob ? calculateAge(item.userData.dob) : "—"}
              </p>

              {/* Date & Time */}
              <p className="text-gray-700 w-full sm:w-auto">
                {item?.slotDate
                  ? new Date(item.slotDate).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : "—"}
              </p>

              {/* Doctor Info */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <img
                  className="hidden sm:block w-8 h-8 rounded-full border"
                  src={item?.docData?.image || "/default-doctor.png"}
                  alt="doctor"
                />
                <p className="font-medium">{item?.docData?.name || "N/A"}</p>
              </div>

              {/* Fees */}
              <p className="text-green-600 font-semibold w-full sm:w-auto">
                ${item?.amount ? item.amount.toFixed(2) : "0.00"}
              </p>

            {item.cancelled 
            ?<p className="text-red-400 text-xs font-medium">Cancelled</p>
          :<p className="text-green-400 text-xs font-medium">Booked</p>
          }
              
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-40 text-gray-500">
            No appointments found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAppointment;
