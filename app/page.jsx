"use client"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import TestimonialSlider from "@/components/TestimonialSlider"
import ParkEaseChatbot from "@/components/ParkEaseChatbot"
import SweetAlertProvider from "@/components/SweetAlert"
import { Car, Shield, Smartphone, Phone, Mail, MapPinIcon } from "lucide-react"

export default function Home() {
  const router = useRouter()

  const handleBookNow = () => {
    router.push("/login")
  }

  const handleWhatsAppSupport = () => {
    window.open("https://wa.me/923343282332", "_blank")
  }

  const features = [
    {
      icon: <Car className="w-8 h-8 md:w-12 md:h-12 text-blue-400" />,
      title: "Instant Booking",
      description: "Reserve your parking spot in seconds with our quick booking system.",
    },
    {
      icon: <Shield className="w-8 h-8 md:w-12 md:h-12 text-green-400" />,
      title: "Secure Payment",
      description: "Safe and encrypted payment processing for peace of mind.",
    },
    {
      icon: <Smartphone className="w-8 h-8 md:w-12 md:h-12 text-purple-400" />,
      title: "Mobile Friendly",
      description: "Access our platform from any device, anywhere, anytime.",
    },
  ]

  const steps = [
    {
      number: 1,
      title: "Choose Your Spot",
      description: "Select from available parking spaces at Millennium Mall.",
      image: "/images/first.PNG",
    },
    {
      number: 2,
      title: "Book & Pay",
      description: "Secure your reservation with instant payment processing.",
      image: "/images/second.jpg",
    },
    {
      number: 3,
      title: "Park & Enjoy",
      description: "Arrive at your reserved spot and enjoy hassle-free parking.",
      image: "/images/third1.jpg",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <SweetAlertProvider />
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="pt-20 md:pt-24 pb-12 md:pb-16 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
                Secure Your Pre-Parking Spot Instantly!
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 leading-relaxed">
                Book parking spaces at Millennium Mall Karachi in advance. No more circling around looking for parking.
              </p>
              <button
                onClick={handleBookNow}
                className="bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg text-base md:text-lg font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Book Now
              </button>
            </div>
            <div className="flex justify-center mt-8 lg:mt-0">
              <img
                src="https://cdn.prod.website-files.com/621f6615a4c8a1d5166a4362/6261605ebd220a5d73b95f88_smart%20parking.png"
                alt="Modern parking facility"
                className="rounded-lg shadow-2xl w-full max-w-md lg:max-w-full h-auto object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://cdn.prod.website-files.com/621f6615a4c8a1d5166a4362/6261605ebd220a5d73b95f88_smart%20parking.png"
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8 md:mb-16">Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 md:p-8 rounded-xl bg-gray-700 hover:bg-gray-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="flex justify-center mb-4 md:mb-6">{feature.icon}</div>
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 md:py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 md:mb-8">About ParkEase</h2>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-4 md:mb-6">
                ParkEase revolutionizes parking at Millennium Mall Karachi by allowing customers to pre-book their
                parking spots.
              </p>
              <p className="text-base md:text-lg text-gray-400 leading-relaxed">
                Our smart parking solution combines technology with convenience, making your mall visits more enjoyable
                and efficient.
              </p>
            </div>
            <div className="flex justify-center mt-8 lg:mt-0">
              <img
                src="https://img.freepik.com/premium-photo/aerial-view-large-open-air-parking-lot-cars-residents-area_97694-15429.jpg"
                alt="ParkEase app"
                className="rounded-lg shadow-xl w-full max-w-md lg:max-w-full h-auto object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://img.freepik.com/premium-photo/aerial-view-large-open-air-parking-lot-cars-residents-area_97694-15429.jpg"
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 md:py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8 md:mb-16">How It Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 md:mb-6">
                  <img
                    src={step.image || "/placeholder.svg"}
                    alt={`Step ${step.number}`}
                    className="w-full h-32 md:h-48 object-cover rounded-lg shadow-lg"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                    }}
                  />
                </div>
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg md:text-2xl font-bold mx-auto mb-3 md:mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4">{step.title}</h3>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-12 md:py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8 md:mb-16">What Our Users Say</h2>
          <TestimonialSlider />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 md:py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8 md:mb-16">Contact Us</h2>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-6 md:mb-8">Get in Touch</h3>
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center space-x-4">
                  <Mail className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                  <div>
                    <p className="font-semibold text-white text-sm md:text-base">Email</p>
                    <p className="text-gray-300 text-sm md:text-base">waqas.khokhar2002@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                  <div>
                    <p className="font-semibold text-white text-sm md:text-base">Phone</p>
                    <p className="text-gray-300 text-sm md:text-base">03343282332</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <MapPinIcon className="w-5 h-5 md:w-6 md:h-6 text-red-400" />
                  <div>
                    <p className="font-semibold text-white text-sm md:text-base">Address</p>
                    <p className="text-gray-300 text-sm md:text-base">Millennium Mall, Karachi, Pakistan</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 md:mt-8">
                <button
                  onClick={handleWhatsAppSupport}
                  className="bg-green-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center space-x-2 font-semibold text-sm md:text-base"
                >
                  <Phone className="w-4 h-4 md:w-5 md:h-5" />
                  <span>WhatsApp Support</span>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-6 md:mb-8">Send us a Message</h3>
              <form className="space-y-4 md:space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2 text-sm md:text-base">Name</label>
                  <input
                    type="text"
                    className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white text-sm md:text-base"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2 text-sm md:text-base">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white text-sm md:text-base"
                    placeholder="Your email"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2 text-sm md:text-base">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white text-sm md:text-base"
                    placeholder="Your message"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 md:py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold text-sm md:text-base"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ParkEaseChatbot />
    </div>
  )
}
