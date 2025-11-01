import type { Metadata } from "next"
import { Playfair_Display, Poppins } from "next/font/google"
import { NotificationProvider } from "@/context/notification-context";
import "./globals.css"

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
})

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Arogya",
  description: "A celebration of Nepal’s culture and experiences",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${poppins.variable} font-sans antialiased bg-white text-neutral-900`}
      >
        <NotificationProvider>
          <main className=" ">
            {children}
          </main>
        </NotificationProvider>
      </body>
    </html>
  )
}
