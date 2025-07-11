"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/createClient";

import { useUser } from "@/context/context";
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
  Users,
  Calendar,
  Settings,
  BarChart3,
  Plus,
  Trash2,
  Car,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import DateTimeRangePicker from "@/components/DateTimeRangePicker";
import { generateBookingPDF } from "@/components/PDFGenerator";
import ParkEaseChatbot from "@/components/ParkEaseChatbot";
import EasyPaisaPayment from "@/components/EasyPaisaPayment";
import SweetAlertProvider, {
  showSuccess,
  showError,
} from "@/components/SweetAlert";

export default function AdminDashboard() {
  const router = useRouter();
  const {
    authUser,
    bookingData,
    admin,
    allUsers,
    loading,
    authLoading,
    logout,
    slot,
    deleteFromTable,
    user,
  } = useUser();
  const [activeSection, setActiveSection] = useState("overview");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [slots, setSlots] = useState([]);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showAddBookingForm, setShowAddBookingForm] = useState(false);
  const [showEasyPaisaPayment, setShowEasyPaisaPayment] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    whatsapp: "",
    carNumber: "",
  });
  const [newBooking, setNewBooking] = useState({
    userId: "",
    slot: "",
    startDateTime: "",
    endDateTime: "",
    carNumber: "",
    paymentMethod: "cash",
  });

  // Add state for editing bookings
  const [editingBooking, setEditingBooking] = useState(null);
  const [showEditBookingForm, setShowEditBookingForm] = useState(false);

  const PRICE_PER_HOUR = 100;

  const [userSearch, setUserSearch] = useState("");
  const [bookingSearch, setBookingSearch] = useState("");
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    setSlots(slot);
    setUsers(allUsers);
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

  // Validation functions
  const validatePakistaniNumber = (number) => {
    // Pakistani mobile number format: +92XXXXXXXXXX or 03XXXXXXXXX
    const pakistaniNumberRegex = /^(\+92|0)?3[0-9]{9}$/;
    return pakistaniNumberRegex.test(number.replace(/\s|-/g, ""));
  };

  const validateCarNumber = (carNumber) => {
    // Pakistani car number format: ABC-123 (3 letters, dash, 3 numbers)
    const carNumberRegex = /^[A-Z]{3}-[0-9]{3}$/;
    return carNumberRegex.test(carNumber.toUpperCase());
  };

  useEffect(() => {
    // Load demo bookings with datetime range
    const now = new Date();
    const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowPlusTwo = new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000);

    //   {
    //     id: 1001,
    //     userId: 1,
    //     userName: "John Doe",
    //     slot: "A15",
    //     startDateTime: now.toISOString(),
    //     endDateTime: threeHoursLater.toISOString(),
    //     hours: 3,
    //     carNumber: "ABC-123",
    //     totalAmount: 300,
    //     status: "Active",
    //     bookingDate: now.toISOString(),
    //     paymentMethod: "cash",
    //   },
    //   {
    //     id: 1002,
    //     userId: 2,
    //     userName: "Sarah Ahmed",
    //     slot: "A22",
    //     startDateTime: tomorrow.toISOString(),
    //     endDateTime: tomorrowPlusTwo.toISOString(),
    //     hours: 2,
    //     carNumber: "XYZ-789",
    //     totalAmount: 200,
    //     status: "Active",
    //     bookingDate: now.toISOString(),
    //     paymentMethod: "easypaisa",
    //   },
    // ];
    // setBookings(demoBookings);

    // Set default start and end times for new booking form
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    setNewBooking((prev) => ({
      ...prev,
      startDateTime: now.toISOString().slice(0, 16),
      endDateTime: oneHourLater.toISOString().slice(0, 16),
    }));
  }, []);

  const handleLogout = () => {
    router.push("/");
  };

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "carNumber") {
      // Auto-format car number
      let formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
      if (formattedValue.length > 3) {
        formattedValue =
          formattedValue.slice(0, 3) + "-" + formattedValue.slice(3, 6);
      }
      setNewUser((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else if (name === "whatsapp") {
      // Auto-format Pakistani number
      let formattedValue = value.replace(/[^0-9+]/g, "");
      if (formattedValue.startsWith("0")) {
        formattedValue = "+92" + formattedValue.slice(1);
      } else if (!formattedValue.startsWith("+92")) {
        formattedValue = "+92" + formattedValue;
      }
      setNewUser((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else {
      setNewUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (e) => {
    const selectedUserId = e.target.value;
    const selectUser = users.find(
      (user) => user.id === Number.parseInt(selectedUserId)
    );
    setSelectedUser(selectUser);
    setNewBooking({
      carNumber: selectedUser ? selectedUser.carNum : "",
    });
  };
  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "carNumber") {
      // Auto-format car number
      let formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
      if (formattedValue.length > 3) {
        formattedValue =
          formattedValue.slice(0, 3) + "-" + formattedValue.slice(3, 6);
      }
      setNewBooking((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else {
      setNewBooking((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    // Validate Pakistani phone number
    if (newUser.whatsapp && !validatePakistaniNumber(newUser.whatsapp)) {
      showError(
        "Please enter a valid Pakistani mobile number (e.g., +923001234567 or 03001234567)"
      );
      return;
    }

    // Validate car number
    if (newUser.carNumber && !validateCarNumber(newUser.carNumber)) {
      showError(
        "Please enter a valid car number in format: ABC-123 (3 letters, dash, 3 numbers)"
      );
      return;
    }

    const user = {
      id: Date.now(),
      ...newUser,
      joinDate: new Date().toISOString().split("T")[0],
    };

    try {
      const { error } = await supabase.from("users").insert({
        fullName: user.name,
        carNum: user.carNumber,
        email: user.email,
        whatsapp: user.whatsapp,
      });
    } catch (error) {
      console.log(error);
    }
    setNewUser({ name: "", email: "", whatsapp: "", carNumber: "" });
    setShowAddUserForm(false);
    showSuccess("User added successfully!");
  };

  const handleDeleteUser = (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmDelete) {
      deleteFromTable({ tableName: "users", userId: userId });
      showSuccess("User deleted successfully!");
    }
  };

  // Add function to handle editing bookings
  const handleEditBooking = (booking) => {
    setEditingBooking({
      ...booking,
      startDateTime: booking.created_at,
      endDateTime: booking.bookingEndTime,
    });

    setShowEditBookingForm(true);
  };

  // Add function to save edited booking
  const saveEditedBooking = async (e) => {
    e.preventDefault();

    if (!editingBooking) return;

    // Calculate hours from datetime range
    const startTime = new Date(editingBooking.startDateTime).getTime();
    const endTime = new Date(editingBooking.endDateTime).getTime();
    const diffHours = Math.ceil((startTime - endTime) / (1000 * 60 * 60));
    // Validate hours (1-10)
    if (diffHours < 1 || diffHours > 10) {
      showError("Booking duration must be between 1 and 10 hours");
      return;
    }

    // Validate car number if provided
    if (
      editingBooking.carNumber &&
      !validateCarNumber(editingBooking.carNumber)
    ) {
      showError(
        "Please enter a valid car number in format: ABC-123 (3 letters, dash, 3 numbers)"
      );
      return;
    }

    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          slotId: editingBooking.slotId,
          duration: editingBooking.duration,
          totalPrice: editingBooking.totalPrice,
          carNum: editingBooking.carNum,
          status:
            editingBooking.status === "Completed"
              ? false
              : editingBooking.status === "Active"
              ? true
              : editingBooking.status === ""
              ? "Pending"
              : false,
          bookingEndTime: editingBooking.bookingEndTime,
          created_at: editingBooking.created_at,
        })
        .eq("id", editingBooking.id);
      if (error) {
        console.error("Error updating booking:", error);
      }
      const { data, error: helloerror } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", editingBooking.id);
    } catch (error) {
      console.log(error);
    }

    setShowEditBookingForm(false);
    setEditingBooking(null);
    showSuccess("Booking updated successfully!");
  };

  // Add function to delete booking
  const handleDeleteBooking = (bookingId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );
    if (confirmDelete) {
      deleteFromTable({ tableName: "bookings", userId: bookingId });
      showSuccess("Booking deleted successfully!");
    }
  };

  const viewBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setShowBookingDetails(true);
  };

  const downloadBookingPDF = () => {
    if (!selectedBooking) return;
    generateBookingPDF(selectedBooking);
  };

  // Handle EasyPaisa payment completion for admin
  const handleAdminEasyPaisaComplete = async () => {
    const startTime = new Date(newBooking.startDateTime).getTime();
    const endTime = new Date(newBooking.endDateTime).getTime();
    const diffHours = Math.ceil((endTime - startTime) / (1000 * 60 * 60));

    // const selectedUser = users.find(
    //   (user) => user.id === Number.parseInt(newBooking.userId)
    // );

    const booking = {
      ...newBooking,
      userId: Number.parseInt(newBooking.userId),
      userName: selectedUser.fullName,
      hours: diffHours,
      totalAmount: diffHours * 100, // Admin pays full price even with EasyPaisa
      status: "Active",
      bookingDate: new Date().toISOString(),
      paymentMethod: "easypaisa",
    };

    try {
      const { error } = await supabase.from("bookings").insert({
        userId: selectedUser.userId,
        userName: selectedUser.fullName,
        slotId: booking.slot,
        duration: booking.hours,
        totalPrice: booking.totalAmount,
        carNum: booking.carNumber,
        whatsapp: selectedUser.whatsapp,
        paymentMethod: booking.paymentMethod,
        status: true,
        bookingEndTime: booking.endDateTime,
      });
    } catch (error) {
      console.log(error);
    }

    try {
      const { error } = await supabase
        .from("parkingSlot")
        .update({
          status: false,
          pph: booking.totalAmount,
        })
        .eq("id", booking.slot);
    } catch (error) {
      console.log(error);
    }

    // Reset form
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    setNewBooking({
      userId: "",
      slot: "",
      startDateTime: now.toISOString().slice(0, 16),
      endDateTime: oneHourLater.toISOString().slice(0, 16),
      carNumber: "",
      paymentMethod: "cash",
    });
    setShowAddBookingForm(false);
    setShowEasyPaisaPayment(false);
    showSuccess("Booking added successfully!");
  };

  // Update the handleAddBooking function
  const handleAddBooking = async (e) => {
    e.preventDefault();

    // Calculate hours from datetime range
    const startTime = new Date(newBooking.startDateTime).getTime();
    const endTime = new Date(newBooking.endDateTime).getTime();
    const diffHours = Math.ceil((endTime - startTime) / (1000 * 60 * 60));

    // Validate hours (1-10)
    if (diffHours < 1 || diffHours > 10) {
      showError("Booking duration must be between 1 and 10 hours");
      return;
    }

    // Validate car number if provided
    if (newBooking.carNumber && !validateCarNumber(newBooking.carNumber)) {
      showError(
        "Please enter a valid car number in format: ABC-123 (3 letters, dash, 3 numbers)"
      );
      return;
    }

    // If EasyPaisa is selected, show payment modal
    if (newBooking.paymentMethod === "easypaisa") {
      setShowEasyPaisaPayment(true);
      return;
    }

    // For cash payment, proceed with booking
    const booking = {
      id: Date.now(),
      ...newBooking,
      userId: Number.parseInt(newBooking.userId),
      userName: newBooking.fullName,
      hours: diffHours,
      totalAmount: diffHours * 100, // Admin pays full price for both cash and EasyPaisa
      status: "Active",
      bookingDate: new Date().toISOString(),
      paymentMethod: newBooking.paymentMethod,
    };

    try {
      const { error } = await supabase.from("bookings").insert({
        userId: selectedUser.userId,
        userName: selectedUser.fullName,
        slotId: booking.slot,
        duration: booking.hours,
        totalPrice: booking.totalAmount,
        carNum: booking.carNumber,
        whatsapp: selectedUser.whatsapp,
        paymentMethod: booking.paymentMethod,
        status: true,
        bookingEndTime: booking.endDateTime,
      });
    } catch (error) {
      console.log(error);
    }

    try {
      const { error } = await supabase
        .from("parkingSlot")
        .update({
          status: false,
          pph: booking.totalAmount,
        })
        .eq("id", booking.slot);
    } catch (error) {
      console.log(error);
    }

    // Update slot availability
    setSlots((prev) =>
      prev.map((slot) =>
        slot.id === newBooking.slot ? { ...slot, available: false } : slot
      )
    );

    // Reset form
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    setNewBooking({
      userId: "",
      slot: "",
      startDateTime: now.toISOString().slice(0, 16),
      endDateTime: oneHourLater.toISOString().slice(0, 16),
      carNumber: "",
      paymentMethod: "cash",
    });
    setShowAddBookingForm(false);
    showSuccess("Booking added successfully!");
  };

  const formatDateTime = (dateTimeStr) => {
    try {
      return new Date(dateTimeStr).toLocaleString();
    } catch (e) {
      return dateTimeStr;
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      // Update the overview section to show non-clickable slots
      case "overview":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-black dark:text-white">
              Dashboard Overview
            </h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Users
                </h3>
                <p className="text-3xl font-bold text-black dark:text-white">
                  {users.length}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Bookings
                </h3>
                <p className="text-3xl font-bold text-black dark:text-white">
                  {slots.filter((b) => !b.status).length}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Available Slots
                </h3>
                <p className="text-3xl font-bold text-black dark:text-white">
                  {slots.filter((s) => s.status).length}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Price Per Hour
                </h3>
                <p className="text-3xl font-bold text-black dark:text-white">
                  Rs. {PRICE_PER_HOUR}
                </p>
              </div>
            </div>

            {/* Slots Grid - Non-clickable */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-black dark:text-white">
                  Parking Slots (A1 - A80)
                </h2>
                <div className="flex space-x-4 text-sm">
                  <span className="flex items-center">
                    <div className="w-4 h-4 bg-green-200 dark:bg-green-900 border border-green-400 dark:border-green-700 rounded mr-2"></div>
                    <span className="text-gray-600 dark:text-gray-400">
                      Available
                    </span>
                  </span>
                  <span className="flex items-center">
                    <div className="w-4 h-4 bg-red-200 dark:bg-red-900 border border-red-400 dark:border-red-700 rounded mr-2"></div>
                    <span className="text-gray-600 dark:text-gray-400">
                      Occupied
                    </span>
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-8 gap-3">
                {slots.slice(0, 40).map((slot) => (
                  <div
                    key={slot.id}
                    className={`aspect-square flex flex-col items-center justify-center p-2 rounded-lg ${
                      slot.status
                        ? "bg-green-200 dark:bg-green-900 border border-green-400 dark:border-green-700"
                        : "bg-red-200 dark:bg-red-900 border border-red-400 dark:border-red-700"
                    }`}
                  >
                    <Car
                      className={`w-6 h-6 mb-1 ${
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
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Showing first 40 slots.
              </p>
            </div>
          </div>
        );

      case "users":
        const filteredUsers = users.filter(
          (user) =>
            user.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
            user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
            user.carNum.toLowerCase().includes(userSearch.toLowerCase())
        );

        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center gap-4">
              <h1 className="text-3xl font-bold text-black dark:text-white">
                Users Management
              </h1>
              <button
                onClick={() => setShowAddUserForm(true)}
                className="bg-black dark:bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add User</span>
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <input
                type="text"
                placeholder="Search users by name, email, or car number..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-black dark:text-white bg-white dark:bg-gray-700"
              />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold text-black dark:text-white">
                          {user.fullName}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Email: {user.email}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          WhatsApp: {user.whatsapp}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          Car: {user.carNum}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          Joined: {user.created_at}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition-colors flex items-center space-x-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      // Update the bookings section to include edit and delete options
      case "bookings":
        const filteredBookings = bookings.filter(
          (booking) =>
            booking?.userName
              .toLowerCase()
              .includes(bookingSearch.toLowerCase()) ||
            String(booking.id)
              .toLowerCase()
              .includes(bookingSearch.toLowerCase()) ||
            booking?.carNum.toLowerCase().includes(bookingSearch.toLowerCase())
        );

        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center gap-4">
              <h1 className="text-3xl font-bold text-black dark:text-white">
                Bookings Management
              </h1>
              <button
                onClick={() => setShowAddBookingForm(true)}
                className="bg-black dark:bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Booking</span>
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <input
                type="text"
                placeholder="Search bookings by user, slot, or car number..."
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-black dark:text-white bg-white dark:bg-gray-700"
              />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="space-y-4">
                  {filteredBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg gap-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            ID: {booking.id}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            User: {booking.userName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Slot: {booking.slotId}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Car: {booking.carNum}
                          </p>
                        </div>
                        <div className="col-span-1 md:col-span-2 lg:col-span-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Start: {formatDateTime(booking.created_at)}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            End: {formatDateTime(booking.bookingEndTime)}
                          </p>
                        </div>
                        <div>
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              booking.status
                                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                            }`}
                          >
                            {booking.status ? "Active" : "Inactive"}
                          </span>
                          <p className="text-sm font-semibold text-black dark:text-white">
                            Rs. {booking.totalPrice}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewBookingDetails(booking)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors text-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditBooking(booking)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  const getSlotAvailabilityTime = (slotId) => {
    const slotBookings = bookings.filter(
      (booking) =>
        booking.slot === slotId &&
        booking.status === "Active" &&
        new Date(booking.endDateTime) > new Date()
    );

    if (slotBookings.length === 0) return null;

    const latestEndTime = Math.max(
      ...slotBookings.map((booking) => new Date(booking.endDateTime).getTime())
    );

    const now = new Date().getTime();
    const minutesUntilFree = Math.ceil((latestEndTime - now) / (1000 * 60));

    return minutesUntilFree > 0 ? minutesUntilFree : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SweetAlertProvider />
      <SidebarProvider>
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
          <Sidebar className="border-r border-gray-200 dark:border-gray-700">
            <SidebarHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-black dark:text-white">
                Admin Panel
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
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Overview
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setActiveSection("users")}
                    isActive={activeSection === "users"}
                    className="w-full justify-start text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Users
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setActiveSection("bookings")}
                    isActive={activeSection === "bookings"}
                    className="w-full justify-start text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Bookings
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={logout}
                    className="w-full justify-start text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                  >
                    <Settings className="w-4 h-4 mr-2" />
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
                <h1 className="text-lg font-semibold text-black dark:text-white">
                  Admin Dashboard
                </h1>
              </div>
              <ThemeToggle />
            </header>
            <main className="flex-1 p-6">{renderContent()}</main>
          </SidebarInset>
        </div>

        {/* Add User Modal */}
        {showAddUserForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
              <h2 className="text-xl font-bold text-black dark:text-white mb-4">
                Add New User
              </h2>
              <form onSubmit={handleAddUser} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={newUser.name}
                  onChange={handleUserInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-black dark:text-white bg-white dark:bg-gray-700"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={newUser.email}
                  onChange={handleUserInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-black dark:text-white bg-white dark:bg-gray-700"
                  required
                />
                <div>
                  <input
                    type="tel"
                    name="whatsapp"
                    placeholder="+923001234567 or 03001234567"
                    value={newUser.whatsapp}
                    onChange={handleUserInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-black dark:text-white bg-white dark:bg-gray-700"
                  />
                  <small className="text-gray-600 dark:text-gray-400">
                    Pakistani mobile number
                  </small>
                </div>
                <div>
                  <input
                    type="text"
                    name="carNumber"
                    placeholder="ABC-123 (3 letters, dash, 3 numbers)"
                    value={newUser.carNumber}
                    onChange={handleUserInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-black dark:text-white bg-white dark:bg-gray-700"
                    maxLength={7}
                  />
                  <small className="text-gray-600 dark:text-gray-400">
                    Format: ABC-123 (e.g., KHI-123, LHR-456)
                  </small>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 bg-black dark:bg-gray-700 text-white py-2 rounded hover:bg-gray-800 dark:hover:bg-gray-600"
                  >
                    Add User
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddUserForm(false)}
                    className="flex-1 bg-gray-300 dark:bg-gray-600 text-black dark:text-white py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Edit Booking Modal */}
        {showEditBookingForm && editingBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-black dark:text-white mb-4">
                Edit Booking
              </h2>
              <form onSubmit={saveEditedBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">
                    Slot
                  </label>
                  <input
                    type="text"
                    value={editingBooking.slotId}
                    onChange={(e) =>
                      setEditingBooking({
                        ...editingBooking,
                        slotId: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-black dark:text-white bg-white dark:bg-gray-700"
                    required
                  />
                </div>

                <DateTimeRangePicker
                  startDateTime={editingBooking.created_at}
                  endDateTime={editingBooking.bookingEndTime}
                  onStartChange={(value) =>
                    setEditingBooking({
                      ...editingBooking,
                      created_at: value,
                    })
                  }
                  onEndChange={(value) =>
                    setEditingBooking({
                      ...editingBooking,
                      bookingEndTime: value,
                    })
                  }
                />

                <div>
                  <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">
                    Car Number
                  </label>
                  <input
                    type="text"
                    value={editingBooking.carNum}
                    onChange={(e) =>
                      setEditingBooking({
                        ...editingBooking,
                        carNum: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-black dark:text-white bg-white dark:bg-gray-700"
                    placeholder="ABC-123"
                    maxLength={7}
                    required
                  />
                  <small className="text-gray-600 dark:text-gray-400">
                    Format: ABC-123
                  </small>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={editingBooking.status}
                    onChange={(e) =>
                      setEditingBooking({
                        ...editingBooking,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-black dark:text-white bg-white dark:bg-gray-700"
                  >
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 bg-black dark:bg-gray-700 text-white py-2 rounded hover:bg-gray-800 dark:hover:bg-gray-600"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditBookingForm(false);
                      setEditingBooking(null);
                    }}
                    className="flex-1 bg-gray-300 dark:bg-gray-600 text-black dark:text-white py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Booking Modal */}
        {showAddBookingForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-black dark:text-white mb-4">
                Add Manual Booking
              </h2>
              <form onSubmit={handleAddBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">
                    Select User *
                  </label>
                  <select
                    name="userId"
                    value={newBooking.userId}
                    onChange={handleSelectChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-black dark:text-white bg-white dark:bg-gray-700"
                    required
                  >
                    <option value="">Choose a user</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.fullName} - {user.email}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">
                    Select Slot *
                  </label>
                  <select
                    name="slot"
                    value={newBooking.slot}
                    onChange={handleBookingInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-black dark:text-white bg-white dark:bg-gray-700"
                    required
                  >
                    <option value="">Choose a slot</option>
                    {slots.map((slot) => {
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
                  {newBooking.slot &&
                    !slots.find((s) => s.id === newBooking.slot)?.status && (
                      <small className="text-orange-600 dark:text-orange-400">
                        This slot will be free in{" "}
                        {getSlotAvailabilityTime(newBooking.slot) || "Unknown"}{" "}
                        minutes
                      </small>
                    )}
                </div>

                <DateTimeRangePicker
                  startDateTime={newBooking.startDateTime}
                  endDateTime={newBooking.endDateTime}
                  onStartChange={(value) =>
                    setNewBooking({ ...newBooking, startDateTime: value })
                  }
                  onEndChange={(value) =>
                    setNewBooking({ ...newBooking, endDateTime: value })
                  }
                />

                <div>
                  <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">
                    Car Number
                  </label>
                  <input
                    type="text"
                    name="carNumber"
                    value={newBooking.carNumber}
                    onChange={handleBookingInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-black dark:text-white bg-white dark:bg-gray-700"
                    placeholder="ABC-123 (3 letters, dash, 3 numbers)"
                    maxLength={7}
                  />
                  <small className="text-gray-600 dark:text-gray-400">
                    Format: ABC-123 (e.g., KHI-123, LHR-456)
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
                        checked={newBooking.paymentMethod === "cash"}
                        onChange={handleBookingInputChange}
                        className="mr-2"
                      />
                      <span className="text-black dark:text-white">
                        💵 Cash
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="easypaisa"
                        checked={newBooking.paymentMethod === "easypaisa"}
                        onChange={handleBookingInputChange}
                        className="mr-2"
                      />
                      <span className="text-black dark:text-white">
                        📱 EasyPaisa
                      </span>
                    </label>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 bg-black dark:bg-gray-700 text-white py-2 rounded hover:bg-gray-800 dark:hover:bg-gray-600"
                  >
                    Add Booking
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddBookingForm(false)}
                    className="flex-1 bg-gray-300 dark:bg-gray-600 text-black dark:text-white py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Admin EasyPaisa Payment Modal */}
        {showEasyPaisaPayment && (
          <EasyPaisaPayment
            amount={(() => {
              const startTime = new Date(newBooking.startDateTime).getTime();
              const endTime = new Date(newBooking.endDateTime).getTime();
              const diffHours = Math.ceil(
                (endTime - startTime) / (1000 * 60 * 60)
              );
              return diffHours * 100; // Admin pays full price
            })()}
            onPaymentComplete={handleAdminEasyPaisaComplete}
            onCancel={() => setShowEasyPaisaPayment(false)}
            isAdmin={true} // Pass admin flag to show full price
          />
        )}

        {/* Booking Details Modal */}
        {showBookingDetails && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-black dark:text-white mb-4">
                Booking Details
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-semibold text-black dark:text-white mb-2">
                    Booking Information
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Booking ID:</strong> {selectedBooking.id}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>User:</strong> {selectedBooking.userName}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Slot:</strong> {selectedBooking.slotId}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Start Time:</strong>{" "}
                      {formatDateTime(selectedBooking.created_at)}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>End Time:</strong>{" "}
                      {formatDateTime(selectedBooking.bookingEndTime)}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Duration:</strong> {selectedBooking.duration}{" "}
                      hour(s)
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Car Number:</strong> {selectedBooking.carNum}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Payment Method:</strong>{" "}
                      {selectedBooking.paymentMethod === "easypaisa"
                        ? "EasyPaisa"
                        : "Cash"}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Total Amount:</strong> Rs.{" "}
                      {selectedBooking.totalPrice}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Status:</strong>{" "}
                      {selectedBooking.status ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <h4 className="font-semibold text-black dark:text-white mb-2">
                    QR Code
                  </h4>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Booking-${selectedBooking.id}`}
                    alt="Booking QR Code"
                    className="mx-auto border rounded"
                  />
                </div>

                <button
                  onClick={downloadBookingPDF}
                  className="w-full bg-black dark:bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-800 dark:hover:bg-gray-600"
                >
                  Download PDF
                </button>
              </div>

              <button
                onClick={() => setShowBookingDetails(false)}
                className="w-full bg-gray-300 dark:bg-gray-600 text-black dark:text-white py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        )}
        <ParkEaseChatbot />
      </SidebarProvider>
    </div>
  );
}
