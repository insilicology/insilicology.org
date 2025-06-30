'use client'

import Link from 'next/link'
import { MessageCircle, Bot } from 'lucide-react'

export default function SupportSection() {
  return (
    <div className="p-2 md:p-4">
      <h1 className="text-xl font-bold mb-4">সাপোর্ট সেন্টার</h1>

      <div className="space-y-6">
        {/* AI Agent Support Box */}
        <div className="bg-white border border-transparent hover:border-amber-300 shadow-sm transition rounded-xl p-6 flex flex-col sm:flex-row items-start gap-4">
          <div className="bg-amber-100 text-amber-800 p-4 rounded-full">
            <Bot size={32} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Support via Messenger</h2>
            <p className="text-gray-700 mb-4">
              Get support from us in Messenger. It works 24/7 and gives you the answer in the shortest time.
            </p>
            <Link
              href="https://m.me/insilicology"
              target="_blank"
              className="inline-block bg-amber-400 hover:bg-amber-700 text-white text-sm px-4 py-2 rounded-md"
            >
              Send Message
            </Link>
          </div>
        </div>

        {/* Human Support Box */}
        <div className="bg-white border border-transparent hover:border-amber-300 shadow-sm transition rounded-xl p-6 flex flex-col sm:flex-row items-start gap-4">
          <div className="bg-amber-100 text-amber-800 p-4 rounded-full">
            <MessageCircle size={32} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Support via WhatsApp</h2>
            <p className="text-gray-700 mb-4">
              Send message to our WhatsApp number. It works 24/7 and gives you the answer in the shortest time.
            </p>
            <Link
              href="https://wa.me/8801842221872?text=Hi!%20I%20want%20to%20talk%20to%20a%20human%20support%20agent"
              target="_blank"
              className="inline-block bg-amber-400 hover:bg-amber-700 text-white text-sm px-4 py-2 rounded-md"
            >
              Send Message
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
