import React, { useEffect, useState } from 'react'
import Menu from '../../components/Menu';
import type { MenuItem } from '../../types';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PaidIcon from '@mui/icons-material/Paid';
import HistoryIcon from '@mui/icons-material/History';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import OverviewSection from '../../components/OverviewSection';
import AskQuestion from '../../components/studentDashboardComponents/AskQuestion';
import CircleIcon from '@mui/icons-material/Circle';
import useViewportWidth from '../../hooks/useViewportWidth';
import { useAppContext } from '../../context/AppContext';
import { socket } from '../../utils';
import { Outlet, useNavigate } from 'react-router-dom';

function StudentDashboard() {
  const navigate  = useNavigate()
  const width = useViewportWidth();
  const { userData, isLoading } = useAppContext()

  const isTab = width <= 769;
  const isMobile = width <= 425;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(userData?.isOnline || false);

  useEffect(() => {
      if (!userData?._id) return;
  
      socket.emit("register-user", { userId: userData._id });
      socket.emit("student-online", { userId: userData._id });
  
    }, [userData?._id])

    useEffect(() => {
    socket.on("student-status-updated", ({ userId, isOnline }) => {
      if (userId === userData?._id) setIsOnline(isOnline);
    });
  
    return () => {
      socket.off("student-status-updated");
    }
  }, [userData?._id]);

  useEffect(() => {
    const handleRequestAccepted = ({ sessionId }: { sessionId: string }) => {
      navigate(`/chatroom/${sessionId}`);
    };
    
    socket.on("question-accepted", handleRequestAccepted);
    
    return () => {
      socket.off("question-accepted", handleRequestAccepted);
    }
  }, [navigate])

  const menu: MenuItem[] = [
    {
        icon: <DashboardIcon />,
        name: 'Dashboard',
        path: '',
    },
    {
        icon: <PaidIcon />,
        name: 'Wallet',
        path: 'wallet',
    },
    {
        icon: <HistoryIcon />,
        name: 'History',
        path: 'student-history',
    },
    {
        icon: <FavoriteIcon />,
        name: 'Favorites',
        path: 'favorites',
    }
  ]

  const generalMenu: MenuItem[] = [
    {
        icon: <SettingsIcon />,
        name: 'Settings',
        path: 'settings',
    },
    {
        icon: <HelpIcon />,
        name: 'Help',
        path: 'help',
    }
  ]

  return (
    <div>
      {isLoading ? (
        <div className='flex items-center justify-center'>Loading dashboard</div>
      ) : (<div>
        {isTab ? (
          <div className='mx-[1.5%] my-[1.5%]'>
            <div className=' flex justify-between items-center px-[3%] bg-[#2e294e] h-[80px] rounded-2xl'>
                  <h1 className='sm:text-[25px] xs:text-text4 text-white tracking-wide'>{`Welcome, ${userData?.firstName}!`}</h1>
                  <div className='flex items-center gap-[25px]'>
                      <div className=' text-white'>
                          <MailIcon className='sm:!text-[30px] xs:!text-[20px]'/>
                      </div>
                      <div className='text-white'>
                          <NotificationsIcon className='sm:!text-[30px] xs:!text-[20px]'/>
                      </div>
                      <div className='relative'>
                        {userData?.student?.profilePicture ?
                          <div className="w-[6vw] h-[6vw] rounded-full overflow-hidden bg-pink-200">
                            <img  src={userData?.student?.profilePicture} alt="profile picture" className="w-full h-full object-cover" />
                          </div> : <AccountCircleIcon className='sm:!text-[40px] xs:!text-[1.5rem] text-white'/>}
                          {isOnline && <CircleIcon className={`absolute ${isMobile ? 'left-2 top-2' : 'sm:left-8 sm:top-8 xs:left-4 xs:top-4'} sm:!text-[13px] xs:!text-[10px] text-green-400`}/>}
                      </div>
                      <div className='text-white'>
                        <MenuIcon className='sm:!text-[30px] xs:!text-[20px]' onClick={() => setIsMenuOpen(true)}/>
                      </div>
                  </div>
              </div>
              {isMenuOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 z-50" onClick={() => setIsMenuOpen(false)}>
                  <div className="w-[250px] bg-white h-full shadow-xl p-4" onClick={(e) => e.stopPropagation()}>
                    <Menu menu={menu} generalMenu={generalMenu} />
                  </div>
                </div>
              )}
              <Outlet />
          </div>
        ) : (
          <div className='flex relative'>
          <Menu menu={menu} generalMenu={generalMenu} />
          <div className='flex flex-col mt-[1%] mx-[1%] absolute left-[19vw] w-[78.5vw]'>
                <div className=' flex justify-between items-center px-[3%] bg-[#2e294e] h-[80px] rounded-2xl'>
                    <h1 className='text-[25px] text-white tracking-wide'>{`Welcome, ${userData?.firstName}!`}</h1>
                    <div className='flex items-center gap-[25px]'>
                        <div className=' text-white'>
                            <MailIcon className='!text-[30px]'/>
                        </div>
                        <div className='text-white'>
                            <NotificationsIcon className='!text-[30px]'/>
                        </div>
                        <div className='relative'>
                          <div className="w-[3vw] h-[3vw] rounded-full overflow-hidden">
                            {userData?.student?.profilePicture ? <img  src={userData?.student?.profilePicture} alt="profile picture" className="w-full h-full object-cover" /> : <AccountCircleIcon className='!text-[45px] text-white'/>}
                          </div>
                          {isOnline && <CircleIcon className='absolute lg:left-8 lg:top-8 md:left-6 md:top-[1.25rem] lg:!text-[14px] md:!text-[12px] text-green-400'/>}
                        </div>
                    </div>
                </div>
                <Outlet />
            </div>
        </div>)}
      </div>)}
    </div>
  )
}

export default StudentDashboard
