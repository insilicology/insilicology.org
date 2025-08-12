import type { Metadata } from "next";
import { Hind_Siliguri, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
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
      <head>
        {/* Meta Pixel (noscript) must live in the document head to satisfy App Router constraints */}
        <noscript>
          <img height="1" width="1" src="https://www.facebook.com/tr?id=1327822238919663&ev=PageView&noscript=1" />
        </noscript>
      </head>
      {/* Google Analytics */}
      {/* <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-PCF0FZZ4HS"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-PCF0FZZ4HS');
        `}
      </Script> */}
      {/* Google Tag Manager */}
      {/* <Script id="gtm-head" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-KVH8WPLR');
        `}
      </Script> */}
      {/* Google Ads */}
      {/* <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-17090157974"
        strategy="afterInteractive"
      />
      <Script id="gtag-ads-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-17090157974');
        `}
      </Script> */}
      {/* <Script src="https://accounts.google.com/gsi/client" async defer></Script> */}

      <body className={`${hindSiliguri.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <Toaster position="top-center" />
          {/* Google Tag Manager (noscript) */}
          <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KVH8WPLR" height="0" width="0" style={{display: 'none', visibility: 'hidden'}}></iframe></noscript>
          {children}
          {/* WhatsApp Button */}
          <WhatsAppButton />
          {/* Umami Analytics */}
          <Script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id="e7217454-4abd-4503-9c59-941cac2404ec"
          />
          {/* Meta Pixel Code */}
          <Script id="meta-pixel-code" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '1327822238919663'); fbq('track', 'PageView');
            `}
          </Script>
        </Providers>
      </body>
    </html>
  );
}
