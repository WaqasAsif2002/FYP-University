"use client"

import type React from "react"
import { useState } from "react"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"

interface Message {
  id: number
  text: string
  isBot: boolean
  timestamp: Date
}

export default function ParkEaseChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your ParkEase assistant. How can I help you today? 🚗",
      isBot: true,
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const botResponses = {
    booking: {
      keywords: ["book", "booking", "reserve", "slot", "how to book", "book now", "reservation"],
      response:
        "Click on the 'Book Now' button, select your desired parking zone, choose an available time slot (shown in green), then confirm your booking. Payment will be processed automatically. 🎯",
    },
    fees: {
      keywords: ["fee", "cost", "price", "payment", "charge", "money", "discount", "rate"],
      response:
        "The standard booking fee is Rs. 100 per hour. However, if you pay via EasyPaisa, you will receive a Rs. 10 discount per hour. EasyPaisa number: 0334-3282332. 💰",
    },
    cancel: {
      keywords: ["cancel", "edit", "modify", "change", "delete", "remove", "refund"],
      response:
        "Only the admin has the right to cancel or edit bookings. You cannot directly cancel or modify a confirmed booking. To request a cancellation or change, please contact the admin. 📞",
    },
    slots: {
      keywords: ["available", "slots", "green", "red", "occupied", "free", "parking spaces"],
      response:
        "Available slots are shown in green, while booked slots are marked in red on the dashboard. You can see real-time availability and when occupied slots will be free. 🟢🔴",
    },
    duration: {
      keywords: ["duration", "time limit", "maximum", "hours", "limit", "how long"],
      response: "The maximum allowed booking duration is 10 hours per session. ⏰",
    },
    late: {
      keywords: ["late", "delay", "missed", "time period", "arrival", "grace period"],
      response:
        "After the time period expires, late arrival is not allowed. You'll need to make a new reservation for your parking needs. ⚠️",
    },
    easypaisa: {
      keywords: ["easypaisa", "easy paisa", "online payment", "digital payment", "qr code"],
      response:
        "EasyPaisa payments get a Rs. 10 discount per hour! Send payment to 0334-3282332 or scan the QR code. For example: 2 hours normally costs Rs. 200, but with EasyPaisa you pay only Rs. 180. 📱💸",
    },
    contact: {
      keywords: ["contact", "support", "help", "phone", "whatsapp", "admin", "call"],
      response:
        "For support, contact us via:\n📱 WhatsApp: 03343282332\n📧 Email: waqas.khokhar2002@gmail.com\n☎️ Call: 03343282332\nOur team is here to help! 🤝",
    },
    location: {
      keywords: ["location", "address", "where", "millennium mall", "karachi"],
      response:
        "ParkEase is located at Millennium Mall, Karachi, Pakistan. We provide secure parking solutions at this prime location. 📍",
    },
    limit: {
      keywords: ["limit", "multiple bookings", "how many", "maximum bookings"],
      response:
        "You can have a maximum of 3 active bookings at a time. Complete your previous bookings to make new ones. This ensures fair access for all users. 🎫",
    },
    hours: {
      keywords: ["open", "timing", "hours", "when", "available"],
      response: "ParkEase is available 24/7 for your convenience. Book anytime, park anytime! 🕐",
    },
    security: {
      keywords: ["safe", "security", "secure", "protection"],
      response:
        "Your vehicle is completely safe with us. We have 24/7 security monitoring and covered parking areas. 🛡️",
    },
  }

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    // Check for greetings
    if (["hi", "hello", "hey", "salam", "assalam"].some((greeting) => lowerMessage.includes(greeting))) {
      return "Hello! Welcome to ParkEase! 👋 I'm here to help you with parking bookings, payments, and any questions you have. How can I assist you today?"
    }

    // Check for thanks
    if (["thank", "thanks", "shukriya"].some((thanks) => lowerMessage.includes(thanks))) {
      return "You're welcome! Happy to help! 😊 If you have any more questions about ParkEase, feel free to ask!"
    }

    for (const [key, data] of Object.entries(botResponses)) {
      if (data.keywords.some((keyword) => lowerMessage.includes(keyword))) {
        return data.response
      }
    }

    return "I'm here to help with ParkEase! 🤖 You can ask me about:\n• Booking parking slots\n• Payment methods & discounts\n• Available parking spaces\n• Contact information\n• Pricing & policies\n\nWhat would you like to know?"
  }

  const handleSendMessage = () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getBotResponse(inputText),
        isBot: true,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 md:p-4 rounded-full shadow-lg transition-all duration-300 z-50 transform hover:scale-110"
      >
        {isOpen ? <X className="w-5 h-5 md:w-6 md:h-6" /> : <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-16 right-4 md:bottom-24 md:right-6 w-80 md:w-96 h-96 md:h-[500px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 flex flex-col max-w-[calc(100vw-2rem)]">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Bot className="w-6 h-6" />
              <div>
                <h3 className="font-semibold">ParkEase Assistant</h3>
                <p className="text-sm opacity-90">Ask me anything about parking!</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                <div
                  className={`flex items-start space-x-2 max-w-xs ${message.isBot ? "" : "flex-row-reverse space-x-reverse"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.isBot ? "bg-blue-100 dark:bg-blue-900" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    {message.isBot ? (
                      <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-lg text-sm whitespace-pre-line ${
                      message.isBot
                        ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about parking..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-black dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={isTyping || !inputText.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
