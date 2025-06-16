"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Car, Calendar, User, LogOut, Plus, MapPin, HelpCircle } from "lucide-react"
import NearbyAmenities from "@/components/NearbyAmenities"
import ThemeToggle from "@/components/ThemeToggle"
import DateTimeRangePicker from "@/components/DateTimeRangePicker"
import FAQAccordion from "@/components/FAQAccordion"
import EasyPaisaPayment from "@/components/EasyPaisaPayment"
import { generateBookingPDF } from "@/components/PDFGenerator"

export default function UserDashboard() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("overview")
  const [userData, setUserData] = useState(null)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [bookings, setBookings] = useState([])
  const [availableSlots, setAvailableSlots] = useState([])
  const [bookingForm, setBookingForm] = useState({
    slot: "",
    startDateTime: "",
    endDateTime: "",
    carNumber: "",
    whatsapp: "",
    paymentMethod: "cash", // Default to cash
  })
  const [currentBooking, setCurrentBooking] = useState(null)
  const [showEasyPaisaPayment, setShowEasyPaisaPayment] = useState(false)

  // FAQ data
  const faqData = [
    {
      question: "How does ParkEase work?",
      answer:
        "ParkEase allows you to reserve parking spots at Millennium Mall in advance. Simply select your desired time slot, make a payment, and your spot will be reserved. When you arrive, show your booking confirmation to the parking attendant.",
    },
    {
      question: "What payment methods are accepted?",
      answer: "We currently accept Cash and EasyPaisa as payment methods. More payment options will be added soon.",
    },
    {
      question: "Can I cancel my booking?",
      answer:
        "Yes, you can cancel your booking up to 2 hours before the scheduled time. A full refund will be processed to your original payment method.",
    },
    {
      question: "What if I arrive late for my booking?",
      answer:
        "We provide a 15-minute grace period for all bookings. If you're running late, please contact our support team through the WhatsApp button provided in your booking confirmation.",
    },
    {
      question: "Is there a maximum booking duration?",
      answer:
        "Yes, the maximum booking duration is 10 hours. For longer durations, please make multiple bookings or contact our support team for special arrangements.",
    },
    {
      question: "What happens if all parking slots are booked?",
      answer:
        "If all slots are booked, you'll need to select a different time or date. We recommend booking in advance, especially during weekends and holidays.",
    },
    {
      question: "How do I find my parking spot when I arrive?",
      answer:
        "Each parking spot is clearly marked with its slot number (e.g., A15). Our parking attendants will also be available to guide you to your reserved spot.",
    },
  ]

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setUserData(user)
      setBookingForm((prev) => ({
        ...prev,
        carNumber: user.carNumber || "",
        whatsapp: user.whatsapp || "",
        paymentMethod: "cash",
      }))
    }

    // Initialize available slots
    const slots = []
    for (let i = 1; i <= 80; i++) {
      slots.push({
        id: `A${i}`,
        available: Math.random() > 0.3,
      })
    }
    setAvailableSlots(slots)

    // Load existing bookings
    const existingBookings = JSON.parse(localStorage.getItem("userBookings") || "[]")
    setBookings(existingBookings)

    // Set default start and end times for booking form
    const now = new Date()
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000)

    setBookingForm((prev) => ({
      ...prev,
      startDateTime: now.toISOString().slice(0, 16),
      endDateTime: oneHourLater.toISOString().slice(0, 16),
    }))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  // Validation functions
  const validatePakistaniNumber = (number) => {
    // Pakistani mobile number format: +92XXXXXXXXXX or 03XXXXXXXXX
    const pakistaniNumberRegex = /^(\+92|0)?3[0-9]{9}$/
    return pakistaniNumberRegex.test(number.replace(/\s|-/g, ""))
  }

  const validateCarNumber = (carNumber) => {
    // Pakistani car number format: ABC-123 (3 letters, dash, 3 numbers)
    const carNumberRegex = /^[A-Z]{3}-[0-9]{3}$/
    return carNumberRegex.test(carNumber.toUpperCase())
  }

  const handleBookingInputChange = (e) => {
    const { name, value } = e.target

    if (name === "carNumber") {
      // Auto-format car number
      let formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "")
      if (formattedValue.length > 3) {
        formattedValue = formattedValue.slice(0, 3) + "-" + formattedValue.slice(3, 6)
      }
      setBookingForm((prev) => ({
        ...prev,
        [name]: formattedValue,
      }))
    } else if (name === "whatsapp") {
      // Auto-format Pakistani number
      let formattedValue = value.replace(/[^0-9+]/g, "")
      if (formattedValue.startsWith("0")) {
        formattedValue = "+92" + formattedValue.slice(1)
      } else if (!formattedValue.startsWith("+92")) {
        formattedValue = "+92" + formattedValue
      }
      setBookingForm((prev) => ({
        ...prev,
        [name]: formattedValue,
      }))
    } else {
      setBookingForm((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleBookingSubmit = (e) => {
    e.preventDefault()

    if (!bookingForm.slot || !bookingForm.startDateTime || !bookingForm.endDateTime) {
      alert("Please fill in all required fields")
      return
    }

    // Calculate hours from datetime range
    const startTime = new Date(bookingForm.startDateTime).getTime()
    const endTime = new Date(bookingForm.endDateTime).getTime()
    const diffHours = Math.ceil((endTime - startTime) / (1000 * 60 * 60))

    // Validate hours (1-10)
    if (diffHours < 1 || diffHours > 10) {
      alert("Booking duration must be between 1 and 10 hours")
      return
    }

    // Validate Pakistani phone number
    if (bookingForm.whatsapp && !validatePakistaniNumber(bookingForm.whatsapp)) {
      alert("Please enter a valid Pakistani mobile number (e.g., +923001234567 or 03001234567)")
      return
    }

    // Validate car number
    if (bookingForm.carNumber && !validateCarNumber(bookingForm.carNumber)) {
      alert("Please enter a valid car number in format: ABC-123 (3 letters, dash, 3 numbers)")
      return
    }

    // Replace the JazzCash check with EasyPaisa
    if (bookingForm.paymentMethod === "easypaisa") {
      setShowEasyPaisaPayment(true)
      return
    }

    // For cash payment, proceed with booking
    const newBooking = {
      id: Date.now(),
      ...bookingForm,
      hours: diffHours,
      totalAmount: diffHours * 100,
      bookingDate: new Date().toISOString(),
      status: "Confirmed",
      paymentMethod: bookingForm.paymentMethod,
    }

    const updatedBookings = [...bookings, newBooking]
    setBookings(updatedBookings)
    localStorage.setItem("userBookings", JSON.stringify(updatedBookings))

    setAvailableSlots((prev) =>
      prev.map((slot) => (slot.id === bookingForm.slot ? { ...slot, available: false } : slot)),
    )

    setCurrentBooking(newBooking)
    setShowBookingForm(false)
    setShowReceipt(true)

    // Reset form
    const now = new Date()
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000)

    setBookingForm({
      slot: "",
      startDateTime: now.toISOString().slice(0, 16),
      endDateTime: oneHourLater.toISOString().slice(0, 16),
      carNumber: userData?.carNumber || "",
      whatsapp: userData?.whatsapp || "",
      paymentMethod: "cash",
    })
  }

  const generateQRCode = () => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Booking-${currentBooking?.id}`
  }

  const downloadReceipt = () => {
    if (!currentBooking) return
    generateBookingPDF(currentBooking)
  }

  const sendWhatsAppConfirmation = () => {
    alert("WhatsApp confirmation sent successfully!")
  }

  const handleEasyPaisaComplete = () => {
    // Calculate hours from datetime range
    const startTime = new Date(bookingForm.startDateTime).getTime()
    const endTime = new Date(bookingForm.endDateTime).getTime()
    const diffHours = Math.ceil((endTime - startTime) / (1000 * 60 * 60))

    const newBooking = {
      id: Date.now(),
      ...bookingForm,
      hours: diffHours,
      totalAmount: diffHours * 100,
      bookingDate: new Date().toISOString(),
      status: "Confirmed",
      paymentMethod: "easypaisa",
    }

    const updatedBookings = [...bookings, newBooking]
    setBookings(updatedBookings)
    localStorage.setItem("userBookings", JSON.stringify(updatedBookings))

    setAvailableSlots((prev) =>
      prev.map((slot) => (slot.id === bookingForm.slot ? { ...slot, available: false } : slot)),
    )

    setCurrentBooking(newBooking)
    setShowEasyPaisaPayment(false)
    setShowReceipt(true)

    // Reset form
    const now = new Date()
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000)

    setBookingForm({
      slot: "",
      startDateTime: now.toISOString().slice(0, 16),
      endDateTime: oneHourLater.toISOString().slice(0, 16),
      carNumber: userData?.carNumber || "",
      whatsapp: userData?.whatsapp || "",
      paymentMethod: "cash",
    })
  }

  const viewBookingDetails = (booking) => {
    setCurrentBooking(booking)
    setShowReceipt(true)
  }

  const formatDateTime = (dateTimeStr) => {
    try {
      return new Date(dateTimeStr).toLocaleString()
    } catch (e) {
      return dateTimeStr
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-black dark:text-white">Welcome, {userData?.name || "User"}!</h1>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-black dark:text-white mb-4">Parking Overview</h2>
                <div className="flex justify-center space-x-8 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {availableSlots.filter((slot) => slot.available).length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Available Slots</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                      {availableSlots.filter((slot) => !slot.available).length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Occupied Slots</div>
                  </div>
                </div>
                <button
                  onClick={() => setShowBookingForm(true)}
                  className="w-full bg-black dark:bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-semibold"
                >
                  Book Now
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Available Parking Slots</h3>
                <div className="grid grid-cols-8 gap-1 mb-4">
                  {availableSlots.slice(0, 32).map((slot) => (
                    <div
                      key={slot.id}
                      className={`aspect-square flex items-center justify-center text-xs font-semibold rounded ${
                        slot.available
                          ? "bg-green-200 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-800 dark:text-green-300"
                          : "bg-red-200 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-800 dark:text-red-300"
                      }`}
                    >
                      {slot.id}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing first 32 slots. Total: {availableSlots.length} slots available.
                </p>
              </div>
            </div>
          </div>
        )

      case "bookings":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-black dark:text-white">My Bookings</h1>
              <button
                onClick={() => setShowBookingForm(true)}
                className="bg-black dark:bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Booking</span>
              </button>
            </div>

            {bookings.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 p-12 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-center">
                <Car className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-xl text-gray-600 dark:text-gray-300">No bookings found</p>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Book your first parking slot!</p>
                <button
                  onClick={() => setShowBookingForm(true)}
                  className="bg-black dark:bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                >
                  Book Now
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Slot</p>
                          <p className="font-semibold text-black dark:text-white">{booking.slot}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Time</p>
                          <p className="font-semibold text-black dark:text-white">
                            {formatDateTime(booking.startDateTime)} - {formatDateTime(booking.endDateTime)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Car</p>
                          <p className="font-semibold text-black dark:text-white">{booking.carNumber}</p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            booking.status === "Confirmed"
                              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {booking.status}
                        </span>
                        <p className="text-xl font-bold text-black dark:text-white mt-2">Rs. {booking.totalAmount}</p>
                        <button
                          onClick={() => viewBookingDetails(booking)}
                          className="mt-2 bg-black dark:bg-gray-700 text-white px-4 py-1 rounded hover:bg-gray-800 dark:hover:bg-gray-600 text-sm"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case "amenities":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-black dark:text-white">Nearby Amenities</h1>
            <NearbyAmenities />
          </div>
        )

      case "faq":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-black dark:text-white">Frequently Asked Questions</h1>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <FAQAccordion faqs={faqData} />
            </div>
          </div>
        )

      case "profile":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-black dark:text-white">Profile</h1>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 max-w-2xl">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Name</label>
                  <p className="text-lg text-black dark:text-white">{userData?.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
                  <p className="text-lg text-black dark:text-white">{userData?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">WhatsApp</label>
                  <p className="text-lg text-black dark:text-white">{userData?.whatsapp}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Car Number</label>
                  <p className="text-lg text-black dark:text-white">{userData?.carNumber}</p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return <div>Select a section from the sidebar</div>
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar className="border-r border-gray-200 dark:border-gray-700">
          <SidebarHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-black dark:text-white">User Panel</h2>
          </SidebarHeader>
          <SidebarContent className="p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveSection("overview")}
                  isActive={activeSection === "overview"}
                  className="w-full justify-start text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Car className="w-4 h-4 mr-2" />
                  Overview
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveSection("bookings")}
                  isActive={activeSection === "bookings"}
                  className="w-full justify-start text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  My Bookings
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveSection("amenities")}
                  isActive={activeSection === "amenities"}
                  className="w-full justify-start text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Nearby Amenities
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveSection("faq")}
                  isActive={activeSection === "faq"}
                  className="w-full justify-start text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  FAQ
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveSection("profile")}
                  isActive={activeSection === "profile"}
                  className="w-full justify-start text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="w-full justify-start text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="flex h-16 items-center justify-between gap-2 border-b border-gray-200 dark:border-gray-700 px-6 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold text-black dark:text-white">User Dashboard</h1>
            </div>
            <ThemeToggle />
          </header>
          <main className="flex-1 p-6">{renderContent()}</main>
        </SidebarInset>
      </div>

      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-black dark:text-white mb-4">Book Parking Slot</h2>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">Select Slot *</label>
                <select
                  name="slot"
                  value={bookingForm.slot}
                  onChange={handleBookingInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-black dark:text-white bg-white dark:bg-gray-700"
                  required
                >
                  <option value="">Choose a slot</option>
                  {availableSlots
                    .filter((slot) => slot.available)
                    .map((slot) => (
                      <option key={slot.id} value={slot.id}>
                        {slot.id}
                      </option>
                    ))}
                </select>
              </div>

              <DateTimeRangePicker
                startDateTime={bookingForm.startDateTime}
                endDateTime={bookingForm.endDateTime}
                onStartChange={(value) => setBookingForm({ ...bookingForm, startDateTime: value })}
                onEndChange={(value) => setBookingForm({ ...bookingForm, endDateTime: value })}
              />

              <div>
                <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">Car Number</label>
                <input
                  type="text"
                  name="carNumber"
                  value={bookingForm.carNumber}
                  onChange={handleBookingInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-black dark:text-white bg-white dark:bg-gray-700"
                  placeholder="ABC-123 (3 letters, dash, 3 numbers)"
                  maxLength={7}
                />
                <small className="text-gray-600 dark:text-gray-400">Format: ABC-123 (e.g., KHI-123, LHR-456)</small>
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">WhatsApp Number</label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={bookingForm.whatsapp}
                  onChange={handleBookingInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-black dark:text-white bg-white dark:bg-gray-700"
                  placeholder="+923001234567 or 03001234567"
                />
                <small className="text-gray-600 dark:text-gray-400">Pakistani mobile number for confirmation</small>
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">Payment Method</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={bookingForm.paymentMethod === "cash"}
                      onChange={(e) => setBookingForm({ ...bookingForm, paymentMethod: e.target.value })}
                      className="mr-2"
                    />
                    <span className="text-black dark:text-white">💵 Cash</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="easypaisa"
                      checked={bookingForm.paymentMethod === "easypaisa"}
                      onChange={(e) => setBookingForm({ ...bookingForm, paymentMethod: e.target.value })}
                      className="mr-2"
                    />
                    <span className="text-black dark:text-white">📱 EasyPaisa</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-black dark:bg-gray-700 text-white py-2 rounded hover:bg-gray-800 dark:hover:bg-gray-600"
                >
                  Confirm Booking
                </button>
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-black dark:text-white py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEasyPaisaPayment && (
        <EasyPaisaPayment
          amount={(() => {
            const startTime = new Date(bookingForm.startDateTime).getTime()
            const endTime = new Date(bookingForm.endDateTime).getTime()
            const diffHours = Math.ceil((endTime - startTime) / (1000 * 60 * 60))
            return diffHours * 100
          })()}
          onPaymentComplete={handleEasyPaisaComplete}
          onCancel={() => setShowEasyPaisaPayment(false)}
        />
      )}

      {showReceipt && currentBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-black dark:text-white mb-4">Booking Details</h2>

            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold text-black dark:text-white mb-2">Booking Information</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Booking ID:</strong> {currentBooking.id}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Slot:</strong> {currentBooking.slot}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Start Time:</strong> {formatDateTime(currentBooking.startDateTime)}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>End Time:</strong> {formatDateTime(currentBooking.endDateTime)}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Duration:</strong> {currentBooking.hours} hour(s)
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Car Number:</strong> {currentBooking.carNumber}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Payment Method:</strong>{" "}
                    {currentBooking.paymentMethod === "easypaisa" ? "EasyPaisa" : "Cash"}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Total Amount:</strong> Rs. {currentBooking.totalAmount}
                  </p>
                </div>
              </div>

              <div className="text-center">
                <h4 className="font-semibold text-black dark:text-white mb-2">QR Code</h4>
                <img
                  src={generateQRCode() || "/placeholder.svg"}
                  alt="Booking QR Code"
                  className="mx-auto border rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={downloadReceipt}
                  className="bg-black dark:bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-800 dark:hover:bg-gray-600"
                >
                  Download PDF
                </button>
                <button
                  onClick={sendWhatsAppConfirmation}
                  className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                >
                  Send WhatsApp
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowReceipt(false)}
              className="w-full bg-gray-300 dark:bg-gray-600 text-black dark:text-white py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </SidebarProvider>
  )
}
