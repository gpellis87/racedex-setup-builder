import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RaceDex.gg Setup Builder — NASCAR Oval Setup Assistant",
  description:
    "AI-powered iRacing setup builder by RaceDex.gg. Get expert oval setup advice for NASCAR Cup Next Gen, Xfinity, and Craftsman Truck series.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans">{children}</body>
    </html>
  );
}
