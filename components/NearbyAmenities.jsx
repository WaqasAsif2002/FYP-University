"use client"

import { useState } from "react"
import { Search, MapPin, Navigation, ExternalLink } from "lucide-react"

// Millennium Mall Karachi coordinates
const MILLENNIUM_MALL_COORDS = {
  lat: 24.8607,
  lon: 67.0011,
}

// Category icons mapping
const getCategoryIcon = (type) => {
  const iconMap = {
    bank: "🏦",
    atm: "🏧",
    salon: "💇",
    petrol: "⛽",
    hotel: "🏨",
    gym: "🏋️",
    restaurant: "🍽️",
    cafe: "☕",
    hospital: "🏥",
    pharmacy: "💊",
    shopping: "🛍️",
    fuel: "⛽",
    gas: "⛽",
    default: "📍",
  }

  const lowerType = type.toLowerCase()
  for (const [key, icon] of Object.entries(iconMap)) {
    if (lowerType.includes(key)) {
      return icon
    }
  }
  return iconMap.default
}

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default function NearbyAmenities() {
  const [searchQuery, setSearchQuery] = useState("")
  const [amenities, setAmenities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const searchAmenities = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a search term")
      return
    }

    setLoading(true)
    setError("")
    setAmenities([])

    try {
      // Using OpenStreetMap Nominatim API for nearby places
      const radius = 5000 // 5km radius
      const query = encodeURIComponent(searchQuery)
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=10&bounded=1&viewbox=${MILLENNIUM_MALL_COORDS.lon - 0.05},${MILLENNIUM_MALL_COORDS.lat + 0.05},${MILLENNIUM_MALL_COORDS.lon + 0.05},${MILLENNIUM_MALL_COORDS.lat - 0.05}&addressdetails=1`

      const response = await fetch(url)
      const data = await response.json()

      if (data && data.length > 0) {
        const processedAmenities = data
          .map((item) => {
            const distance = calculateDistance(
              MILLENNIUM_MALL_COORDS.lat,
              MILLENNIUM_MALL_COORDS.lon,
              Number.parseFloat(item.lat),
              Number.parseFloat(item.lon),
            )

            return {
              id: item.place_id,
              name: item.display_name.split(",")[0],
              type: item.type || item.class || searchQuery,
              distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
              lat: Number.parseFloat(item.lat),
              lon: Number.parseFloat(item.lon),
              address: item.display_name,
            }
          })
          .filter((amenity) => amenity.distance <= 5) // Only show within 5km
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 3) // Show only top 3 results

        setAmenities(processedAmenities)

        if (processedAmenities.length === 0) {
          setError("No nearby amenities found for your search")
        }
      } else {
        setError("No results found. Try different keywords like 'bank', 'restaurant', 'hospital'")
      }
    } catch (err) {
      setError("Failed to fetch nearby places. Please try again.")
      console.error("Search error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchAmenities()
    }
  }

  const openInGoogleMaps = (lat, lon, name) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}&query_place_id=${encodeURIComponent(name)}`
    window.open(url, "_blank")
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-black dark:text-white mb-6 text-center">Find Nearby Amenities</h3>

      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <MapPin className="w-5 h-5 text-red-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Searching around Millennium Mall, Karachi</span>
        </div>

        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for banks, salons, petrol pumps, hotels, gyms..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
            />
          </div>
          <button
            onClick={searchAmenities}
            disabled={loading}
            className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Try: bank, ATM, salon, petrol pump, hotel, gym, restaurant, hospital, pharmacy
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {amenities.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-black dark:text-white">Nearby Results ({amenities.length})</h4>

          {amenities.map((amenity) => (
            <div
              key={amenity.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{getCategoryIcon(amenity.type)}</span>
                    <div>
                      <h5 className="font-semibold text-black dark:text-white text-lg">{amenity.name}</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{amenity.type}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-2">
                    <Navigation className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {amenity.distance} km from Millennium Mall
                    </span>
                  </div>

                  {amenity.address && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                      {amenity.address.length > 60 ? amenity.address.substring(0, 60) + "..." : amenity.address}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => openInGoogleMaps(amenity.lat, amenity.lon, amenity.name)}
                  className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center space-x-1 text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View on Map</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Searching for nearby amenities...</p>
        </div>
      )}
    </div>
  )
}
