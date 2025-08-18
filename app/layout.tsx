import type { Metadata } from "next";
import { Hind_Siliguri, Geist_Mono } from "next/font/google";
import "./globals.css";
import ogImage from './opengraph-image.png';
import WhatsAppButton from "@/components/WhatsAppButton";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/Providers";

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Insilicology",
    template: "%s | Insilicology",
  },
  description: "Molecular Biology, Genetics, and Biotechnology",
  metadataBase: new URL("https://insilicology.org"),
  keywords: [
    "insilicology",
  ],
  openGraph: {
    title: {
      default: "Insilicology",
      template: "%s | Insilicology",
    },
    description: "Molecular Biology, Genetics, and Biotechnology",
    url: "https://insilicology.org",
    siteName: 'Insilicology',
    images: [
      {
        url: ogImage.src,
        width: ogImage.width,
        height: ogImage.height
      },
    ],
    type: "website",
  },
  twitter: {
    title: {
      default: "Insilicology",
      template: "%s | Insilicology",
    },
    description: "Molecular Biology, Genetics, and Biotechnology",
    images: [
      {
        url: ogImage.src,
        width: ogImage.width,
        height: ogImage.height
      },
    ],
  },
  verification: {
    google: "Qm4GMTrrOVWmVFuRd_bgJjs0fRBBvzv6GwaI5aJrpV8",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${hindSiliguri.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <Toaster position="top-center" />
          {children}
          {/* WhatsApp Button */}
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
