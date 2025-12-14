import React from 'react'
import useViewportWidth from '../../hooks/useViewportWidth';

function Features() {
  const width = useViewportWidth();

  const isMobile = width <= 640;

  const cards = [
    {
      icon: 'public/ask-question-icon.png',
      title: "Ask Your Question",
      desc: "Post your academic question anytime and attach files or images for clarity.",
      iconAlt: 'Ask question icon'
    },
    {
      icon: "public/chat-icon.png",
      title: "Connect with a Tutor",
      desc: "Get matched instantly with a tutor and chat in real time to understand your topic.",
      iconAlt: 'Chat icon'
    },
    {
      icon: "public/learn-icon.png",
      title: "Learn & Improve",
      desc: "Discuss, get step-by-step explanations, and understand the solution — not just the answer.",
      iconAlt: 'Book icon'
    },
  ]

  return (
    <div className='w-[99vw] bg-[#e7e4f5] lg:px-[10%] md:px-[6%] sm:px-[4%] py-[4%]'>
      <h1 className='text-[40px] text-center font-semibold text-[#2e294e] mb-[2.5%]'>How QuickTutor Works</h1>
      <div className={isMobile? 'flex flex-col  items-center gap-[10vh]': 'flex justify-between items-center'}>
        {cards.map(card => (
            <div key={card.title} className={`${isMobile ? 'w-[60%] px-[3%]' : 'w-[30%] px-[2%]'} h-[350px] shadow-lg bg-white flex flex-col justify-center items-center rounded-3xl`}>
                <div className='w-[45%] mb-[10%]'><img src={card.icon} alt={card.iconAlt}/></div>
                <h1 className={`${isMobile && 'text-[25px]'} md:text-[25px] sm:text-[20px] text-[#2e294e] font-medium mb-[5%] text-center`}>{card.title}</h1>
                <p className='text-[#555] text-center'>{card.desc}</p>
            </div>
        ))}
      </div>
    </div>
  )
}

export default Features
