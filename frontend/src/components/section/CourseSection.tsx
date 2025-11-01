"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Button from "@/components/ui/button"
import Image from "next/image"

const courses = [
  {
    id: "01",
    title: "Cooking Lessons",
    description: "Learn to prepare authentic Nepali dishes with local families.",
    image: "/cooking.png",
  },
  {
    id: "02",
    title: "Traditional Dance",
    description: "Join folk dance workshops guided by local performers.",
    image: "/dance.png",
  },
  {
    id: "03",
    title: "Arts & Handicrafts",
    description: "Create pottery, paintings, or handmade jewelry the Nepali way.",
    image: "/arts.png",
  },
  {
    id: "04",
    title: "Nature & Ritual Walks",
    description: "Join locals on guided walks exploring sacred sites and rituals.",
    image: "/walk.png",
  },

]

export default function CoursesCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const cardWidth = container.querySelector(".course-card")?.clientWidth || 0
    const gap = 24 // gap-6 = 24px
    const scrollAmount = cardWidth + gap

    container.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    })
  }

  return (
    <section className="" id="courses">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-[64px] font-playfair-display">Courses We Offer</h2>
          <div className="flex gap-4">
            <Button
              onClick={() => scroll("left")}
              className="h-16 w-16 rounded-full border-2 border-black hover:bg-black hover:text-white transition-colors bg-transparent flex justify-center items-center cursor-pointer"
              aria-label="Previous course"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button
              onClick={() => scroll("right")}
              className="h-16 w-16 rounded-full border-2 border-black bg-black text-white hover:bg-white hover:text-black transition-colors flex justify-center items-center cursor-pointer"
              aria-label="Next course" 
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide pb-4"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {courses.map((course) => (
            <div
              key={course.id}
              className="course-card shrink-0 w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] overflow-hidden border-0 shadow-none group cursor-pointer snap-start"
            >
              {/* Image Section */}
              <div className="relative aspect-square overflow-hidden rounded-[20px]">
                <Image
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  fill
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute top-6 left-6">
                  <span className="text-[32px] font-poppins text-white">{course.id}</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="mt-6">
                <h3 className="text-2xl font-semibold mb-2">{course.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {course.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hide Scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}