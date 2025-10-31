import Image from "next/image"
import { LoginForm } from "@/components/forms/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Section */}
      <div className="flex-1 p-8 lg:pr-0">
        <div className="max-w-md mx-auto">
          {/* Logo and Tagline */}
          <h1 className="font-['Playfair_Display:Medium'] text-6xl font-medium text-black mb-2">
            Arogya
          </h1>
          <p className="text-base font-medium mb-12">
            Explore More. Experience Life.
          </p>

          <LoginForm />
        </div>
      </div>

      {/* Right Section - Hidden on mobile */}
      <div className="hidden lg:block relative w-[547px] bg-black">
        <Image
          src="/auth.png"
          alt="Auth background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex flex-col justify-center px-8">
          <h2 className="text-4xl font-medium text-white font-['Playfair_Display:Medium'] mb-64">
            Experience the Real Stories Behind Every Destination.
          </h2>
          <div className="bg-[rgba(217,217,217,0.4)] rounded-[19px] w-fit px-8 py-2">
            <p className="text-xl text-black">Travel with Purpose.</p>
          </div>
        </div>
      </div>
    </div>
  )
}