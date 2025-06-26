"use client"

import { useState } from "react"
import { Copy, Check, Smartphone, QrCode } from "lucide-react"

export default function EasyPaisaPayment({ amount, onPaymentComplete, onCancel, isAdmin = false }) {
  const [copied, setCopied] = useState(false)

  const EASYPAISA_NUMBER = "03343282332"
  const DISCOUNT_PER_HOUR = 10

  // Final amount calculation
  const finalAmount = isAdmin ? amount : amount - DISCOUNT_PER_HOUR * Math.ceil(amount / 100)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(EASYPAISA_NUMBER)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-2">EasyPaisa Payment</h2>
          <p className="text-gray-600 dark:text-gray-400">Complete your parking booking payment</p>
        </div>

        {/* Discount for User */}
        {!isAdmin && (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700 mb-4">
            <div className="text-center">
              <p className="text-sm text-green-700 dark:text-green-300 mb-1">🎉 EasyPaisa Discount Applied!</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700 dark:text-green-300">Original Amount:</span>
                <span className="text-sm line-through text-gray-500">Rs. {amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700 dark:text-green-300">Discount:</span>
                <span className="text-sm text-green-600 dark:text-green-400">-Rs. {amount - finalAmount}</span>
              </div>
              <hr className="my-2 border-green-200 dark:border-green-700" />
              <div className="flex justify-between items-center">
                <span className="font-semibold text-green-700 dark:text-green-300">You Pay:</span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">Rs. {finalAmount}</span>
              </div>
            </div>
          </div>
        )}

        {/* Admin View */}
        {isAdmin && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700 mb-4">
            <div className="text-center">
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">Admin Booking</p>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-blue-700 dark:text-blue-300">Amount to Pay:</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">Rs. {finalAmount}</span>
              </div>
            </div>
          </div>
        )}

        {/* EasyPaisa Number */}
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">EasyPaisa Number</p>
              <p className="text-xl font-bold text-black dark:text-white">{EASYPAISA_NUMBER}</p>
            </div>
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span className="text-sm">{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>
        </div>

        {/* ✅ Static QR Code */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <QrCode className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
            <h4 className="font-semibold text-black dark:text-white">Scan QR Code</h4>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 dark:border-gray-700 inline-block">
            <img
              src="/images/easypaisa-qr.png"
              alt="EasyPaisa Payment QR Code"
              className="w-48 h-48 mx-auto object-contain"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Scan with EasyPaisa app or any QR scanner</p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700 mb-6">
          <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Payment Instructions:</h4>
          <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>1. Open EasyPaisa app or dial *786#</li>
            <li>
              2. Send Rs. {finalAmount} to {EASYPAISA_NUMBER}
            </li>
            <li>3. Or scan the QR code above</li>
            <li>4. Click "Payment Complete" after sending</li>
          </ol>
        </div>

        {/* Savings Message for User */}
        {!isAdmin && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-700 mb-6">
            <p className="text-sm text-yellow-800 dark:text-yellow-300 text-center">
              💰 You saved Rs. {amount - finalAmount} by choosing EasyPaisa!
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onPaymentComplete}
            className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            ✅ Payment Complete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-300 dark:bg-gray-600 text-black dark:text-white py-3 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors font-semibold"
          >
            Cancel
          </button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
          💡 Keep your transaction receipt for verification
        </p>
      </div>
    </div>
  )
}
