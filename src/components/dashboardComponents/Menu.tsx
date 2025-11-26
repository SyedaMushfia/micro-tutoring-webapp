import React from 'react'
import { NavLink } from 'react-router-dom'
import LogoutIcon from '@mui/icons-material/Logout';
import type { MenuItem } from '../../types';

interface MenuProps {
  menu: MenuItem[];
  generalMenu: MenuItem[];
}

function Menu({menu, generalMenu}: MenuProps) {
  
  return (
    <div className='md:w-[18vw] sm:w-[200px] xs:w-[200px] h-[700px] ml-[1%] mt-[1%] pt-[2%] bg-[#f2f4fc] rounded-2xl fixed'>
      <div className='mx-[10%]'>
        <NavLink to='/'>
          <div className="lg:w-[200px] md:w-[120px] sm:w-[150px] xs:w-[150px] lg:h-[55px] md:h-[40px] xs:h-[45px] mx-auto mb-[30px]"><img src="public/nobglogo.png" alt="logo" className="w-full h-full object-fill" /></div>
        </NavLink>
        <h1 className='py-[12px] pl-[10px] text-[#555] text-[14px] tracking-wider'>MENU</h1>
        <ul>
          {menu.map(item => (
              <li key={item.name} className='flex items-center gap-[10px] py-[10px] lg:pl-[25px] md:pl-[20px] text-[#555] text-[14px] font-semibold tracking-wide hover:bg-[#2e294e] hover:text-white '>
              <span>{item.icon}</span>
              <span>{item.name}</span>
              </li>
          ))}
        </ul>
        <h1 className='py-[12px] pl-[10px] text-[#555] text-[14px] tracking-wider'>GENERAL</h1>
        <ul>
          {generalMenu.map(item => (
              <li key={item.name} className='flex items-center gap-[10px] py-[10px] lg:pl-[25px] md:pl-[20px] text-[#555] text-[14px] font-semibold tracking-wide hover:bg-[#2e294e] hover:text-white '>
              <span>{item.icon}</span>
              <span>{item.name}</span>
              </li>
          ))}
        </ul>
        <div className='flex items-center gap-[10px] py-[10px] pl-[25px] text-[#555] text-[14px] font-semibold tracking-wide hover:bg-[#2e294e] hover:text-white '>
          <LogoutIcon />
          <p>Logout</p>
        </div>
      </div>
    </div>
  )
}

export default Menu
