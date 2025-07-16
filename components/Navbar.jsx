"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X } from "lucide-react"
import ThemeToggle from "./ThemeToggle"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const handleSmoothScroll = (sectionId) => {
    if (window.location.pathname !== "/") {
      router.push("/")
      setTimeout(() => {
        scrollToSection(sectionId)
      }, 100)
    } else {
      scrollToSection(sectionId)
    }
    setIsMenuOpen(false)
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl md:text-2xl font-bold text-white">
            ParkEase
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <button
              onClick={() => handleSmoothScroll("home")}
              className="text-white hover:text-blue-400 transition-colors text-sm xl:text-base"
            >
              Home
            </button>
            <button
              onClick={() => handleSmoothScroll("features")}
              className="text-white hover:text-blue-400 transition-colors text-sm xl:text-base"
            >
              Features
            </button>
            <button
              onClick={() => handleSmoothScroll("about")}
              className="text-white hover:text-blue-400 transition-colors text-sm xl:text-base"
            >
              About
            </button>
            <button
              onClick={() => handleSmoothScroll("how-it-works")}
              className="text-white hover:text-blue-400 transition-colors text-sm xl:text-base"
            >
              How It Works
            </button>
            <button
              onClick={() => handleSmoothScroll("testimonials")}
              className="text-white hover:text-blue-400 transition-colors text-sm xl:text-base"
            >
              Testimonials
            </button>
            <button
              onClick={() => handleSmoothScroll("contact")}
              className="text-white hover:text-blue-400 transition-colors text-sm xl:text-base"
            >
              Contact
            </button>
            <Link
              href="/login"
              className="rounded-full bg-black-500 text-white border border-white px-4 py-2 hover:bg-gray-100 hover:text-black transition-colors text-sm xl:text-base"

            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm xl:text-base"
            >
              Signup
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-700 bg-gray-900/95 backdrop-blur-sm">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => handleSmoothScroll("home")}
                className="text-white text-left hover:text-blue-400 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => handleSmoothScroll("features")}
                className="text-white text-left hover:text-blue-400 transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => handleSmoothScroll("about")}
                className="text-white text-left hover:text-blue-400 transition-colors"
              >
                About
              </button>
              <button
                onClick={() => handleSmoothScroll("how-it-works")}
                className="text-white text-left hover:text-blue-400 transition-colors"
              >
                How It Works
              </button>
              <button
                onClick={() => handleSmoothScroll("testimonials")}
                className="text-white text-left hover:text-blue-400 transition-colors"
              >
                Testimonials
              </button>
              <button
                onClick={() => handleSmoothScroll("contact")}
                className="text-white text-left hover:text-blue-400 transition-colors"
              >
                Contact
              </button>
              <Link
                href="/login"
                className="rounded-full bg-gray-500 text-black px-4 py-2 hover:bg-gray-200 transition-colors text-center"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-center"
              >
                Signup
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
