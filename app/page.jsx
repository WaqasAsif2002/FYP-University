"use client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TestimonialSlider from "@/components/TestimonialSlider";
import ParkEaseChatbot from "@/components/ParkEaseChatbot";
import SweetAlertProvider from "@/components/SweetAlert";
// import emailjs from "emailjs-com";
import { useRef } from "react";
import { Car, Shield, Smartphone, Phone, Mail, MapPinIcon } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const form = useRef();

  const handleBookNow = () => {
    router.push("/login");
  };

  const handleWhatsAppSupport = () => {
    window.open("https://wa.me/923343282332", "_blank");
  };

 const handleEmailSupport = () => {
  window.open("mailto:waqas.khokhar2002@gmail.com", "_blank");
};


//  const sendEmail = (e) => {
//   e.preventDefault();
//   emailjs
//     .sendForm(
//       "service_nlaoayh",         // ✅ Service ID
//       "template_l6fbbi6",        // ✅ Template ID
//       form.current,
//       "giW9Anq6NY_uCHNrO"        // ✅ Public Key
//     )
//     .then(() => {
//       alert("Message sent successfully!");
//       form.current.reset();
//     })
//     .catch(() => {
//       alert("Failed to send message. Please try again.");
//     });
// };


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
  ];

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
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <SweetAlertProvider />
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="pt-20 md:pt-24 pb-12 md:pb-16 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
                Secure Your Pre-Parking Spot Instantly!
              </h1>
              <p className="text-xl text-gray-300 mb-6">
                Book parking spaces at Millennium Mall Karachi in advance. No more circling around looking for parking.
              </p>
              <button
                onClick={handleBookNow}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
              >
                Book Now
              </button>
            </div>
            <div className="flex justify-center">
              <img
                src="https://cdn.prod.website-files.com/621f6615a4c8a1d5166a4362/6261605ebd220a5d73b95f88_smart%20parking.png"
                alt="Modern parking"
                className="rounded-lg shadow-2xl max-w-md w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-16">Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-xl bg-gray-700 hover:bg-gray-600 transition shadow-lg"
              >
                <div className="flex justify-center mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
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
                  e.currentTarget.src = "https://img.freepik.com/premium-photo/aerial-view-large-open-air-parking-lot-cars-residents-area_97694-15429.jpg";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-16">How It Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <img
                  src={step.image}
                  alt={`Step ${step.number}`}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-16">What Our Users Say</h2>
          <TestimonialSlider />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-16">Contact Us</h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <h3 className="text-2xl font-semibold text-white mb-6">Get in Touch</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Mail className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="text-white font-semibold">Email</p>
                    <p className="text-gray-300">waqas.khokhar2002@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="text-white font-semibold">Phone</p>
                    <p className="text-gray-300">03343282332</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <MapPinIcon className="w-6 h-6 text-red-400" />
                  <div>
                    <p className="text-white font-semibold">Address</p>
                    <p className="text-gray-300">Millennium Mall, Karachi</p>
                  </div>
                </div>
                <button
                  onClick={handleWhatsAppSupport}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 flex items-center space-x-2"
                >
                  <Phone className="w-5 h-5" />
                  <span>WhatsApp Support</span>
                </button>

                <button
  onClick={handleEmailSupport}
  className="flex items-center gap-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-300"
>
  <Mail className="w-5 h-5" />
  <span>Email Support</span>
</button>

              </div>
            </div>

          {/* <div>
  <h3 className="text-2xl font-semibold text-white mb-6">Send us a Message</h3>
  <form ref={form} onSubmit={sendEmail} className="space-y-6">
    <input
      type="text"
      name="from_name"
      required
      placeholder="Your Name"
      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
    />
    <input
      type="email"
      name="reply_to"
      required
      placeholder="Your Email"
      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
    />
    <textarea
      name="message"
      required
      rows="5"
      placeholder="Your Message"
      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
    />
    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
    >
      Send Message
    </button>
  </form>
</div> */}
{/* <section id="location" className="py-20 bg-gray-800"> */}
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-8">Our Location</h2>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <iframe
              title="Millennium Mall Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.929196602472!2d67.08733731500117!3d24.861578284048816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e72569c88d1%3A0x90a5f5c0f7f4dc4a!2sMillennium%20Mall!5e0!3m2!1sen!2s!4v1627020609920!5m2!1sen!2s"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              className="w-full h-96 border-0"
            ></iframe>
          </div>
        </div>
      {/* </section> */}



          </div>
        </div>
      </section>

      {/* Map Section */}
      

      <Footer />
      <ParkEaseChatbot />
    </div>
  );
}
