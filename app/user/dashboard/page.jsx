"use client";
import { supabase } from "@/lib/createClient";
import { useUser } from "@/context/context";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
} from "@/components/ui/sidebar";
import {
  Car,
  Calendar,
  User,
  LogOut,
  Plus,
  MapPin,
  HelpCircle,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";
import NearbyAmenities from "@/components/NearbyAmenities";
import ThemeToggle from "@/components/ThemeToggle";
import DateTimeRangePicker from "@/components/DateTimeRangePicker";
import FAQAccordion from "@/components/FAQAccordion";
import EasyPaisaPayment from "@/components/EasyPaisaPayment";
import { generateBookingPDF } from "@/components/PDFGenerator";
import ParkEaseChatbot from "@/components/ParkEaseChatbot";
import SweetAlertProvider, {
  showSuccess,
  showError,
  showWarning,
} from "@/components/SweetAlert";

export default function UserDashboard() {
  const router = useRouter();
  const {
    user,
    authUser,
    bookingData,
    admin,
    allUsers,
    loading,
    authLoading,
    logout,
    slot,
  } = useUser();

  const [activeSection, setActiveSection] = useState("overview");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookingForm, setBookingForm] = useState({
    slot: "",
    startDateTime: "",
    endDateTime: "",
    carNumber: "",
    whatsapp: "",
    paymentMethod: "cash",
  });
  const [currentBooking, setCurrentBooking] = useState(null);
  const [showEasyPaisaPayment, setShowEasyPaisaPayment] = useState(false);

  useEffect(() => {
    setAvailableSlots(slot);
    setBookingForm({
      slot: "",
      carNumber: user?.carNum,
      whatsapp: user?.whatsapp,
      paymentMethod: "cash",
    });
    setBookings(bookingData);
  }, [
    authUser,
    bookingData,
    admin,
    allUsers,
    loading,
    authLoading,
    slot,
    user,
  ]);

  const userBookings = user
    ? bookings.filter((booking) => booking.userId === user.userId)
    : [];
  // FAQ data
  const faqData = [
    {
      question: "How does ParkEase work?",
      answer:
        "ParkEase allows you to reserve parking spots at Millennium Mall in advance. Simply select your desired time slot, make a payment, and your spot will be reserved. When you arrive, show your booking confirmation to the parking attendant.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We currently accept Cash and EasyPaisa as payment methods. More payment options will be added soon.",
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
  ];

  useEffect(() => {
    // Set default start and end times for booking form
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    setBookingForm((prev) => ({
      ...prev,
      startDateTime: now.toISOString().slice(0, 16),
      endDateTime: oneHourLater.toISOString().slice(0, 16),
    }));
  }, []);

  const getActiveBookingsCount = () => {
    return bookings.filter(
      (booking) =>
        booking.status === "Confirmed" &&
        new Date(booking.endDateTime) > new Date()
    ).length;
  };

  const getSlotAvailabilityTime = (slot) => {
    const slotBookings = bookings.filter(
      (booking) =>
        booking.slotId === slot &&
        !booking.status &&
        new Date(booking.bookingEndTime) > new Date()
    );

    if (slotBookings.length === 0) return null;

    const latestEndTime = Math.max(
      ...slotBookings.map((booking) =>
        new Date(booking.bookingEndTime).getTime()
      )
    );

    const now = new Date().getTime();
    const minutesUntilFree = Math.ceil((latestEndTime - now) / (1000 * 60));

    return minutesUntilFree > 0 ? minutesUntilFree : 0;
  };

  // Validation functions
  const validatePakistaniNumber = (number) => {
    const pakistaniNumberRegex = /^(\+92|0)?3[0-9]{9}$/;
    return pakistaniNumberRegex.test(number.replace(/\s|-/g, ""));
  };

  const validateCarNumber = (carNumber) => {
    const carNumberRegex = /^[A-Z]{3}-[0-9]{3}$/;
    return carNumberRegex.test(carNumber.toUpperCase());
  };

  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "carNumber") {
      let formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
      if (formattedValue.length > 3) {
        formattedValue =
          formattedValue.slice(0, 3) + "-" + formattedValue.slice(3, 6);
      }
      setBookingForm((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else if (name === "whatsapp") {
      let formattedValue = value.replace(/[^0-9+]/g, "");
      if (formattedValue.startsWith("0")) {
        formattedValue = "+92" + formattedValue.slice(1);
      } else if (!formattedValue.startsWith("+92")) {
        formattedValue = "+92" + formattedValue;
      }
      setBookingForm((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else {
      setBookingForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    // Check booking limit
    const activeBookingsCount = getActiveBookingsCount();
    if (activeBookingsCount >= 3) {
      showWarning(
        "You can have maximum 3 active bookings at a time. Please complete your previous bookings to make new ones."
      );
      return;
    }

    if (
      !bookingForm.slot ||
      !bookingForm.startDateTime ||
      !bookingForm.endDateTime
    ) {
      showError("Please fill in all required fields");
      return;
    }

    // Calculate hours from datetime range
    const startTime = new Date(bookingForm.startDateTime).getTime();
    const endTime = new Date(bookingForm.endDateTime).getTime();
    const diffHours = Math.ceil((endTime - startTime) / (1000 * 60 * 60));

    // Validate hours (1-10)
    if (diffHours < 1 || diffHours > 10) {
      showError("Booking duration must be between 1 and 10 hours");
      return;
    }

    // Validate Pakistani phone number
    if (
      bookingForm.whatsapp &&
      !validatePakistaniNumber(bookingForm.whatsapp)
    ) {
      showError(
        "Please enter a valid Pakistani mobile number (e.g., +923001234567 or 03001234567)"
      );
      return;
    }

    // Validate car number
    if (bookingForm.carNumber && !validateCarNumber(bookingForm.carNumber)) {
      showError(
        "Please enter a valid car number in format: ABC-123 (3 letters, dash, 3 numbers)"
      );
      return;
    }

    if (bookingForm.paymentMethod === "easypaisa") {
      setShowEasyPaisaPayment(true);
      return;
    }

    // For cash payment, proceed with booking
    const newBooking = {
      ...bookingForm,
      hours: diffHours,
      totalAmount: diffHours * 100, // Same price for cash
      bookingDate: new Date().toISOString(),
      status: "Confirmed",
      paymentMethod: bookingForm.paymentMethod,
    };

    try {
      const { error } = await supabase.from("bookings").insert({
        userId: user.userId,
        userName: user.fullName,
        slotId: newBooking.slot,
        duration: newBooking.hours,
        totalPrice: newBooking.totalAmount,
        carNum: newBooking.carNumber,
        whatsapp: newBooking.whatsapp,
        paymentMethod: newBooking.paymentMethod,
        status: false,
        bookingEndTime: newBooking.endDateTime,
      });
    } catch (error) {
      console.log(error);
    }

    try {
      const { error } = await supabase
        .from("parkingSlot")
        .update({
          status: false,
          pph: newBooking.totalAmount,
        })
        .eq("id", bookingForm.slot);
    } catch (error) {
      console.log(error);
    }

    setAvailableSlots((prev) =>
      prev.map((slot) =>
        slot.id === bookingForm.slot ? { ...slot, available: false } : slot
      )
    );

    setCurrentBooking(newBooking);
    setShowBookingForm(false);
    setShowReceipt(true);

    // Reset form
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    setBookingForm({
      slot: "",
      startDateTime: now.toISOString().slice(0, 16),
      endDateTime: oneHourLater.toISOString().slice(0, 16),
      carNumber: bookingForm.carNumber,
      whatsapp: bookingForm.whatsapp,
      paymentMethod: "cash",
    });

    showSuccess("Booking confirmed successfully!");
  };

  const generateQRCode = () => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Booking-${currentBooking?.id}`;
  };

  const downloadReceipt = () => {
    if (!currentBooking) return;
    const updatedUserBooking = {
      ...currentBooking,
      fullName: user?.fullName,
    };
    generateBookingPDF(updatedUserBooking, bookings.length);
    showSuccess("Receipt downloaded successfully!");
  };

  const sendWhatsAppConfirmation = () => {
    showSuccess("WhatsApp confirmation sent successfully!");
  };

  const handleEasyPaisaComplete = async () => {
    const startTime = new Date(bookingForm.startDateTime).getTime();
    const endTime = new Date(bookingForm.endDateTime).getTime();
    const diffHours = Math.ceil((endTime - startTime) / (1000 * 60 * 60));

    const newBooking = {
      ...bookingForm,
      hours: diffHours,
      totalAmount: diffHours * 100 - diffHours * 10, // Apply discount for EasyPaisa
      bookingDate: new Date().toISOString(),
      status: "Confirmed",
      paymentMethod: "easypaisa",
    };
    try {
      const { error } = await supabase.from("bookings").insert({
        userId: user.userId,
        userName: user.fullName,
        slotId: newBooking.slot,
        duration: newBooking.hours,
        totalPrice: newBooking.totalAmount,
        carNum: newBooking.carNumber,
        whatsapp: newBooking.whatsapp,
        paymentMethod: newBooking.paymentMethod,
        status: false,
        bookingEndTime: newBooking.endDateTime,
      });
    } catch (error) {
      console.log(error);
    }
    try {
      const { error } = await supabase
        .from("parkingSlot")
        .update({
          status: false,
          pph: newBooking.totalAmount,
        })
        .eq("id", bookingForm.slot);
    } catch (error) {
      console.log(error);
    }

    setCurrentBooking(newBooking);
    setShowEasyPaisaPayment(false);
    setShowReceipt(true);

    // Reset form
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    setBookingForm({
      slot: "",
      startDateTime: now.toISOString().slice(0, 16),
      endDateTime: oneHourLater,
      carNumber: bookingForm.carNumber,
      whatsapp: bookingForm.whatsapp,
      paymentMethod: "cash",
    });
    showSuccess("EasyPaisa payment completed successfully!");
  };

  const viewBookingDetails = (booking) => {
    setCurrentBooking(booking);
    setShowReceipt(true);
  };

  const formatDateTime = (dateTimeStr) => {
    try {
      return new Date(dateTimeStr).toLocaleString();
    } catch (e) {
      return dateTimeStr;
    }
  };

  const handleSlotSelection = (e) => {
    const selectedSlotId = e.target.value;
    const selectedSlot = availableSlots.find((s) => s.id === selectedSlotId);

    if (selectedSlot && !selectedSlot.available) {
      const minutesUntilFree = getSlotAvailabilityTime(selectedSlotId);
      showWarning(
        `Slot ${selectedSlotId} is currently occupied and will be free in ${
          minutesUntilFree || "Unknown"
        } minutes. Please select another slot or wait.`
      );
      return;
    }

    handleBookingInputChange(e);
  };

  const handleWhatsAppContact = () => {
    window.open("https://wa.me/923343282332", "_blank");
  };

  const handleEmailContact = () => {
    window.open("mailto:waqas.khokhar2002@gmail.com", "_blank");
  };

  const handlePhoneContact = () => {
    window.open("tel:03343282332", "_blank");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white">
              Welcome, {user?.fullName || "User"}!
            </h1>

            {/* EasyPaisa Special Offer - Top Banner */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 md:p-6 rounded-lg shadow-md text-white">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left mb-3 md:mb-0">
                  <h3 className="text-lg md:text-xl font-semibold mb-1">
                    💰 Special EasyPaisa Offer!
                  </h3>
                  <p className="text-sm md:text-base">
                    Get Rs. 10 discount per hour when you pay with EasyPaisa!
                  </p>
                  <p className="text-xs md:text-sm opacity-90">
                    Example: 2 hours = Rs. 200 → Pay only Rs. 180 with EasyPaisa
                  </p>
                </div>
                <div className="bg-white/20 px-3 py-2 rounded-lg">
                  <span className="text-sm font-semibold">
                    📱 EasyPaisa: 0334-3282332
                  </span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg md:text-xl font-semibold text-black dark:text-white mb-4">
                  Parking Overview
                </h2>
                <div className="flex justify-center space-x-6 md:space-x-8 mb-4 md:mb-6">
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
                      {availableSlots.filter((slot) => slot.status).length}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                      Available Slots
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-red-600 dark:text-red-400">
                      {availableSlots.filter((slot) => !slot.status).length}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                      Occupied Slots
                    </div>
                  </div>
                </div>
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Active Bookings: {getActiveBookingsCount()}/3
                  </p>
                </div>
                <button
                  onClick={() => setShowBookingForm(true)}
                  className="w-full bg-black dark:bg-gray-700 text-white py-2 md:py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-semibold text-sm md:text-base"
                >
                  Book Now
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                  Available Parking Slots
                </h3>
                <div className="grid grid-cols-6 gap-2 md:gap-3 mb-4">
                  {availableSlots.slice(0, 24).map((slot) => (
                    <div
                      key={slot.id}
                      className={`aspect-square flex flex-col items-center justify-center p-1 md:p-2 rounded-lg ${
                        slot.status
                          ? "bg-green-200 dark:bg-green-900 border border-green-400 dark:border-green-700"
                          : "bg-red-200 dark:bg-red-900 border border-red-400 dark:border-red-700"
                      }`}
                    >
                      <Car
                        className={`w-3 h-3 md:w-5 md:h-5 mb-1 ${
                          slot.status
                            ? "text-green-800 dark:text-green-300"
                            : "text-red-800 dark:text-red-300"
                        }`}
                      />
                      <span
                        className={`text-xs font-semibold ${
                          slot.status
                            ? "text-green-800 dark:text-green-300"
                            : "text-red-800 dark:text-red-300"
                        }`}
                      >
                        {slot.id}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  Showing first 24 slots. Total: {availableSlots.length} slots
                  available.
                </p>
              </div>
            </div>

            {/* Admin Contact Section */}
            <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg md:text-xl font-semibold text-black dark:text-white mb-4">
                Need Help? Contact Admin
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <button
                  onClick={handleWhatsAppContact}
                  className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">WhatsApp</span>
                </button>
                <button
                  onClick={handlePhoneContact}
                  className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-colors"
                >
                  <Phone className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">Call</span>
                </button>
                <button
                  onClick={handleEmailContact}
                  className="flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg transition-colors"
                >
                  <Mail className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">Email</span>
                </button>
              </div>
              <div className="mt-3 text-center">
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  📱 03343282332 | 📧 waqas.khokhar2002@gmail.com
                </p>
              </div>
            </div>
          </div>
        );

      case "bookings":
        return (
          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white">
                My Bookings
              </h1>
              <button
                onClick={() => setShowBookingForm(true)}
                className="bg-black dark:bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2 text-sm md:text-base"
              >
                <Plus className="w-4 h-4" />
                <span>New Booking</span>
              </button>
            </div>

            {userBookings.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-center">
                <Car className="w-12 h-12 md:w-16 md:h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
                  No bookings found
                </p>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Book your first parking slot!
                </p>
                <button
                  onClick={() => setShowBookingForm(true)}
                  className="bg-black dark:bg-gray-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors text-sm md:text-base"
                >
                  Book Now
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {userBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                        <div>
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                            Slot
                          </p>
                          <p className="font-semibold text-black dark:text-white text-sm md:text-base">
                            {booking.slotId}
                          </p>
                        </div>
                        <div className="col-span-1 md:col-span-2 lg:col-span-2">
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                            Time
                          </p>
                          <p className="font-semibold text-black dark:text-white text-xs md:text-sm">
                            {formatDateTime(booking.created_at)} -{" "}
                            {formatDateTime(booking.bookingEndTime)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                            Car
                          </p>
                          <p className="font-semibold text-black dark:text-white text-sm md:text-base">
                            {booking.carNum}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <span
                          className={`inline-block px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status
                              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {booking.status
                            ? "Completed"
                            : !booking.status
                            ? "Active"
                            : "Inactive"}
                        </span>
                        <p className="text-lg md:text-xl font-bold text-black dark:text-white mt-2">
                          Rs. {booking.totalPrice}
                        </p>
                        <button
                          onClick={() => viewBookingDetails(booking)}
                          className="mt-2 bg-black dark:bg-gray-700 text-white px-3 md:px-4 py-1 rounded hover:bg-gray-800 dark:hover:bg-gray-600 text-xs md:text-sm"
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
        );

      case "amenities":
        return (
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white">
              Nearby Amenities
            </h1>
            <NearbyAmenities />
          </div>
        );

      case "faq":
        return (
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white">
              Frequently Asked Questions
            </h1>
            <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <FAQAccordion faqs={faqData} />
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white">
              Profile
            </h1>
            <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 max-w-2xl">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                    Name
                  </label>
                  <p className="text-base md:text-lg text-black dark:text-white">
                    {user?.fullName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                    Email
                  </label>
                  <p className="text-base md:text-lg text-black dark:text-white">
                    {user?.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                    WhatsApp
                  </label>
                  <p className="text-base md:text-lg text-black dark:text-white">
                    {user?.whatsapp}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                    Car Number
                  </label>
                  <p className="text-base md:text-lg text-black dark:text-white">
                    {user?.carNum}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SweetAlertProvider />
      <SidebarProvider>
        <div className="flex min-h-screen">
          <Sidebar className="border-r border-gray-200 dark:border-gray-700 hidden lg:block">
            <SidebarHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg md:text-xl font-bold text-black dark:text-white">
                User Panel
              </h2>
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
                    onClick={logout}
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
            <header className="flex h-14 md:h-16 items-center justify-between gap-2 border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 bg-white dark:bg-gray-800">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="lg:hidden" />
                <h1 className="text-base md:text-lg font-semibold text-black dark:text-white">
                  User Dashboard
                </h1>
              </div>
              <ThemeToggle />
            </header>
            <main className="flex-1 p-4 md:p-6">{renderContent()}</main>
          </SidebarInset>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
          <div className="grid grid-cols-5 gap-1 p-2">
            <button
              onClick={() => setActiveSection("overview")}
              className={`flex flex-col items-center p-2 rounded-lg ${
                activeSection === "overview"
                  ? "bg-blue-100 dark:bg-blue-900"
                  : ""
              }`}
            >
              <Car className="w-5 h-5 text-black dark:text-white" />
              <span className="text-xs text-black dark:text-white mt-1">
                Overview
              </span>
            </button>
            <button
              onClick={() => setActiveSection("bookings")}
              className={`flex flex-col items-center p-2 rounded-lg ${
                activeSection === "bookings"
                  ? "bg-blue-100 dark:bg-blue-900"
                  : ""
              }`}
            >
              <Calendar className="w-5 h-5 text-black dark:text-white" />
              <span className="text-xs text-black dark:text-white mt-1">
                Bookings
              </span>
            </button>
            <button
              onClick={() => setActiveSection("amenities")}
              className={`flex flex-col items-center p-2 rounded-lg ${
                activeSection === "amenities"
                  ? "bg-blue-100 dark:bg-blue-900"
                  : ""
              }`}
            >
              <MapPin className="w-5 h-5 text-black dark:text-white" />
              <span className="text-xs text-black dark:text-white mt-1">
                Amenities
              </span>
            </button>
            <button
              onClick={() => setActiveSection("faq")}
              className={`flex flex-col items-center p-2 rounded-lg ${
                activeSection === "faq" ? "bg-blue-100 dark:bg-blue-900" : ""
              }`}
            >
              <HelpCircle className="w-5 h-5 text-black dark:text-white" />
              <span className="text-xs text-black dark:text-white mt-1">
                FAQ
              </span>
            </button>
            <button
              onClick={() => setActiveSection("profile")}
              className={`flex flex-col items-center p-2 rounded-lg ${
                activeSection === "profile"
                  ? "bg-blue-100 dark:bg-blue-900"
                  : ""
              }`}
            >
              <User className="w-5 h-5 text-black dark:text-white" />
              <span className="text-xs text-black dark:text-white mt-1">
                Profile
              </span>
            </button>
          </div>
        </div>

        {showBookingForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg md:text-xl font-bold text-black dark:text-white mb-4">
                Book Parking Slot
              </h2>
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">
                    Select Slot *
                  </label>
                  <select
                    name="slot"
                    value={bookingForm.slot}
                    onChange={handleSlotSelection}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-black dark:text-white bg-white dark:bg-gray-700 text-sm"
                    required
                  >
                    <option value="">Choose a slot</option>
                    {availableSlots.map((slot) => {
                      const minutesUntilFree = getSlotAvailabilityTime(slot.id);
                      return (
                        <option
                          key={slot.id}
                          value={slot.id}
                          disabled={!slot.status}
                        >
                          {slot.id}{" "}
                          {!slot.status
                            ? `(Free in ${minutesUntilFree || "Unknown"} min)`
                            : "(Available)"}
                        </option>
                      );
                    })}
                  </select>
                  {bookingForm.slot &&
                    availableSlots.find((s) => s.id === bookingForm.slotId)
                      ?.status && (
                      <small className="text-orange-600 dark:text-orange-400">
                        This slot will be free in{" "}
                        {getSlotAvailabilityTime(bookingForm.slot) || "Unknown"}{" "}
                        minutes
                      </small>
                    )}
                </div>

                <DateTimeRangePicker
                  startDateTime={bookingForm.startDateTime}
                  endDateTime={bookingForm.endDateTime}
                  onStartChange={(value) =>
                    setBookingForm({ ...bookingForm, startDateTime: value })
                  }
                  onEndChange={(value) =>
                    setBookingForm({ ...bookingForm, endDateTime: value })
                  }
                />

                <div>
                  <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">
                    Car Number
                  </label>
                  <input
                    type="text"
                    name="carNumber"
                    value={bookingForm.carNumber}
                    onChange={handleBookingInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-black dark:text-white bg-white dark:bg-gray-700 text-sm"
                    placeholder="ABC-123 (3 letters, dash, 3 numbers)"
                    maxLength={7}
                  />
                  <small className="text-gray-600 dark:text-gray-400">
                    Format: ABC-123 (e.g., KHI-123, LHR-456)
                  </small>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={bookingForm.whatsapp}
                    onChange={handleBookingInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-black dark:text-white bg-white dark:bg-gray-700 text-sm"
                    placeholder="+923001234567 or 03001234567"
                  />
                  <small className="text-gray-600 dark:text-gray-400">
                    Pakistani mobile number for confirmation
                  </small>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">
                    Payment Method
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={bookingForm.paymentMethod === "cash"}
                        onChange={(e) =>
                          setBookingForm({
                            ...bookingForm,
                            paymentMethod: e.target.value,
                          })
                        }
                        className="mr-2"
                      />
                      <span className="text-black dark:text-white text-sm">
                        💵 Cash
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="easypaisa"
                        checked={bookingForm.paymentMethod === "easypaisa"}
                        onChange={(e) =>
                          setBookingForm({
                            ...bookingForm,
                            paymentMethod: e.target.value,
                          })
                        }
                        className="mr-2"
                      />
                      <span className="text-black dark:text-white text-sm">
                        📱 EasyPaisa
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 bg-black dark:bg-gray-700 text-white py-2 rounded hover:bg-gray-800 dark:hover:bg-gray-600 text-sm"
                  >
                    Confirm Booking
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="flex-1 bg-gray-300 dark:bg-gray-600 text-black dark:text-white py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-500 text-sm"
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
              const startTime = new Date(bookingForm.startDateTime).getTime();
              const endTime = new Date(bookingForm.endDateTime).getTime();
              const diffHours = Math.ceil(
                (endTime - startTime) / (1000 * 60 * 60)
              );
              return diffHours * 100;
            })()}
            onPaymentComplete={handleEasyPaisaComplete}
            onCancel={() => setShowEasyPaisaPayment(false)}
          />
        )}

        {showReceipt && currentBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg md:text-xl font-bold text-black dark:text-white mb-4">
                Booking Details
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-semibold text-black dark:text-white mb-2">
                    Booking Information
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Booking ID:</strong>{" "}
                      {currentBooking.id
                        ? currentBooking.id
                        : bookings.length + 1}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Slot:</strong>{" "}
                      {currentBooking.slotId
                        ? currentBooking.slotId
                        : currentBooking.slot}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Start Time:</strong>{" "}
                      {formatDateTime(
                        currentBooking.created_at
                          ? currentBooking.created_at
                          : currentBooking.startDateTime
                      )}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>End Time:</strong>{" "}
                      {formatDateTime(
                        currentBooking.endDateTime
                          ? currentBooking.endDateTime
                          : currentBooking.bookingEndTime
                      )}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Duration:</strong>{" "}
                      {currentBooking.duration
                        ? currentBooking.duration
                        : currentBooking.hours}{" "}
                      hour(s)
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Car Number:</strong>{" "}
                      {currentBooking.carNum
                        ? currentBooking.carNum
                        : currentBooking.carNumber}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Payment Method:</strong>{" "}
                      {currentBooking.paymentMethod === "easypaisa"
                        ? "EasyPaisa"
                        : "Cash"}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Total Amount:</strong> Rs.{" "}
                      {currentBooking.totalPrice
                        ? currentBooking.totalPrice
                        : currentBooking.totalAmount}
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <h4 className="font-semibold text-black dark:text-white mb-2">
                    QR Code
                  </h4>
                  <img
                    src={generateQRCode() || "/placeholder.svg"}
                    alt="Booking QR Code"
                    className="mx-auto border rounded"
                  />
                </div>

                <div className="grid grid-cols-0 gap-2">
                  <button
                    onClick={downloadReceipt}
                    className="bg-black dark:bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-800 dark:hover:bg-gray-600 text-sm"
                  >
                    Download PDF
                  </button>
{/*                   <button
                    onClick={sendWhatsAppConfirmation}
                    className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 text-sm"
                  >
                    Send WhatsApp
                  </button> */}
                </div>
              </div>

              <button
                onClick={() => setShowReceipt(false)}
                className="w-full bg-gray-300 dark:bg-gray-600 text-black dark:text-white py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-500 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </SidebarProvider>
      <ParkEaseChatbot />
    </div>
  );
}
