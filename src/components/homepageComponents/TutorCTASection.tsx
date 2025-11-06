import React from 'react'
import { NavLink } from 'react-router-dom'
import useViewportWidth from '../../hooks/useViewportWidth';

function TutorCTASection() {
  const width = useViewportWidth();

  const isMobile = width <= 640;

  return (
    <>
    {isMobile ? (
        <>
        <div className='flex flex-col justify-center items-center pb-[10%]'>
            <div className='w-[70vw] mt-[8%]'>
                <img src='public\tutor.png' alt='A tutor and a student' className='w-full h-full object-cover'/>
            </div>
            <div className='font-sans w-[70vw] mt-[50px] text-center'>
                <h1 className='text-[30px] font-bold text-[#2e294e] mb-[10px] text-center'>Tutor <span className='text-[#c5d86d]'>On-Demand</span>. Earn Per Question.</h1>
                <h3 className='text-[#555] w-[70vw] text-[20px] mb-[20px] text-center'>Help students succeed while you earn from your knowledge — flexible, fast, and rewarding.</h3>
                <NavLink to='/signup'><button className='bg-[#c5d86d] px-[25%] py-[15px] rounded-full text-[1.5rem] font-semibold tracking-wide text-white hover:bg-[#d1e674]'>Become a Tutor</button></NavLink>
            </div>
        </div>
        </>
    ) : (
      <div className='flex gap-[5%] mx-[5vw] mt-[6vh] pb-[5%]'>
      <div className='w-[50%] mt-[4%]'><img src="public/tutor.png" alt="A tutor teaching a student online." /></div>
      <div className='w-[50%] text-center mt-[8%]'>
        <h1 className='text-heroh1 font-bold text-[#2e294e] mb-[10px]'>Tutor <span className='text-[#c5d86d]'>On-Demand</span>. Earn Per Question.</h1>
        <h3 className='text-[#555] text-heroh3 mb-[20px]'>Help students succeed while you earn from your knowledge — flexible, fast, and rewarding.</h3>
        <NavLink to='./signup'><button className='bg-[#c5d86d] px-[20%] py-[3%] text-heroh3 font-semibold tracking-wide rounded-full text-white hover:bg-[#d1e674]'>Become a Tutor</button></NavLink>
      </div>
    </div>
    )}
    </>
  )
}

export default TutorCTASection
