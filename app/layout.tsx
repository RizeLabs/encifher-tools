import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import Navbar from "./components/Navbar";
import { Lexend } from "next/font/google";
const lexend = Lexend({ subsets: ["latin"], weight: ["100", '200', '300', '400', '500'] });

export const metadata: Metadata = {
  title: "Encifher Tools",
  description: "Bridge and Faucet for Encifher devnet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className={lexend.className}>
        <NextUIProvider>
          <Navbar />
          {children}
        </NextUIProvider>
      </body>
    </html>
  );
}
