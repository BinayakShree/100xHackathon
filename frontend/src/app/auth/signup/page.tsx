import Image from "next/image"
import { SignUpForm } from "@/components/forms/signup-form"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-white grid grid-cols-1 md:grid-cols-2">
      {/* Left Section */}
      <div className="flex-1 p-8">
        <div className="max-w-md mx-auto">
          {/* Logo and Tagline */}
          <h1 className="font-['Playfair_Display:Medium'] text-6xl font-medium text-black mb-2">
            Arogya
          </h1>
          <p className="text-base font-medium mb-12">
            Explore More. Experience Life.
          </p>

          <SignUpForm />
        </div>
      </div>

      {/* Right Section */}
      <div className="relative w-full h-screen flex-1">
        <Image
          src="/auth.png"
          alt="Auth background"
          width={1000}
          height={1000}
          className="object-contain h-[99vh]"

        />
   
      </div>
    </div>
  )
}