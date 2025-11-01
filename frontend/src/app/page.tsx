import React from 'react'
import HeroSection from '@/components/section/HeroSection'
import HighlightSection from '@/components/section/HighlightSection'
import  ExperiencesCarousel  from '@/components/section/ExperienceSection'
import AboutSection from '@/components/section/AboutSection'
const Home = () => {
  return (
    <div className='md:px-5 p-1 flex flex-col gap-10'>
      <HeroSection/>
      <AboutSection />
      <ExperiencesCarousel />
      <HighlightSection />
    </div>
  )
}

export default Home