import Image from "next/image"
import Button from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="" id="highlight">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 lg:grid-rows-6 gap-6 lg:gap-4 min-h-[800px]">
          {/* div1: Heading & Description */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-2 flex flex-col justify-center pr-0 lg:pr-6 order-1 md:order-1">
            <h1 className="text-4xl sm:text-5xl xl:text-6xl leading-tight text-balance mb-4 font-playfair-display">
              Our Cultural Highlights
            </h1>
            <p className="font-poppins text-sm sm:text-base xl:text-lg text-gray-600 ">
              Discover some of our most loved local courses — where learners and tutors connect to
              celebrate Nepal's culture.
            </p>
          </div>

          {/* div2: Bhaktapur Pottery */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl col-span-1 md:col-span-1 lg:col-span-2 lg:row-span-4 lg:col-start-3 lg:row-start-1 order-3 md:order-2 aspect-4/3 lg:aspect-auto">
            <Image
              src="/pottery.png"
              alt="Bhaktapur Pottery Village"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6 ">
              <h3 className="text-white text-base  font-medium underline text-right">
                Bhaktapur Pottery Village
              </h3>
            </div>
          </div>

          {/* div3: Patan Art Museum */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl col-span-1 md:col-span-1 lg:col-span-2 lg:row-span-5 lg:col-start-5 lg:row-start-1 order-5 md:order-4 aspect-4/3 lg:aspect-auto">
            <Image
              src="/museum.png"
              alt="Patan Art Museum"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6">
              <h3 className="text-white text-base  font-medium underline text-right">
                Patan Art Museum
              </h3>
            </div>
          </div>

          {/* div4: Kathmandu Cooking Workshop */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl col-span-1 md:col-span-1 lg:col-span-2 lg:row-span-4 lg:col-start-1 lg:row-start-3 order-2 md:order-3 aspect-4/3 lg:aspect-auto">
            <Image
              src="/cooking-workshop.png"
              alt="Kathmandu Cooking Workshop"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6">
              <h3 className="text-white text-base  font-medium underline text-right">
                Kathmandu Cooking Workshop
              </h3>
            </div>
          </div>

          {/* div5: Pokhara Folk Dance */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl col-span-1 md:col-span-1 lg:col-span-2 lg:row-span-2 lg:col-start-3 lg:row-start-5 order-4 md:order-5 aspect-4/3 lg:aspect-auto">
            <Image
              src="/dance.png"
              alt="Pokhara Folk Dance Evening"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6">
              <h3 className="text-white text-base  font-medium underline text-right">
                Pokhara Folk Dance Evening
              </h3>
            </div>
          </div>

          {/* div6: Button */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 lg:col-start-5 lg:row-start-6 flex items-center justify-center pt-4 order-6 md:order-6">
            <Button
              className="font-poppins rounded-full px-12 py-6 text-lg font-medium border-2 w-full cursor-pointer border-black hover:bg-black hover:text-white transition-colors bg-transparent"
            >
              View All Courses
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
