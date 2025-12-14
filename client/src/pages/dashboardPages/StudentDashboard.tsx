import React, { useEffect, useState } from 'react'
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
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import OverviewSection from '../../components/dashboardComponents/OverviewSection';
import AskQuestion from '../../components/dashboardComponents/AskQuestion';
import useViewportWidth from '../../hooks/useViewportWidth';
import { useAppContext } from '../../context/AppContext';

function StudentDashboard() {
  const width = useViewportWidth();
  const { userData, isLoading } = useAppContext()

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
      {isLoading ? (
        <div className='flex items-center justify-center'>Loading dashboard</div>
      ) : (<div>
        {isTab ? (
          <div className='mx-[1.5%] my-[1.5%]'>
            <div className=' flex justify-between items-center px-[3%] bg-[#2e294e] h-[80px] rounded-2xl'>
                  <h1 className='sm:text-[25px] xs:text-text4 text-white tracking-wide'>{`Welcome back, ${userData?.firstName}!`}</h1>
                  <div className='flex items-center gap-[25px]'>
                      <div className=' text-white'>
                          <MailIcon className='sm:!text-[30px] xs:!text-[20px]'/>
                      </div>
                      <div className='text-white'>
                          <NotificationsIcon className='sm:!text-[30px] xs:!text-[20px]'/>
                      </div>
                      {userData?.student?.profilePicture ?
                        <div className="w-[6vw] h-[6vw] rounded-full overflow-hidden bg-pink-200">
                          <img  src={userData?.student?.profilePicture} alt="profile picture" className="w-full h-full object-cover" />
                        </div> : <AccountCircleIcon className='sm:!text-[40px] xs:!text-[1.5rem] text-white'/>}
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
                    <h1 className='text-[25px] text-white tracking-wide'>{`Welcome back, ${userData?.firstName}!`}</h1>
                    <div className='flex items-center gap-[25px]'>
                        <div className=' text-white'>
                            <MailIcon className='!text-[30px]'/>
                        </div>
                        <div className='text-white'>
                            <NotificationsIcon className='!text-[30px]'/>
                        </div>
                        <div className="w-[3vw] h-[3vw] rounded-full overflow-hidden">
                          {userData?.student?.profilePicture ? <img  src={userData?.student?.profilePicture} alt="profile picture" className="w-full h-full object-cover" /> : <AccountCircleIcon className='!text-[45px] text-white'/>}
                        </div>
                    </div>
                </div>
                <AskQuestion />
                <OverviewSection role='student'/>
            </div>
        </div>)}
      </div>)}
    </div>
  )
}

export default StudentDashboard
