import { NavLink } from 'react-router-dom'
import useViewportWidth from '../../hooks/useViewportWidth';

function Hero() {
  const width = useViewportWidth();

  const isMobile = width <= 640;

  return (
    <>
    {isMobile ? (
        <>
        <div className='flex flex-col justify-center items-center pb-[10%]'>
            <div className='w-[70vw] mt-[8%]'>
              <img src='public\tutoring.png' alt='A tutor and a student' className='w-full h-full object-cover'/>
            </div>
            <div className='font-sans w-[70vw] mt-[50px] text-center'>
                <h1 className='text-[30px] font-bold text-[#2e294e] mb-[10px] text-center'>Get Instant <span className='text-[#c5d86d]'>Academic Help</span> — Anytime, Anywhere</h1>
                <h3 className='text-[#555] w-[70vw] text-[20px] mb-[20px] text-center'>Chat with tutors in real time and get answers when you need them most.</h3>
                <NavLink to='/signup'><button className='bg-[#c5d86d] px-[25%] py-[15px] rounded-full text-[1.5rem] font-semibold tracking-wide text-white hover:bg-[#d1e674]'>Join Now</button></NavLink>
            </div>
        </div>
        </>
    ) : (
        <div className='flex justify-between ml-[5vw] mr-[5vw] pb-[5%]'>
        <div className='font-sans w-[50vw] mt-[10%]'>
            <h1 className='text-heroh1 font-bold text-[#2e294e] mb-[10px]'>Get Instant <span className='text-[#c5d86d]'>Academic Help</span> — Anytime, Anywhere</h1>
            <h3 className='text-[#555] text-heroh3 w-[35vw] mb-[20px]'>Chat with tutors in real time and get answers when you need them most.</h3>
            <NavLink to='/signup'><button className='bg-[#c5d86d] px-[20%] py-[3%] text-heroh3 font-semibold tracking-wide rounded-full text-white hover:bg-[#d1e674]'>Join Now</button></NavLink>
        </div>
        <div className='w-[50%] mt-[4%]'>
          <img src='public\tutoring.png' alt='A tutor and a student' className='w-full h-full object-contain'/>
        </div>
    </div>
    )}
    </>
  )
}

export default Hero
