import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);

  const logout = () => {
    setToken(false);
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className='flex items-center justify-between text-sm h-20 py mb-5 border-b border-gray-400'>
      <img
        onClick={() => navigate('/')}
        className='w-44 cursor-pointer'
        src={assets.logo}
        alt=''
      />

      {/* Desktop Menu */}
      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink to='/'>
          <li className='py-1'>HOME</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/trustedcare-Ai'>
          <li className='py-1'>TRUSTEDCARE AI</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/doctors'>
          <li className='py-1'>ALL DOCTORS</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/about'>
          <li className='py-1'>ABOUT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/contact'>
          <li className='py-1'>CONTACT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>

        {/* 🟦 Admin Button */}
      <li>
  <a
    href={import.meta.env.VITE_ADMIN_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600"
  >
    Admin
  </a>
</li>

      </ul>

      {/* Right Section */}
      <div className='flex items-center gap-4'>
        {token && userData ? (
          <div className='flex items-center gap-2 cursor-pointer group relative'>
            <img className='w-8 rounded-full' src={userData.image} alt='' />
            <img className='w-2.5' src={assets.dropdown_icon} alt='' />
            <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
              <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                <p
                  onClick={() => navigate('/my-profile')}
                  className='hover:text-black cursor-pointer'
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate('/my-appointments')}
                  className='hover:text-black cursor-pointer'
                >
                  My Appointments
                </p>
                <p onClick={logout} className='hover:text-black cursor-pointer'>
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'
          >
            Create Account
          </button>
        )}

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setShowMenu(true)}
          className='w-6 md:hidden cursor-pointer m-3'
          src={assets.menu_icon}
          alt='menu'
        />

        {/* Mobile Menu */}
        <div
          className={`${
            showMenu ? 'fixed w-full h-full' : 'w-0 h-0'
          } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className='flex items-center justify-between px-5 py-6'>
            <img className='w-36' src={assets.logo} alt='logo' />
            <img
              onClick={() => setShowMenu(false)}
              className='w-7 cursor-pointer'
              src={assets.cross_icon}
              alt='close'
            />
          </div>

          <ul className='flex flex-col items-center gap-3 px-5 text-lg font-medium'>
            <NavLink to='/' onClick={() => setShowMenu(false)}>
              <p className='px-4 py-2 rounded-full inline-block'>HOME</p>
            </NavLink>
            <NavLink to='/trustedcare-Ai' onClick={() => setShowMenu(false)}>
              <p className='px-4 py-2 rounded-full inline-block'>TRUSTEDCARE AI</p>
            </NavLink>
            <NavLink to='/doctors' onClick={() => setShowMenu(false)}>
              <p className='px-4 py-2 rounded-full inline-block'>ALL DOCTORS</p>
            </NavLink>
            <NavLink to='/about' onClick={() => setShowMenu(false)}>
              <p className='px-4 py-2 rounded-full inline-block'>ABOUT</p>
            </NavLink>
            <NavLink to='/contact' onClick={() => setShowMenu(false)}>
              <p className='px-4 py-2 rounded-full inline-block'>CONTACT</p>
            </NavLink>


            <NavLink to='/login' onClick={() => setShowMenu(false)}>
              <p className='px-4 py-2 rounded-full inline-block'>LOGIN</p>
            </NavLink>
              <a
              href='http://localhost:5174/'
              target='_blank'
              rel='noopener noreferrer'
              onClick={() => setShowMenu(false)}
              className='px-4 py-2 rounded-full inline-block'
            >
              ADMIN
            </a>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
