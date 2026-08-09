import type { Metadata } from "next";
import { Onest, Rubik } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SiteShell } from "@/components/layout/site-shell";
import { CommerceProvider } from "@/components/commerce/commerce-provider";
import "./globals.css";

const onest = Onest({ subsets: ["latin"], variable: "--font-onest" });
const rubik = Rubik({ subsets: ["latin"], variable: "--font-rubik" });

export const metadata: Metadata = {
  metadataBase: new URL("https://apvmechanics.com.au"),
  title: "Mobile Mechanic Hobart | APV Mobile Mechanics",
  description: "Need a mechanic in Hobart? APV Mobile Mechanics comes to your home, office or roadside with expert repairs, servicing and diagnostics. Call 0424 411 375.",
  icons: { icon: "/assets/images/resources/apv-bear-logo.png" },
  openGraph: {
    title: "Mobile Mechanic Hobart | APV Mobile Mechanics",
    description: "Need a mechanic in Hobart? APV Mobile Mechanics comes to your home, office or roadside with expert repairs, servicing and diagnostics. Call 0424 411 375.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "APV Mobile Mechanics expert car care center" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["AutoRepair", "LocalBusiness"],
      "@id": "https://apvmechanics.com.au/#business",
      "name": "APV Mobile Mechanics",
      "url": "https://apvmechanics.com.au",
      "email": "apvmobilemechanics@gmail.com",
      "telephone": "0424 411 375",
      "logo": "https://apvmechanics.com.au/assets/images/resources/apv-mobile-mechanics-logo.jpeg",
      "image": "https://apvmechanics.com.au/assets/images/resources/apv-mobile-mechanics-logo.jpeg",
      "hasMap": "https://www.google.com/maps/place/APV+mobile+Mechanics/@-42.7871385,147.2448997,17z/data=!3m1!4b1!4m6!3m5!1s0xaa6e0d2733b06751:0xe9d97dff7c553e69!8m2!3d-42.7871425!4d147.24748!16s%2Fg%2F11z96__8np!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDgwMy4wIKXMDSoASAFQAw%3D%3D",
      "sameAs": ["https://www.google.com/maps/place/APV+mobile+Mechanics/@-42.7871385,147.2448997,17z/data=!3m1!4b1!4m6!3m5!1s0xaa6e0d2733b06751:0xe9d97dff7c553e69!8m2!3d-42.7871425!4d147.24748!16s%2Fg%2F11z96__8np!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDgwMy4wIKXMDSoASAFQAw%3D%3D"],
      "priceRange": "$$",
      "openingHours": "Mo-Fr 08:00-17:00",
      "description": "Professional mobile car repair, engine diagnostics, brake repair, battery replacement, and emergency roadside assistance.",
      "areaServed": ["Hobart", "Sandy Bay", "Battery Point", "West Hobart", "South Hobart", "New Town", "Lenah Valley", "Glenorchy", "Moonah", "Derwent Park", "Claremont", "Rosny Park", "Bellerive", "Howrah", "Lindisfarne", "Kingston", "Blackmans Bay", "Mount Nelson"],
      "serviceType": ["Mobile Car Repair", "Engine Diagnostics", "Brake Repair", "Battery Replacement", "Oil Change", "Emergency Roadside Assistance", "Vehicle Inspection", "Electrical Repairs"]
    },
    {
      "@type": "Organization",
      "@id": "https://apvmechanics.com.au/#organization",
      "name": "APV Mobile Mechanics",
      "url": "https://apvmechanics.com.au",
      "email": "apvmobilemechanics@gmail.com",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "0424 411 375",
        "email": "apvmobilemechanics@gmail.com",
        "contactType": "customer service",
        "availableLanguage": "English",
      },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${onest.variable} ${rubik.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <CommerceProvider>
          <SiteShell>{children}</SiteShell>
          <Analytics />
          <SpeedInsights />
        </CommerceProvider>
      </body>
    </html>
  );
}
