import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// TX Tech Font - Custom local font
const TxTechFont = localFont({
  src: [
    {
      path: "../public/fonts/tx-tech-font-regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/tx-tech-font-semibold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/tx-tech-font-bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-tx-tech",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Spa Nhuy - Your Journey to Wellness",
  description: "Experience tranquility and rejuvenation with our premium spa services. Book your appointment today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${TxTechFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
