import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();

  //  Determine user type
  const userType = aToken ? 'admin' : dToken ? 'doctor' : null;

  //  Logout function
  const logout = () => {
    navigate('/');
    if (aToken) {
      setAToken('');
      localStorage.removeItem('aToken');
      toast.success('Admin logged out successfully');
    }
    if (dToken) {
      setDToken('');
      localStorage.removeItem('dToken');
      toast.success('Doctor logged out successfully');
    }
  };

  //  Handle navigation based on user type
  const handleNavigation = () => {
    if (userType === 'admin') {
      navigate('/admin-dashboard');
    } else if (userType === 'doctor') {
      navigate('/doctor-dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex justify-between items-center h-15 px-4 sm:px-10 py-3 border-b bg-white">
      <div className="flex items-center gap-2 text-xs">
        <img
          onClick={handleNavigation}
          className="w-35 cursor-pointer"
          src={assets.admin_logo}
          alt="Logo"
        />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">
          {aToken ? 'Admin' : dToken ? 'Doctor' : 'Guest'}
        </p>
      </div>
  
      <button
        onClick={logout}
        className="bg-blue-500 text-white text-sm px-10 py-2 rounded-full"
      >
        LOGOUT
      </button>
    </div>
  );
};

export default Navbar;
