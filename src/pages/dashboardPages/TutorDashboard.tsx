import React from 'react'
import Menu from '../../components/dashboardComponents/Menu'
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import AvailableQuestions from '../../components/dashboardComponents/AvailableQuestions';
import OverviewSection from '../../components/dashboardComponents/OverviewSection';
import useViewportWidth from '../../hooks/useViewportWidth';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PaidIcon from '@mui/icons-material/Paid';
import HistoryIcon from '@mui/icons-material/History';
import ReviewsIcon from '@mui/icons-material/Reviews';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import type { MenuItem } from '../../types';

function TutorDashboard() {
  const width = useViewportWidth();

  const isTab = width <= 769;

  const menu: MenuItem[] = [
    {
        icon: <DashboardIcon />,
        name: 'Dashboard'
    },
    {
        icon: <PaidIcon />,
        name: 'Earnings'
    },
    {
        icon: <HistoryIcon />,
        name: 'History'
    },
    {
        icon: <ReviewsIcon />,
        name: 'Reviews'
    }
  ]

  const generalMenu: MenuItem[] = [
    {
        icon: <SettingsIcon />,
        name: 'Settings'
    },
    {
        icon: <HelpIcon />,
        name: 'Help'
    }
  ]

  return (
    <div>
      {isTab ? (
        <div className='mx-[1.5%] my-[1.5%]'>
          <div className=' flex justify-between items-center px-[3%] bg-[#2e294e] h-[80px] rounded-2xl'>
                <h1 className='sm:text-[25px] xs:text-text4 text-white tracking-wide'>Welcome back, Admin!</h1>
                <div className='flex items-center gap-[25px]'>
                    <div className=' text-white'>
                        <MailIcon className='sm:!text-[30px] xs:!text-[20px]'/>
                    </div>
                    <div className='text-white'>
                        <NotificationsIcon className='sm:!text-[30px] xs:!text-[20px]'/>
                    </div>
                    <div className="w-[3.5vw] h-[3.5vw] rounded-full overflow-hidden">
                      <img src="/tutor-profile-pic.png" alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className='text-white'>
                      <MenuIcon className='sm:!text-[30px] xs:!text-[20px]'/>
                    </div>
                </div>
            </div>
            <OverviewSection role='tutor'/>
            <AvailableQuestions />
        </div>
      ) : (<div className='flex relative'>
        <Menu menu={menu} generalMenu={generalMenu}/>
        <div className='flex flex-col mt-[1%] mx-[1%] absolute left-[19vw] w-[78.5vw]'>
            <div className=' flex justify-between items-center px-[3%] bg-[#2e294e] h-[80px] rounded-2xl'>
                <h1 className='text-[25px] text-white tracking-wide'>Welcome back, Admin!</h1>
                <div className='flex items-center gap-[25px]'>
                    <div className=' text-white'>
                        <MailIcon className='!text-[30px]'/>
                    </div>
                    <div className='text-white'>
                        <NotificationsIcon className='!text-[30px]'/>
                    </div>
                    <div className="w-[3vw] h-[3vw] rounded-full overflow-hidden">
                      <img src="/tutor-profile-pic.png" alt="" className="w-full h-full object-contain" />
                    </div>
                </div>
            </div>
            <OverviewSection role='tutor'/>
            <AvailableQuestions />
        </div>
      </div>)}
    </div>
  )
}

export default TutorDashboard
