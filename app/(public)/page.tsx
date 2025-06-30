import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import StatsSection from "@/components/home/StatsSection";
import FAQSection from "@/components/home/FAQSection";

export async function generateMetadata() {
  return {
    title: "Insilicology - Advanced Computational Biology Solutions",
    description:
      "Leading computational biology services including molecular docking, drug discovery, bioinformatics, and vaccine design. Accelerate your research with cutting-edge solutions.",
    keywords: [
      "insilicology",
      "computational biology",
      "molecular docking",
      "drug discovery",
      "bioinformatics",
      "vaccine design",
      "ADMET analysis",
      "QSAR",
      "molecular dynamics",
      "CADD"
    ],
    metadataBase: new URL('https://insilicology.org'),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: "Insilicology - Advanced Computational Biology Solutions",
      description:
        "Leading computational biology services including molecular docking, drug discovery, bioinformatics, and vaccine design.",
    },
    twitter: {
      card: 'summary_large_image',
      title: "Insilicology - Advanced Computational Biology Solutions",
      description:
        "Leading computational biology services including molecular docking, drug discovery, bioinformatics, and vaccine design.",
    },
    robots: {
      index: true,
      follow: true
    },
  };
}

export default async function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Services Section */}
      <ServicesSection />
      
      {/* Stats Section */}
      <StatsSection />
      
      {/* FAQ Section */}
      <FAQSection />
    </main>
  );
}
