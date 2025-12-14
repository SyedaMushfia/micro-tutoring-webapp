import React, { useState } from 'react'
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { NavLink } from 'react-router-dom';
import Chat from '../components/chatComponents/Chat';
import Whiteboard from '../components/chatComponents/Whiteboard';
import useViewportWidth from '../hooks/useViewportWidth';

function ChatPage() {
  const [isChatClicked, setIsChatClicked] = useState(true);
  const [isWhiteboardClicked, setIsWhiteboardClicked] = useState(false);
  const width = useViewportWidth();

  const isTab = width <= 769;

  const handleClickChat = () => {
    setIsChatClicked(true);
    setIsWhiteboardClicked(false)
  }

  const handleWhiteboardClick = () => {
    setIsWhiteboardClicked(true);
    setIsChatClicked(false);
  }

  return (
    <div>
      {isTab ? (
        <div>
          <div className='flex justify-between'>
            <button className={`${isChatClicked ? 'bg-[#2e294e] text-white' : 'bg-white text-[#2e294e]'} w-[50%] border-[1px] border-[#2e294e] text-center py-4`} onClick={handleClickChat}>Chat</button>
            <button className={`${isWhiteboardClicked ? 'bg-[#2e294e] text-white' : 'bg-white text-[#2e294e]'} w-[50%] border-[1px] border-[#2e294e] text-center py-4`} onClick={handleWhiteboardClick}>Whiteboard</button>
          </div>
          {isChatClicked && <Chat /> || isWhiteboardClicked && <Whiteboard />}
        </div>) : (
        <div className='bg-[#d8d8d8] flex'>
          <Chat />
          <Whiteboard />
      </div>
    )}
    </div>
  )
}

export default ChatPage
