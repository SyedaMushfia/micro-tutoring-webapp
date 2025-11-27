import React, { useState } from 'react'
import Menu from '../../components/dashboardComponents/Menu';
import type { MenuItem } from '../../types';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PaidIcon from '@mui/icons-material/Paid';
import HistoryIcon from '@mui/icons-material/History';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import OverviewSection from '../../components/dashboardComponents/OverviewSection';
import AskQuestion from '../../components/dashboardComponents/AskQuestion';
import useViewportWidth from '../../hooks/useViewportWidth';

function StudentDashboard() {
  const width = useViewportWidth();

  const isTab = width <= 769;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menu: MenuItem[] = [
    {
        icon: <DashboardIcon />,
        name: 'Dashboard'
    },
    {
        icon: <PaidIcon />,
        name: 'Payments'
    },
    {
        icon: <HistoryIcon />,
        name: 'History'
    },
    {
        icon: <FavoriteIcon />,
        name: 'Favorites'
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
            <AskQuestion />
            <OverviewSection role='student'/>
        </div>
      ) : (
        <div className='flex relative'>
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
              <AskQuestion />
              <OverviewSection role='student'/>
          </div>
      </div>)}
    </div>
  )
}

export default StudentDashboard
