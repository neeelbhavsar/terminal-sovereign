import type { Metadata } from "next";
import "./globals.css";
import StructuredData from "./components/StructuredData";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://portfolio.neelbhavsar.dev";

export const metadata: Metadata = {
  // Basic metadata
  title: "Neel Bhavsar — Node.js Developer & Backend Architect",
  description:
    "Node.js Developer with 4+ years of experience building scalable, high-performance backend systems, RESTful APIs, and real-time applications. Available for hire.",

  // Canonical URL
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: baseUrl,
  },

  // Open Graph tags for social sharing
  openGraph: {
    type: "website",
    url: baseUrl,
    title: "Neel Bhavsar — Node.js Developer & Backend Architect",
    description:
      "Full-stack Node.js Developer specializing in RESTful APIs, database optimization, and scalable backend systems.",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Neel Bhavsar Portfolio",
      },
    ],
    siteName: "Neel Bhavsar Portfolio",
    locale: "en_US",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Neel Bhavsar — Node.js Developer & Backend Architect",
    description:
      "Full-stack Node.js Developer specializing in RESTful APIs and scalable backend systems.",
    images: [`${baseUrl}/og-image.png`],
    creator: "@neelbhavsar",
  },

  // Additional SEO
  keywords: [
    "Node.js Developer",
    "Backend Developer",
    "REST API",
    "TypeScript",
    "Express.js",
    "NestJS",
    "PostgreSQL",
    "MongoDB",
    "Web Developer",
    "Full Stack Developer",
  ],

  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="sitemap" href="/sitemap.xml" />
        <link rel="robots" href="/robots.txt" />
        <StructuredData />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
