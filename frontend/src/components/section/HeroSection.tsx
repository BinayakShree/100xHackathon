import React from 'react'
import Image from 'next/image'
import Button from '../ui/button'


const HeroSection = () => {
  return (

<section className='w-full h-screen m-5 ' id="Home">
      <Button className='absolute  left-3 bottom-3 text-2xl font-semibold bg-black text-white px-40 py-7 rounded-full z-10 hover:bg-black/80 cursor-pointer transition-colors' onClick={()=>window.location.href='/courses'}>
        Discover Cultural Courses
      </Button>
      <div className='text-white font-bold font-playfair-display'>
      Learn Nepal Beyond Sightseeing
      </div>
    <Image
    src='/hero-subtract.png'
    alt='hero'
    fill
    sizes='100vw 100vh'
    className='w-full h-full p-3 '
    />
    </section>
  )
}

export default HeroSection