// components/WhatsAppButton.tsx
import { MessageCircle } from "lucide-react";
import Link from "next/link";

export default function WhatsAppButton() {
  return (
    <Link
      href="https://wa.me/8801617082936"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={32} />
      {/* <span className="font-medium text-sm">Message us!</span> */}
    </Link>
  );
}
