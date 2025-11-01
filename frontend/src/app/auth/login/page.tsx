import Image from "next/image"
import { LoginForm } from "@/components/forms/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex w-full">
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

          <LoginForm />
        </div>
      </div>

      {/* Right Section */}
         <div className="hidden lg:block relative w-[calc(547px-5px)]">
            <Image
              src="/auth.png"
              alt="Auth background"
              fill
              className="object-cover p-2"
              priority
            />
       
          </div>
    </div>
  )
}