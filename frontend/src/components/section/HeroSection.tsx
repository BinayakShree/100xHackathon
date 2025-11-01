import React from 'react'
import Image from 'next/image'
const HeroSection = () => {
  return (

<div className='w-full h-screen relative'>

    <Image
    src='/hero.png'
    alt='hero'
    fill
    sizes='100vw 100vh'
    className='w-full h-full '
    />
    </div>
  )
}

export default HeroSection