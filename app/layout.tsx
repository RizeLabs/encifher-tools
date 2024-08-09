import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
const inter = Inter({ subsets: ["latin"] });

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
      <head><link rel="icon" href="/favicon.png" /></head>
      <body className={inter.className}>
        <NextUIProvider>{children}</NextUIProvider>
      </body>
    </html>
  );
}
