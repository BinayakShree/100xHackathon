import React from 'react'
import Image from 'next/image'
const HeroSection = () => {
  return (
<div className='relative'>

    <Image
    src='/hero.png'
    alt='hero'
    fill
    className='w-full h-full '
    />
    </div>
  )
}

export default HeroSection