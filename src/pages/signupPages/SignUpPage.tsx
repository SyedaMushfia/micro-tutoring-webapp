import React, { useState } from 'react'
import useViewportWidth from '../../hooks/useViewportWidth';
import TutorSignUpPage from './TutorSignUpPage';
import StudentSignUpPage from './StudentSignUpPage';
import { NavLink } from 'react-router-dom';

function SignUpPage() {
  const width = useViewportWidth();
  const [showTutorSignUp, setShowTutorSignUp] = useState<boolean>(false);
  const [showStudentSignUp, setShowStudentSignUp] = useState<boolean>(false);

  const isTab = width <= 768;

  const handleTutorClick = () => {
    setShowTutorSignUp(true);
  }

  const handleStudentClick = () => {
    setShowStudentSignUp(true)
  }

  return (
    <div className={`bg-[#f8f9fc] ${isTab ? 'flex flex-col items-center justify-center' : 'flex justify-between h-[728px]'}`}>
      <div className={`flex flex-col lg:w-[53%] md:w-[55%] sm:w-[90%] lg:ml-[4%] md:ml-[2.5%] py-[25px] ${isTab ? 'items-center' : 'items-start'}`}>
          <NavLink to='/'>
            <div className="lg:w-[275px] md:w-[260px] sm:w-[275px] xs:w-[275px] h-[80px]"><img src="public/logo-1.png" alt="logo" className="w-full h-full object-fill" /></div>
          </NavLink>
          <div className='w-[98%] lg:mt-[1%] md:mt-[10%] lg:h-[600px] md:h-[450px]'><img src="public/online-learning.png" alt="" className='w-full h-full object-cover'/></div>
      </div>
      <div className='bg-[#f6edff] rounded-2xl md:h-[660px] sm:h-[650px] xs:h-[620px] lg:w-[35%] md:w-[38%] sm:w-[85%] xs:w-[90%] lg:my-[2%] md:my-[4%] sm:my-[2%] xs:my-[5%] lg:mr-[5%] md:mr-[3.5%] flex flex-col items-center shadow-lg'>
        {showTutorSignUp ? (<TutorSignUpPage />) : showStudentSignUp ? (<StudentSignUpPage />) : (
          <div className='flex flex-col items-center'>
            <h1 className='lg:text-[30px] md:text-text1 sm:text-[30px] xs:text-text2 text-[#2e294e] font-semibold md:mt-[38%] sm:mt-[20%] xs:mt-[12%] mb-[1%]'>Welcome to QuickTutor!</h1>
            <h3 className='text-[16px] font-semibold text-[#555] md:mb-[20%] xs:mb-[10%]'>Learn or Teach — Anytime, Anywhere</h3>
            <button onClick={handleTutorClick} className='bg-[#2e294e] md:w-[22vw] sm:w-[50vw] xs:w-[70vw] py-[5%] mb-[10%] font-semibold text-white rounded-full shadow-md hover:shadow-lg hover:bg-[#5e578a] transition-all duration-300'>Sign Up as Tutor</button>
            <button onClick={handleStudentClick} className='bg-[#2e294e] md:w-[22vw] sm:w-[50vw] xs:w-[70vw] py-[5%] mb-[5%] font-semibold text-white rounded-full shadow-md hover:shadow-lg hover:bg-[#5e578a] transition-all duration-300'>Sign Up as Student</button>
            <p>Already have an account? <span className='text-[#fbbe63]'>Login</span></p>
            <p className='md:mt-[45%] sm:mt-[25%] xs:mt-[15%] text-[14px]'>© 2025 QuickTutor. All rights reserved.</p>
        </div>
        )}
      </div>
    </div>
  )
}

export default SignUpPage
