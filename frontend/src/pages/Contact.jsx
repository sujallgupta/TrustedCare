import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>
     <div className='text-center text-2xl pt-10 text-gray-500'>
      <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
     </div>
     <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
      <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt="" />
      <div className='flex flex-col justify-center items-start gap-6'>
        <p className='font-semibold text-lg text-gray-600'>OUR OFFICE</p>
        <p className='text-gray-500'>Trusted Care India Pvt.Ltd. <br/>
         5th Floor, Sapphire Tower,<br/>
         MG Road, Sector 18,<br/>
         Noida, Uttar Pradesh – 201301<br/>
         </p>
        <p className='text-gray-500'>Phone: +91 120 456 7890 <br/>
         Email: contact@trustedcare.in
        </p>
        <p className='font-semibold text-lg text-gray-600'>CAREERS AT TRUSTEDCARE</p>
        <p  className='text-gray-500'>Explore our teams and see where you fit in.</p>
        <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>EXPLORE JOBS</button>
      </div>
     </div>
    </div>
  )
}

export default Contact
