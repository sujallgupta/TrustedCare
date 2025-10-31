import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
     <div className='text-center text-2xl pt-10 text-gray-500'>
      <p>
        ABOUT <span className='text-gray-700 font-medium'>US</span>
      </p>
     </div>

     <div className='my-10 flex flex-col md:flex-row gap-12 '>
      <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
      <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
        <p>At TrustedCare, we believe healthcare should be simple, accessible, and reliable. Our platform connects patients with experienced doctors across multiple specialties, ensuring that you find the right care when you need it most.</p>
        <p>We work only with verified professionals, offering transparent information about their expertise, qualifications, and patient reviews. This helps you make confident decisions while booking appointments online with ease.</p>
        <b className='text-gray-800'>Our Vision</b>
        <p>Our vision is to make healthcare simple, accessible, and trustworthy by connecting patients with verified doctors anytime, anywhere, empowering people to make confident health decisions with ease.</p>
      </div>
     </div>
     <div className='text-xl my-4'>
      <p>WHY<span className = 'text-gray-700 font-semibold'> CHOOSE US</span></p>
     </div>
     <div className='flex flex-col md:flex-row mb-20'>
      <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
        <b>EFFICIENCY</b>
          <p>Seamless scheduling experience created for your busy everyday schedule. </p>
      </div>
      <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
                <b>CONVENIENCE</b>
          <p>Trusted medical experts conveniently accessible to you in your area.</p>
      </div>
      <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>PERSONALIZATION</b>
          <p>Receive personal health recommendations and timely reminders for better care.</p>
      </div>
     </div>
    </div>
  )
}

export default About
