"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah Ahmed",
    role: "Regular Customer",
    content:
      "ParkEase saved me so much time! No more searching for parking spots. The booking process is incredibly smooth and reliable.",
    rating: 5,
    image: "/public/99bd115d730e68729ed7f5afdb9410ed.jpg.jpg",
  },
  {
    id: 2,
    name: "Muhammad Ali",
    role: "Business Owner",
    content:
      "The booking process is so simple and quick. Highly recommended! It's made my visits to the mall so much more convenient.",
    rating: 5,
    image: "/public/istockphoto-2157036490-170667a.jpg",
  },
  {
    id: 3,
    name: "Fatima Khan",
    role: "Frequent Shopper",
    content:
      "Amazing service! I can now plan my shopping trips without worrying about parking. The app is user-friendly and efficient.",
    rating: 5,
    image: "/images.jpg",
  },
  {
    id: 4,
    name: "Ahmed Hassan",
    role: "Mall Visitor",
    content:
      "ParkEase has revolutionized my mall experience. Quick booking, secure payment, and guaranteed parking spot. Perfect!",
    rating: 5,
    image: "/public/profile-view-of-a-bearded-man-wearing-a-green-cap-illustration-minimalist-illustration-vector.jpg",
  },
]

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="overflow-hidden rounded-xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0">
              <div className="bg-gray-100 dark:bg-gray-200 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-300 mx-4">
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="text-xl font-semibold text-black dark:text-black">{testimonial.name}</h4>
                    <p className="text-gray-600 dark:text-gray-700">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex mb-4 ">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-gray-500 dark:text-gray-600 text-lg leading-relaxed italic">
                  "{testimonial.content}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-400 dark:bg-gray-300 text-black p-3 rounded-full hover:bg-gray-300 dark:hover:bg-gray-400 transition-colors shadow-lg"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-400 dark:bg-gray-300 text-black p-3 rounded-full hover:bg-gray-300 dark:hover:bg-gray-400 transition-colors shadow-lg"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-8 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex
                ? "bg-gray-500 dark:bg-gray-600"
                : "bg-gray-300 dark:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
