import React from 'react'
import { NavLink } from 'react-router-dom'

function LoginPage() {
  return (
    <>
      <div className="flex justify-center items-center bg-[url('public/background.png')] bg-cover bg-center h-[729px]">
        <div className='flex flex-col items-center md:w-[40vw] lg:w-[30vw] sm:w-[50vw] xs:w-[60vw] h-[575px] px-[5%] py-[1.5%] backdrop-blur-sm isolate aspect-video rounded-xl bg-white/50 shadow-lg ring-1 ring-white'>
            <NavLink to='/'>
            <div className="lg:w-[255px] md:w-[260px] sm:w-[275px] xs:w-[45vw] h-[70px] mb-[15%]"><img src="public/nobglogo.png" alt="logo" className="w-full h-full object-fill" /></div>
            </NavLink>
            <h3 className='text-[16px] tracking-wide text-center text-white mb-[8%]'>Sign in to your QuickTutor Account</h3>
            <div className='flex flex-col w-full '>
                <label htmlFor="" className='text-[#2e294e] font-semibold'>Email</label>
                <input type="text" className='mb-[5%] border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition'/>
            </div>
            <div className='flex flex-col w-full mb-[5%]'>
                <label htmlFor="" className='text-[#2e294e] font-semibold'>Password</label>
                <input type="password" className='mb-[5%] border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition'/>
            </div>
            <button className='bg-[#c5d86d] mb-[2.5%] md:w-[18vw] sm:w-[40vw] xs:w-[50vw] py-[10px] font-semibold text-white rounded-full shadow-md hover:shadow-lg hover:bg-[#d1e674] transition-all duration-300'>Log In</button>
            <p className='mb-[28%] text-white text-center'>Don't have an account? <span className='text-[#fbbe63]'>Sign Up!</span></p>
            <p className='text-center text-[13px] text-[#2e294e]'>By logging in, you agree to our <span className='font-bold'>Privacy Policy</span> and <span className='font-bold'>Terms & Conditions</span></p>
        </div>
    </div>
    </>
  )
}

export default LoginPage
