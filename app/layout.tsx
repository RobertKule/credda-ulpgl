import { Playfair_Display, Montserrat, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "CREDDA-ULPGL | Research Center on Democracy & Development",
  description: "Excellence in environmental law, climate justice, and community legal assistance in Africa.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className={`${playfair.variable} ${montserrat.variable} ${inter.variable} scroll-smooth`}>
      <body className="font-sans antialiased text-[#2D3748] bg-[#F7FAFC]">
        {children}
      </body>
    </html>
  )
}
