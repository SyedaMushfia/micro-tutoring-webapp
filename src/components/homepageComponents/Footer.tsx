import React from 'react'
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import useViewportWidth from '../../hooks/useViewportWidth';

function Footer() {
  const footerMenu = ['Become a Tutor', 'About Us', 'Contact Us', 'Privacy Policy', 'Terms and Conditions']

  const socialMediaIcons = [
    {
     name: 'Facebook',
     icon: <FacebookIcon />
    }, {
     name: 'Instagram',
     icon: <InstagramIcon />
    }, 
    {
     name: 'X',
     icon: <XIcon />
    }, 
    {
     name: 'Youtube',
     icon: <YouTubeIcon />
    }, {
     name: 'LinkedIn',
     icon: <LinkedInIcon />
    }]

    const width = useViewportWidth();

    const isMobile = width <= 640;

  return (
    <>
        {isMobile ? (
            <>
            <div className='bg-[#2e294e] px-[15%] py-[8%]'>
                <div className="w-[250px] h-[80px] mx-[15%] mb-[5%]"><img src="public/logo.png" alt="logo" className="w-full h-full object-fill" /></div>
                <div className='flex justify-between text-white'>
                   <div>
                        <ul>
                {footerMenu.map(item => (
                    <li key={item} className='hover:text-[#c5d86d] mb-[5%]'>{item}</li>
                ))}
                        </ul>
                      </div>
                      <div>
                        <ul>
                {socialMediaIcons.map(icon => (
                    <li key={icon.name} className='hover:text-[#c5d86d] mb-[25%]'>{icon.icon}</li>
                ))}
                        </ul>
                      </div>
                </div>
            </div>
            </>
        ) : (
            <div className='bg-[#2e294e] flex justify-between items-center text-white px-[5vw] py-[3%]'>
                <div className="w-[250px] h-[80px]"><img src="public/logo.png" alt="logo" className="w-full h-full object-fill" /></div>
                <div>
                    <ul>
                        {footerMenu.map(item => (
                            <li key={item} className='hover:text-[#c5d86d] mb-[5%]'>{item}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <ul>
                        {socialMediaIcons.map(icon => (
                            <li key={icon.name} className='hover:text-[#c5d86d] mb-[25%]'>{icon.icon}</li>
                        ))}
                    </ul>
                </div>
            </div>
        )}
    </>
    
  )
}

export default Footer
