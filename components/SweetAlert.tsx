"use client"

import { Toaster, toast } from "react-hot-toast"

export const showSuccess = (message) => {
  toast.success(message, {
    duration: 3000,
    position: "top-right",
    style: {
      background: "#10B981",
      color: "#fff",
      fontWeight: "500",
    },
    iconTheme: {
      primary: "#fff",
      secondary: "#10B981",
    },
  })
}

export const showError = (message) => {
  toast.error(message, {
    duration: 4000,
    position: "top-right",
    style: {
      background: "#EF4444",
      color: "#fff",
      fontWeight: "500",
    },
    iconTheme: {
      primary: "#fff",
      secondary: "#EF4444",
    },
  })
}

export const showWarning = (message) => {
  toast(message, {
    duration: 4000,
    position: "top-right",
    icon: "⚠️",
    style: {
      background: "#F59E0B",
      color: "#fff",
      fontWeight: "500",
    },
  })
}

export const showInfo = (message) => {
  toast(message, {
    duration: 3000,
    position: "top-right",
    icon: "ℹ️",
    style: {
      background: "#3B82F6",
      color: "#fff",
      fontWeight: "500",
    },
  })
}

export default function SweetAlertProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        className: "",
        duration: 3000,
        style: {
          background: "#363636",
          color: "#fff",
          fontSize: "14px",
          borderRadius: "8px",
          padding: "12px 16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        },
        success: {
          iconTheme: {
            primary: "#10B981",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#EF4444",
            secondary: "#fff",
          },
        },
      }}
    />
  )
}
