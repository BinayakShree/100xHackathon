import React from 'react'
import HeroSection from '@/components/section/HeroSection'
import HighlightSection from '@/components/section/HighlightSection'
import  ExperiencesCarousel  from '@/components/section/ExperienceSection'
import AboutSection from '@/components/section/AboutSection'
import Navbar from '@/components/layout/Navbar'

const Home = () => {
  return (
    <div className='md:px-5 p-1 flex flex-col gap-10'>
      <Navbar />
      <HeroSection/>
      <AboutSection />
      <ExperiencesCarousel />
      <HighlightSection />
    </div>
  )
}

export default Home