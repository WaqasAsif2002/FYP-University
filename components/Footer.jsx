"use client";

import { Github, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const handleGithubClick = () => {
    window.open("https://github.com/waqasasif2002", "_blank");
  };

  const handleLinkedinClick = () => {
    window.open("https://www.linkedin.com/in/mohammad-waqas-7a98aa1ab/", "_blank");
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">ParkEase</h3>
            <p className="text-gray-300 dark:text-gray-400 mb-4">
              Smart parking solutions for Millennium Mall Karachi. Book your spot in advance and enjoy hassle-free
              parking.
            </p>
            <div className="flex space-x-4">
              <Github
                className="w-5 h-5 text-gray-300 dark:text-gray-400 hover:text-white cursor-pointer transition-colors"
                onClick={handleGithubClick}
              />
              <Linkedin
                className="w-5 h-5 text-gray-300 dark:text-gray-400 hover:text-white cursor-pointer transition-colors"
                onClick={handleLinkedinClick}
              />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#features" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-300 dark:text-gray-400">Parking Reservation</span>
              </li>
              <li>
                <span className="text-gray-300 dark:text-gray-400">Real-time Availability</span>
              </li>
              <li>
                <span className="text-gray-300 dark:text-gray-400">Mobile Payments</span>
              </li>
              <li>
                <span className="text-gray-300 dark:text-gray-400">24/7 Support</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-300 dark:text-gray-400" />
                <span className="text-gray-300 dark:text-gray-400">waqas.khokhar2002@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-300 dark:text-gray-400" />
                <span className="text-gray-300 dark:text-gray-400">03343282332</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-300 dark:text-gray-400" />
                <span className="text-gray-300 dark:text-gray-400">Millennium Mall, Karachi</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-300 dark:text-gray-400">
            © {new Date().getFullYear()} ParkEase. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
