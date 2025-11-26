import useViewportWidth from "../../hooks/useViewportWidth"
import MenuIcon from '@mui/icons-material/Menu';
import type { NavLinkType } from "../../types";
import { NavLink } from "react-router-dom";

function Navbar() {
  const width = useViewportWidth();

  const isDesktop = width > 1024;

  const navLinks: NavLinkType[] = [
    {
      name: 'Home',
      link: '/',
    },
    {
      name: 'About',
      link: '/about',
    },
    {
      name: 'Help',
      link: '/help',
    },
    {
      name: 'Login',
      link: '/login',
    },
    {
      name: 'Sign Up',
      link: '/signup',
    }
  ]


  return (
    <div className="bg-[#2e294e] w-[99vw] h-[100px] flex items-center justify-between pl-[50px] pr-[50px] shadow-xl">
      <div className="w-[250px] h-[80px]"><img src="public/logo.png" alt="logo" className="w-full h-full object-fill" /></div>
      {isDesktop ? (
        <ul className="flex items-center gap-20 font-sans text-white text-[1.125rem]">
          {navLinks.map(link => (
            <li key={link.name} className="hover:border-b-4 border-b-[#c5d86d] tracking-wider">
              <NavLink to={link.link}>{link.name}</NavLink>
            </li>
          ))}
        </ul>
      ) : (<MenuIcon className="text-white"/>)}
    </div>
  )
}

export default Navbar
