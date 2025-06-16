"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function FAQAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-4 w-full">
      {faqs.map((faq, index) => (
        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button
            className="flex justify-between items-center w-full p-4 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            onClick={() => toggleFAQ(index)}
            aria-expanded={openIndex === index}
          >
            <span className="font-medium text-black dark:text-white">{faq.question}</span>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform ${
                openIndex === index ? "transform rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-96" : "max-h-0"}`}
          >
            <div className="p-4 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">{faq.answer}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
