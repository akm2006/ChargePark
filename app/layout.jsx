import React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { MapProvider } from "./providers/MapProvider";
// import Logo from "./components/Logo"; // Import the logo component

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ChargePark - EV Charging & Smart Parking Finder",
  description: "Find nearby EV charging stations and smart parking spots with real-time availability.",
};

export default function RootLayout({ children }) {
  return (
    <MapProvider>
    <html lang="en">
      <body className={inter.className}>
        {/* <header className="p-4 flex justify-center bg-gray-100">
          <Logo />
        </header> */}
        {children}
      </body>
    </html>
    </MapProvider>
  );
}
