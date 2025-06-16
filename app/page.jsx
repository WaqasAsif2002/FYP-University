"use client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TestimonialSlider from "@/components/TestimonialSlider";
import { Car, Shield, Smartphone, Phone, Mail, MapPinIcon } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const handleBookNow = () => {
    router.push("/login");
  };

  const handleWhatsAppSupport = () => {
    window.open("https://wa.me/923343282332", "_blank");
  };

  const features = [
    {
      icon: <Car className="w-12 h-12 text-blue-400" />,
      title: "Instant Booking",
      description: "Reserve your parking spot in seconds with our quick booking system.",
    },
    {
      icon: <Shield className="w-12 h-12 text-green-400" />,
      title: "Secure Payment",
      description: "Safe and encrypted payment processing for peace of mind.",
    },
    {
      icon: <Smartphone className="w-12 h-12 text-purple-400" />,
      title: "Mobile Friendly",
      description: "Access our platform from any device, anywhere, anytime.",
    },
  ];

  const steps = [
    {
      number: 1,
      title: "Choose Your Spot",
      description: "Select from available parking spaces at Millennium Mall.",
      image: "/images/second.png",
    },
    {
      number: 2,
      title: "Book & Pay",
      description: "Secure your reservation with instant payment processing.",
      image: "/images/third.png",
    },
    {
      number: 3,
      title: "Park & Enjoy",
      description: "Arrive at your reserved spot and enjoy hassle-free parking.",
      image: "/images/images.jpeg",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="pt-20 pb-16 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Secure Your Pre-Parking Spot Instantly!
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Book parking spaces at Millennium Mall Karachi in advance. No more circling around looking for parking.
              </p>
              <button
                onClick={handleBookNow}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Book Now
              </button>
            </div>
            <div className="flex justify-center">
              <img
                src="/images/front.jpg"
                alt="Modern parking facility"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-16">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-xl bg-gray-700 hover:bg-gray-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="flex justify-center mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-8">About ParkEase</h2>
              <p className="text-xl text-gray-300 leading-relaxed mb-6">
                ParkEase revolutionizes parking at Millennium Mall Karachi by allowing customers to pre-book their
                parking spots.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                Our smart parking solution combines technology with convenience, making your mall visits more enjoyable
                and efficient.
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src="/images/firstone.png"
                alt="ParkEase app"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="mb-6">
                  <img
                    src={step.image}
                    alt={`Step ${step.number}`}
                    className="w-full h-48 object-cover rounded-lg shadow-lg"
                  />
                </div>
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">{step.title}</h3>
                <p className="text-gray-300 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-16">What Our Users Say</h2>
          <TestimonialSlider />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-16">Contact Us</h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <h3 className="text-2xl font-semibold text-white mb-8">Get in Touch</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Mail className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="font-semibold text-white">Email</p>
                    <p className="text-gray-300">waqas.khokhar2002@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="font-semibold text-white">Phone</p>
                    <p className="text-gray-300">03343282332</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <MapPinIcon className="w-6 h-6 text-red-400" />
                  <div>
                    <p className="font-semibold text-white">Address</p>
                    <p className="text-gray-300">Millennium Mall, Karachi, Pakistan</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={handleWhatsAppSupport}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center space-x-2 font-semibold"
                >
                  <Phone className="w-5 h-5" />
                  <span>WhatsApp Support</span>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-white mb-8">Send us a Message</h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    placeholder="Your email"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    placeholder="Your message"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
