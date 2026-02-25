import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a0f",
};

export const metadata: Metadata = {
  title: "RaceDex.gg Setup Builder — NASCAR Oval Setup Assistant",
  description:
    "AI-powered iRacing setup builder by RaceDex.gg. Get expert oval setup advice for NASCAR Cup Next Gen, Xfinity, and Craftsman Truck series.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RaceDex Setup Builder",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans">{children}</body>
    </html>
  );
}
