import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        {/* ----left Section---- */}
        <div>
            <img onClick={() =>{navigate('/');scrollTo(0,0)}} className='m-1 w-40' src={assets.logo} alt="" />
    <p className='w-full md:w-2/3 text-gray-600 leading-6'> Connecting you with trusted healthcare professionals. Book appointments with top doctors anytime, anywhere, and take the first step towards better health.</p>

        </div>
        {/* ---- Center Section----*/}
        <div>
    <p className='text-xl font-medium mb-5'>COMPANY</p>
    <ul className='flex flex-col gap-2 text-gray-600'>
        <li>Home</li>
        <li>About Us</li>
        <li>Contact Us</li>
        <li>Privacy Policy</li>
    </ul>
        </div>
        {/* ----Right Section----*/}
        <div>
    <p className='text-xl font-medium mb-5'>Get In Touch</p>
    <ul className='flex flex-col gap-2 text-gray-600'>
        <li>+91 120 456 7890</li>
        <li>Trustedcare@gmail.com</li>
    </ul>
        </div>
      </div>
      <div>
        {/* ------CopyRight Section------*/}
    <hr />
    <p className='py-5 text-sm text-center'>© {new Date().getFullYear()} TrustedCare. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Footer
