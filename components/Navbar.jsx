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
    <nav className="">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-white">
            ParkEase
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleSmoothScroll("home")}
              className="text-white"
            >
              Home
            </button>
            <button
              onClick={() => handleSmoothScroll("features")}
              className="text-white"
            >
              Features
            </button>
            <button
              onClick={() => handleSmoothScroll("about")}
              className="text-white"
            >
              About
            </button>
            <button
              onClick={() => handleSmoothScroll("how-it-works")}
              className="text-white"
            >
              How It Works
            </button>
            <button
              onClick={() => handleSmoothScroll("testimonials")}
              className="text-white"
            >
              Testimonials
            </button>
            <button
              onClick={() => handleSmoothScroll("contact")}
              className="text-white"
            >
              Contact
            </button>
            <Link
              href="/login"
              className="rounded-full bg-gray-500 text-black px-4 py-2 hover:bg-gray-200 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Signup
            </Link>
            {/* <ThemeToggle /> */}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => handleSmoothScroll("home")}
                className="text-white text-left"
              >
                Home
              </button>
              <button
                onClick={() => handleSmoothScroll("features")}
                className="text-white text-left"
              >
                Features
              </button>
              <button
                onClick={() => handleSmoothScroll("about")}
                className="text-white text-left"
              >
                About
              </button>
              <button
                onClick={() => handleSmoothScroll("how-it-works")}
                className="text-white text-left"
              >
                How It Works
              </button>
              <button
                onClick={() => handleSmoothScroll("testimonials")}
                className="text-white text-left"
              >
                Testimonials
              </button>
              <button
                onClick={() => handleSmoothScroll("contact")}
                className="text-white text-left"
              >
                Contact
              </button>
              <Link
                href="/login"
                className="rounded-full bg-white text-black px-4 py-2 hover:bg-gray-200 transition-colors text-center"
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
