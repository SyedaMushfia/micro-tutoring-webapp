import useViewportWidth from "../../hooks/useViewportWidth"
import MenuIcon from '@mui/icons-material/Menu';
import type { NavLinkType } from "../../types";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate()
  const width = useViewportWidth();
  const { isLoggedIn, userData, backendUrl, setIsLoggedIn, setUserData } = useAppContext();

  const isDesktop = width > 1024;

  const handleLogout = async () => {
    try {
      await axios.post(`${backendUrl}/api/auth/logout`, {}, { withCredentials: true });

      setIsLoggedIn(false);
      setUserData(null);
      localStorage.removeItem("userData");

      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };


  const navLinks: NavLinkType[] = isLoggedIn ? [
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
      name: 'Dashboard',
      link: userData?.role === 'student' ? '/studentDashboard' : '/tutorDashboard',
    },
  ] : [
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
        <ul className="flex items-center gap-20 font-sans text-white text-[1.125rem] cursor-pointer">
          {navLinks.map(link => (
            <li key={link.name} className="hover:border-b-4 border-b-[#c5d86d] tracking-wider">
              <NavLink to={link.link}>{link.name}</NavLink>
            </li>
          ))}
          {isLoggedIn ? <div onClick={handleLogout} className="hover:border-b-4 border-b-[#c5d86d] tracking-wider">Logout</div> : null}
        </ul>
      ) : (<MenuIcon className="text-white"/>)}
    </div>
  )
}

export default Navbar
