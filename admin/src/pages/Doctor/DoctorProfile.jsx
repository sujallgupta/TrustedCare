import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  // 🧩 Demo doctor data (replace with backend data later)
  const [doctorData, setDoctorData] = useState({
    name: "Dr. Demo",
    specialization: "MBBS",
    contact: "+91 9999999999",
    email: "demo@trustedcare.com",
    experience: "10+ years",
    fee: "100",
    image: assets.doctor_icon,
  });

  // 🖊️ State for edit mode
  const [isEditing, setIsEditing] = useState(false);

  // 📄 Handle input changes
  const handleChange = (e) => {
    setDoctorData({ ...doctorData, [e.target.name]: e.target.value });
  };

  // ✅ Save changes (send to admin)
  const handleSubmit = () => {
    setIsEditing(false);
    toast.success("Edit request sent to admin for approval");
    // TODO: send updated data to backend for admin approval
  };

  return (
    <div className="m-6 p-6 bg-white rounded-xl shadow-md border border-gray-100 max-w-3xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={doctorData.image}
          alt={doctorData.name}
          className="w-32 h-32 object-cover rounded-full border-4 border-blue-100 shadow-sm"
        />

        <div className="flex-1 text-center sm:text-left">
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={doctorData.name}
              onChange={handleChange}
              className="border p-1 rounded-md w-48 text-center sm:text-left"
            />
          ) : (
            <h2 className="text-2xl font-semibold text-gray-800">{doctorData.name}</h2>
          )}
          <p className="text-blue-500 font-medium">{doctorData.specialization}</p>
          <p className="text-sm text-gray-500 mt-1">{doctorData.experience} of Experience</p>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-6 border-gray-200" />

      {/* Details Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
        <div className="space-y-2">
          <p>
            <span className="font-medium text-gray-600">Contact:</span>{" "}
            {isEditing ? (
              <input
                type="text"
                name="contact"
                value={doctorData.contact}
                onChange={handleChange}
                className="border p-1 rounded-md w-40"
              />
            ) : (
              doctorData.contact
            )}
          </p>

          <p>
            <span className="font-medium text-gray-600">Email:</span> {doctorData.email}
          </p>
        </div>

        <div className="space-y-2">
          <p>
            <span className="font-medium text-gray-600">Consultation Fee:</span>{" "}
            {isEditing ? (
              <input
                type="number"
                name="fee"
                value={doctorData.fee}
                onChange={handleChange}
                className="border p-1 rounded-md w-20"
              />
            ) : (
              <span className="text-green-600 font-semibold">{doctorData.fee}</span>
            )}
          </p>

          <p>
            <span className="font-medium text-gray-600">Specialization:</span>{" "}
            {doctorData.specialization}
          </p>
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-8 flex justify-center sm:justify-end">
        {isEditing ? (
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-all"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-all"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;
