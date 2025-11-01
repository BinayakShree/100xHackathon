"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed  top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="  mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="shrink-0">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="Arogya" className="h-22 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center  justify-center flex-1 ml-10">
            <div className="flex space-x-8">
              {["Home", "About", "Experience", "Highlight"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className={`${
                    isScrolled ? "text-gray-800" : "text-black  mb-5"
                  } hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/auth/login"
              className="text-black hover:text-gray-600 px-4 py-2 text-sm font-medium transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Sign up
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${
                isScrolled ? "text-gray-800" : "text-black"
              } hover:text-gray-600 inline-flex items-center justify-center p-2 rounded-md transition-colors`}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } md:hidden bg-white border-t`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {["Home", "About", "Experience", "Highlight"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-gray-800 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
          <div className="border-t border-gray-200 my-2"></div>
          <Link
            href="/auth/login"
            className="text-gray-800 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Log in
          </Link>
          <Link
            href="/auth/signup"
            className="bg-black text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium transition-colors mt-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Sign up
          </Link>
        </div>
      </div>
    </nav>
  );
}
