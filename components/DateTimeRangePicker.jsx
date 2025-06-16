"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Calculator } from "lucide-react"

export default function DateTimeRangePicker({
  startDateTime,
  endDateTime,
  onStartChange,
  onEndChange,
  minDate,
  className = "",
}) {
  const [calculatedHours, setCalculatedHours] = useState(0)
  const [calculatedFee, setCalculatedFee] = useState(0)

  const PRICE_PER_HOUR = 100

  // Calculate hours and fee whenever start or end time changes
  useEffect(() => {
    if (startDateTime && endDateTime) {
      const start = new Date(startDateTime).getTime()
      const end = new Date(endDateTime).getTime()

      if (start && end && end > start) {
        const diffMs = end - start
        const diffHours = diffMs / (1000 * 60 * 60)
        const roundedHours = Math.ceil(diffHours)

        setCalculatedHours(roundedHours)
        setCalculatedFee(roundedHours * PRICE_PER_HOUR)
      } else {
        setCalculatedHours(0)
        setCalculatedFee(0)
      }
    }
  }, [startDateTime, endDateTime])

  // Get current date and time in local ISO format for default min values
  const getCurrentDateTime = () => {
    const now = new Date()
    return now.toISOString().slice(0, 16)
  }

  // Handle start time change and ensure end time is after start time
  const handleStartChange = (e) => {
    const newStart = e.target.value
    onStartChange(newStart)

    // If end time is before new start time, update end time
    if (endDateTime && new Date(endDateTime) <= new Date(newStart)) {
      // Set end time to start time + 1 hour
      const newEndDate = new Date(new Date(newStart).getTime() + 60 * 60 * 1000)
      onEndChange(newEndDate.toISOString().slice(0, 16))
    }
  }

  const formatDisplayDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return ""
    try {
      const date = new Date(dateTimeStr)
      return date.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (e) {
      return dateTimeStr
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* DateTime Selection */}
      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          <Calendar className="w-5 h-5 mr-2" />
          Select Parking Duration
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* From DateTime */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <Clock className="w-4 h-4 mr-2 text-green-600" />
              From (Start Time)
            </label>
            <input
              type="datetime-local"
              value={startDateTime}
              onChange={handleStartChange}
              min={minDate || getCurrentDateTime()}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-base"
              required
            />
            {startDateTime && (
              <p className="text-xs text-gray-500 dark:text-gray-400">📅 {formatDisplayDateTime(startDateTime)}</p>
            )}
          </div>

          {/* To DateTime */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <Clock className="w-4 h-4 mr-2 text-red-600" />
              To (End Time)
            </label>
            <input
              type="datetime-local"
              value={endDateTime}
              onChange={(e) => onEndChange(e.target.value)}
              min={startDateTime || getCurrentDateTime()}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-base"
              required
            />
            {endDateTime && (
              <p className="text-xs text-gray-500 dark:text-gray-400">📅 {formatDisplayDateTime(endDateTime)}</p>
            )}
          </div>
        </div>
      </div>

      {/* Fee Calculator */}
      {calculatedHours > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
          <h4 className="flex items-center font-semibold text-gray-900 dark:text-gray-100 mb-4">
            <Calculator className="w-5 h-5 mr-2 text-blue-600" />
            Parking Fee Calculation
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{calculatedHours}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Hour{calculatedHours !== 1 ? "s" : ""}</p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">Rs. {PRICE_PER_HOUR}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Per Hour</p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">Rs. {calculatedFee}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              💡 <strong>Calculation:</strong> {calculatedHours} hour{calculatedHours !== 1 ? "s" : ""} × Rs.{" "}
              {PRICE_PER_HOUR} = Rs. {calculatedFee}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
              Maximum booking duration: 10 hours
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
