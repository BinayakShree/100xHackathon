import Image from 'next/image'

export default function AboutSection() {
    return (
      <section className="min-h-screen bg-white" id='about'>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Text */}
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl lg:text-[64px] font-playfair-display text-[#000000] mb-8 leading-tight">
                We Celebrate Real Culture, Not Just Destinations
              </h1>
              <p className="text-lg text-[#7f7f7f] leading-relaxed">
                we connect travelers with local tutors who share their art, food, dance, and traditions — helping you
                learn about Nepal through its people, not just its landmarks.
              </p>
            </div>
  
            {/* Right Column - Image Grid */}
            <div>
                <Image src="/about.png" alt="About" width={500} height={500} />
            </div>
          </div>
        </div>
      </section>
    )
  }
  