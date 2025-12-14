import React from 'react'
import Navbar from '../components/homepageComponents/Navbar'
import Hero from '../components/homepageComponents/Hero'
import TutorCTASection from '../components/homepageComponents/TutorCTASection'
import Features from '../components/homepageComponents/Features'
import Footer from '../components/homepageComponents/Footer'

function Homepage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <TutorCTASection />
      <Footer />
    </div>
  )
}

export default Homepage
