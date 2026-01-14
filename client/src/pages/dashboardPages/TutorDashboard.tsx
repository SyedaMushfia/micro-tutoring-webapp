import React, { useEffect, useState } from 'react'
import Menu from '../../components/Menu'
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import AvailableQuestions from '../../components/tutorDashboardComponents/QuestionRequests';
import OverviewSection from '../../components/OverviewSection';
import useViewportWidth from '../../hooks/useViewportWidth';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PaidIcon from '@mui/icons-material/Paid';
import HistoryIcon from '@mui/icons-material/History';
import ReviewsIcon from '@mui/icons-material/Reviews';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import type { MenuItem } from '../../types';
import { useAppContext } from '../../context/AppContext';
import CircleIcon from '@mui/icons-material/Circle';
import { socket } from '../../utils';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';


function TutorDashboard() {
  const navigate  = useNavigate()
  const width = useViewportWidth();
  const { backendUrl, userData, isLoading } = useAppContext()
  const [isOnline, setIsOnline] = useState(userData?.isOnline || false);

  const isTab = width <= 769;
  const isMobile = width <= 425;

  useEffect(() => {
    if (!userData?._id) return;

    socket.emit("register-user", { userId: userData._id });
    socket.emit("tutor-online", { userId: userData._id });

  }, [userData?._id])

  useEffect(() => {
  socket.on("tutor-status-updated", ({ userId, isOnline }) => {
    if (userId === userData?._id) setIsOnline(isOnline);
  });

  return () => {
    socket.off("tutor-status-updated");
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
        name: 'Earnings',
        path: 'earnings',
    },
    {
        icon: <HistoryIcon />,
        name: 'History',
        path: 'tutor-history',
    },
    {
        icon: <ReviewsIcon />,
        name: 'Reviews',
        path: 'reviews',
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
                        <div className="w-[3.5vw] h-[3.5vw] rounded-full overflow-hidden">
                            {userData?.tutor?.profilePicture ? <img  src={userData?.tutor?.profilePicture} alt="profile picture" className="w-full h-full object-cover" /> : <AccountCircleIcon className='!text-[45px] text-white'/>}
                        </div>
                          {isOnline && <CircleIcon className={`absolute ${isMobile ? 'left-2 top-2' : 'sm:left-4 sm:top-4 xs:left-4 xs:top-4'} sm:!text-[13px] xs:!text-[10px] text-green-400`}/>}
                      </div>
                      <div className='text-white'>
                        <MenuIcon className='sm:!text-[30px] xs:!text-[20px]'/>
                      </div>
                  </div>
              </div>
              <Outlet />
          </div>
        ) : (<div className='flex relative'>
          <Menu menu={menu} generalMenu={generalMenu}/>
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
                            {userData?.tutor?.profilePicture ? <img  src={userData?.tutor?.profilePicture} alt="profile picture" className="w-full h-full object-cover" /> : <AccountCircleIcon className='!text-[45px] text-white'/>}
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

export default TutorDashboard
