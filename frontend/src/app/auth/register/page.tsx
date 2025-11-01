import Image from "next/image"
import { RegisterForm } from "@/components/forms/register-form"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Section */}
      <div className="w-1/2 p-8 flex items-center">
        <div className="max-w-md mx-auto w-full">
          {/* Logo and Tagline */}
          <div className="flex items-center gap-4 mb-8">
            <Image
              src="/logo.png"
              alt="Arogya Logo"
              width={64}
              height={64}
              className="w-16 h-16"
            />
            <div>
              <h1 className="font-['Playfair_Display:Medium'] text-4xl font-medium text-black">
                Arogya
              </h1>
              <p className="text-base text-gray-600">
                Explore More. Experience Life.
              </p>
            </div>
          </div>

          <RegisterForm />
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 relative min-h-screen bg-black">
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