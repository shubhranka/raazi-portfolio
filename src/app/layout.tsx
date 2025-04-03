import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";
import Head from "next/head";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "RaaziYog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <title>Raazi Yog - Yoga Portfolio & Wellness Services</title>
        <meta name="description" content="Explore Raazi Yog's yoga portfolio - expert wellness services, classes, and mindfulness practices." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="charset" content="UTF-8" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="yoga, wellness, mindfulness, yoga portfolio, Raazi Yog, yoga teacher, journey," />

        {/* Open Graph Tags */}
        <meta property="og:title" content="Raazi Yog - Yoga & Wellness" />
        <meta property="og:description" content="Discover yoga and mindfulness with Raazi Yog." />
        {/* <meta property="og:image" content="" /> */}
        <meta property="og:url" content="https://raaziyog.com" />
        <meta property="og:type" content="website" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Raazi Yog - Yoga & Wellness" />
        <meta name="twitter:description" content="Discover yoga and mindfulness with Raazi Yog." />
        {/* <meta name="twitter:image" content="https://raaziyog.com/images/yoga-logo.jpg" /> */}

        <link rel="canonical" href="https://raaziyog.com" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <>
        {children}
        </>
        <Toaster />
      </body>
    </html>
  );
}
