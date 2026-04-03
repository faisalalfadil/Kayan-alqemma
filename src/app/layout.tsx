import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "شركة كيان القمة | توريد وتركيب المظلات الكهربائية",
    template: "%s | شركة كيان القمة",
  },
  description:
    "شركة كيان القمة - الخيار الأول في توريد وتركيب المظلات الكهربائية بأعلى جودة وأفضل الأسعار في المملكة العربية السعودية. خبرة تتجاوز 15 عامًا في تقديم حلول المظلات المتطورة.",
  keywords: [
    "مظلات كهربائية",
    "توريد مظلات",
    "تركيب مظلات",
    "مظلات",
    "كنب حديقة",
    "مظلات سيارات",
    "شركة مظلات",
    "كيان القمة",
    "المملكة العربية السعودية",
  ],
  authors: [{ name: "شركة كيان القمة" }],
  creator: "شركة كيان القمة",
  publisher: "شركة كيان القمة",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  metadataBase: new URL("https://kayan-alaqma.sa"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "شركة كيان القمة | توريد وتركيب المظلات الكهربائية",
    description:
      "الخيار الأول في توريد وتركيب المظلات الكهربائية بأعلى جودة وأفضل الأسعار. خبرة تتجاوز 15 عامًا.",
    url: "https://kayan-alaqma.sa",
    siteName: "شركة كيان القمة",
    locale: "ar_SA",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "شركة كيان القمة",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "شركة كيان القمة | توريد وتركيب المظلات الكهربائية",
    description:
      "الخيار الأول في توريد وتركيب المظلات الكهربائية بأعلى جودة وأفضل الأسعار.",
    images: ["/og-image.jpg"],
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
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "شركة كيان القمة",
    description:
      "توريد وتركيب المظلات الكهربائية بأعلى جودة وأفضل الأسعار",
    url: "https://kayan-alaqma.sa",
    telephone: "+966501234567",
    email: "info@kayan-alaqma.sa",
    address: {
      "@type": "PostalAddress",
      streetAddress: "طريق الملك فهد، حي العليا",
      addressLocality: "الرياض",
      addressRegion: "الرياض",
      postalCode: "12211",
      addressCountry: "SA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 24.7136,
      longitude: 46.6753,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Saturday",
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
        ],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    sameAs: [
      "https://twitter.com/kayan_alaqma",
      "https://instagram.com/kayan_alaqma",
    ],
  };

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${cairo.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
