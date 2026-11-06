import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers";
import { SpeedInsights } from '@vercel/speed-insights/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DDUGU Smart Classroom Management System | IET & Deeksha Bhawan",
  description:
    "Production-style Smart Classroom, Timetable, IoT Telemetry and Facility Booking Portal for Deen Dayal Upadhyaya Gorakhpur University (IET & Deeksha Bhawan).",
  keywords: [
    "DDUGU",
    "Gorakhpur University",
    "Smart Classroom",
    "IET Gorakhpur",
    "Deeksha Bhawan",
    "Lecture Theatres",
    "Academic Timetable",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 text-slate-900 font-sans">
        <AppProviders>{children}</AppProviders>
        <SpeedInsights />
      </body>
    </html>
  );
}
