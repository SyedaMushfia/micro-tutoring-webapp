import React, { useState, type ChangeEvent } from 'react'
import background from '../../public/background.png';
import ErrorIcon from '@mui/icons-material/Error';
import { NavLink, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext';
import axios from 'axios';

function LoginPage() {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, setUserData} = useAppContext();

  const [loginDetails, setLoginDetails] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [loginError, setLoginError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setLoginDetails(prev => ({
      ...prev,
      [id]: value,
    }))

    setErrors((prev) => ({ ...prev, [id]: "" }));
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;

    if (!value.trim()) {
      setErrors((prev) => ({
        ...prev,
        [id]: "This field is required",
      }));
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const loginRes = await axios.post(`${backendUrl}/api/auth/login`, loginDetails, { withCredentials: true });

      if (!loginRes.data.success) {
        setLoginError(loginRes.data.message)
        return;
      }

      const getProfileRes = await axios.get(`${backendUrl}/api/auth/profile`, {withCredentials: true});
      setIsLoggedIn(true),
      setUserData(getProfileRes.data.user);

      if (getProfileRes.data.user.role === 'student') {
        navigate("/studentDashboard")
      } else navigate("/tutorDashboard");
      
    } catch (error: any) {
      setLoginError(error.response?.data?.message || 'Server error')
    }
    
  }

  return (
    <>
      <div className="flex justify-center items-center bg-cover bg-center h-[729px]" style={{ backgroundImage: `url(${background})` }}>
        <div className='flex flex-col items-center md:w-[40vw] lg:w-[30vw] sm:w-[50vw] xs:w-[60vw] h-[575px] px-[5%] py-[1.5%] backdrop-blur-sm isolate aspect-video rounded-xl bg-white/50 shadow-lg ring-1 ring-white'>
            <NavLink to='/'>
            <div className="lg:w-[255px] md:w-[260px] sm:w-[275px] xs:w-[45vw] h-[70px] mb-[15%]"><img src="public/nobglogo.png" alt="logo" className="w-full h-full object-fill" /></div>
            </NavLink>
            <h3 className='text-[16px] tracking-wide text-center text-white mb-[8%]'>Sign in to your QuickTutor Account</h3>
            <form onSubmit={handleSubmit}>
              <div className='flex flex-col w-full mb-[5%]'>
                  <label htmlFor="email" className='text-[#2e294e] font-semibold'>Email</label>
                  <input type="email" name="email" id="email" value={loginDetails.email} onChange={handleInputChange} onBlur={handleBlur} required className='mb-[5%] border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none'/>
                  {errors.email && <div className='flex gap-[2px] items-center text-red-600 mt-[-10px]'>
                      <ErrorIcon className='!text-[18px]'/>
                    <p className='text-[13px]'>{errors.email}</p>
                  </div>}
              </div>
              <div className='flex flex-col w-full mb-[5%]'>
                  <label htmlFor="password" className='text-[#2e294e] font-semibold'>Password</label>
                  <input type="password" name="password" id="password" value={loginDetails.password} onChange={handleInputChange} onBlur={handleBlur} required className='mb-[5%] border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none'/>
                  {errors.password && <div className='flex gap-[2px] items-center text-red-600 mt-[-10px]'>
                      <ErrorIcon className='!text-[18px]'/>
                      <p className='text-[13px]'>{errors.password}</p>
                  </div>}
              </div>
              <button type='submit' disabled={!loginDetails.email || !loginDetails.password} className='bg-[#c5d86d] mb-[2.5%] md:w-[18vw] sm:w-[40vw] xs:w-[50vw] py-[10px] font-semibold text-white rounded-full shadow-md hover:shadow-lg hover:bg-[#d1e674] transition-all duration-300'>Log In</button>
            </form>
            {loginError && (
              <div className="flex items-center gap-1 text-red-600 mb-2">
                <ErrorIcon className="!text-[18px]" />
                <span className="text-[13px]">{loginError}</span>
              </div>
            )}
            <p className='mb-[20%] text-white text-center'>Don't have an account? <NavLink to={'/signup'}><span className='text-[#fbbe63]'>Sign Up!</span></NavLink></p>
            <p className='text-center text-[13px] text-[#2e294e]'>By logging in, you agree to our <span className='font-bold'>Privacy Policy</span> and <span className='font-bold'>Terms & Conditions</span></p>
        </div>
    </div>
    </>
  )
}

export default LoginPage
