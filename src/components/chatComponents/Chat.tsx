import React from 'react'
import PhotoIcon from '@mui/icons-material/Photo';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SendIcon from '@mui/icons-material/Send';
import CircleIcon from '@mui/icons-material/Circle';

function Chat() {
  return (
    <div className='md:w-[50vw] h-[729px] bg-white md:border-r-[1px] md:border-r-[#555]'>
      <div className='flex justify-between items-center py-2 lg:px-8 md:px-4 sm:px-8 xs:px-6 bg-white drop-shadow-xl '>
        <div className='flex items-center lg:gap-4 md:gap-2 sm:gap-4 xs:gap-4 relative'>
            <div className="lg:w-[12%] md:w-[14%] sm:w-[7%] xs:w-[9%] rounded-full overflow-hidden">
                <img src="/tutor-profile-pic.png" alt="" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className='text-[#2e294e] md:text-text5'>Syedah Mushfia</p>
              <p className='text-[#555] md:text-text5'>Online</p>
            </div>
            <CircleIcon className='absolute md:top-[65%] lg:left-[8.5%] md:left-[9.5%] sm:left-[5%] sm:top-[62%] xs:top-[65%] xs:left-[6%] !text-sm text-green-600'/>
        </div>
        <button className='lg:text-[14px] md:text-[12px] xs:text-[14px] font-semibold bg-[#d8d2ff] shadow-md rounded-xl text-[#2e294e] h-[40px] lg:w-[25vw] md:w-[35vw] sm:w-[40vw] xs:w-[66vw] px-2 hover:bg-[#d1e674]'>End Session</button>
      </div>
      <div className='bg-slate-200 h-[580px]'>
        Hello
      </div>
        <div className='bg-slate-100 rounded-2xl mt-2 mx-2 h-[68px] flex items-center px-6 gap-4'>
          <div className='flex items-center gap-4 text-[#555]'>
            <PhotoIcon className='!text-[35px]'/>
            <EmojiEmotionsIcon className='!text-[35px]'/>
          </div>
          <textarea name="" id="" className='h-[75%] w-[80%] appearance-none resize-none rounded-xl'></textarea>
          <SendIcon className='!text-[35px] text-[#555]'/>
        </div>
    </div>
  )
}

export default Chat
