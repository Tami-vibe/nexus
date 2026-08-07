import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import { ConsentBanner } from "@/components/ConsentBanner";
import { PlatformShell } from "@/components/PlatformShell";
import "./globals.css";

const display = Newsreader({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
});

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Nexus OS",
  description:
    "Autonomous commerce for products, appointments, and live capacity — with an AI sales agent and visual CRM.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <PlatformShell>{children}</PlatformShell>
        <ConsentBanner />
      </body>
    </html>
  );
}
