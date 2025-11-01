import React from 'react'
import Image from 'next/image'
import Button from '../ui/button'


const HeroSection = () => {
  return (

<div className='w-full h-screen m-5 '>
      <Button className='absolute  left-3 bottom-3 text-2xl font-semibold bg-black text-white px-40 py-7 rounded-full z-10 hover:bg-black/80 cursor-pointer transition-colors'>
        Find Cultural Experiences
      </Button>
      <div className='text-white font-bold font-playfair-display'>
      Experience Nepal Beyond Sightseeing
      </div>
    <Image
    src='/hero-subtract.png'
    alt='hero'
    fill
    sizes='100vw 100vh'
    className='w-full h-full p-3 '
    />
    </div>
  )
}

export default HeroSection