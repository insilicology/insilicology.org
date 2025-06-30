import BlogList from "@/components/blog/blog-list";
import ogImage from "@/app/opengraph-image.png";

export async function generateMetadata() {
  return {
    title: "Blog",
    description: "Explore our comprehensive blog covering web development, WordPress tutorials, coding tips, and industry insights. Stay updated with the latest trends in technology and programming.",
    keywords: [
      "blog",
      "insilicology blog",
    ],
    authors: [{ name: "Insilicology" }],
    creator: "Insilicology",
    publisher: "Insilicology",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL("https://insilicology.org"),
    alternates: {
      canonical: "/blog",
    },
    openGraph: {
      title: "Blog",
      description: "Explore our comprehensive blog covering web development, WordPress tutorials, coding tips, and industry insights. Stay updated with the latest trends in technology and programming.",
      url: "https://insilicology.org/blog",
      siteName: "Insilicology",
      images: [
        {
          url: ogImage.src,
          width: 1200,
          height: 630,
          alt: "Insilicology Blog",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Blog - Learn Web Development, WordPress & More",
      description: "Explore our comprehensive blog covering web development, WordPress tutorials, coding tips, and industry insights.",
      images: [ogImage],
      creator: "@insilicology",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default function BlogPage() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <BlogList />
    </section>
  );
}