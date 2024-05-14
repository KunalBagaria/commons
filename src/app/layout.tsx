import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Internet Common Room",
  description: "Inspired by the Hogwarts Common Rooms, this is a place for the internet to come together and share their thoughts, ideas, and creations in real time, without it being stored anywhere.",
  openGraph: {
    title: "The Internet Common Room",
    description: "Inspired by the Hogwarts Common Rooms, this is a place for the internet to come together and share their thoughts, ideas, and creations in real time, without it being stored anywhere.",
    url: "https://commons.kunalbagaria.com",
    type: "website",
    images: [
      {
        url: "https://i.imgur.com/xA0IGFR.png",
        width: 1200,
        height: 630,
        alt: "The Internet Common Room",
      },
    ],
  },
  twitter: {
    images: [
      {
        url: "https://i.imgur.com/xA0IGFR.png",
        width: 1200,
        height: 630,
        alt: "The Internet Common Room",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
