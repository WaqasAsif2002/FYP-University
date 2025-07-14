"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/createClient";
import { useRouter, usePathname } from "next/navigation";
import useParkingRealtime from "@/lib/realTime";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [slot, setSlot] = useState([]);
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [bookingData, setBookingData] = useState([]);
  const [admin, setAdmin] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  useParkingRealtime({ table: "bookings", setData: setBookingData });
  useParkingRealtime({ table: "parkingSlot", setData: setSlot });
  useParkingRealtime({ table: "users", setData: setAllUsers });

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data?.user) {
        setAuthUser(null);
        setUser(null);
        setLoading(false);
        setAuthLoading(false);
        return;
      }

      const sessionUser = data.user;
      setAuthUser(sessionUser);

      const { data: userData, error } = await supabase
        .from("users")
        .select("*")
        .eq("userId", sessionUser.id)
        .single();

      if (error || !userData) {
        console.error("User not found");
        return;
      }
      setUser(userData);
      setAdmin(userData.role === "admin");

      // Redirect only if not already on dashboard
      if (userData.role === "admin" && pathname !== "/admin/dashboard") {
        router.replace("/admin/dashboard");
      } else if (userData.role === "user" && pathname !== "/user/dashboard") {
        router.replace("/user/dashboard");
      }

      // Fetch booking data
      try {
        const { data: bookings } = await supabase
          .from("bookings")
          .select()
          .order("id", { ascending: true });
        setBookingData(bookings);

        const { data: users } = await supabase.from("users").select("*");
        const formatted = users.map((item) => ({
          ...item,
          created_at: new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date(item.created_at)),
        }));
        setAllUsers(formatted);
      } catch (err) {
        console.error("Fetch error:", err.message);
      }

      try {
        const { data: slotData, error: slotError } = await supabase
          .from("parkingSlot")
          .select()
          .order("id", { ascending: true });
        if (error) throw error;
        setSlot(slotData || []);
      } catch (error) {}

      setLoading(false);
      setAuthLoading(false);
    };

    checkAuth();
  }, [pathname]);

  const logout = async () => {
    await supabase.auth.signOut();
    setAuthUser(null);
    setUser(null);
    setBookingData([]);
    setSlot([]);
    setAllUsers([]);
    setAdmin(false);
    router.replace("/login");
    setLoading(true);
    setAuthLoading(true);
  };

  const deleteFromTable = async ({ tableName, userId }) => {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq("id", userId);

      if (error) throw error;
    } catch (err) {
      console.error(`Error deleting from ${tableName}:`, err.message);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      bookingData.forEach(async (booking) => {
        const endTime = new Date(booking.bookingEndTime);

        if (!booking.status && endTime <= now) {
          const { error } = await supabase
            .from("parkingSlot")
            .update({ status: true })
            .eq("id", booking.slotId);

          if (!error) {
            const { error: bookingError } = await supabase
              .from("bookings")
              .update({ status: true })
              .eq("id", booking.id);
            if (bookingError) {
              console.error("Update error:", bookingError.message);
            }
          } else {
            console.error("Update error:", error.message);
          }
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [bookingData]);

  return (
    <UserContext.Provider
      value={{
        user,
        authUser,
        slot,
        loading,
        setUser,
        bookingData,
        admin,
        allUsers,
        logout,
        authLoading,
        deleteFromTable,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
