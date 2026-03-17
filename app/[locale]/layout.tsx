import { Playfair_Display, Montserrat, Inter } from "next/font/google";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import "../globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import SmoothScroll from "@/components/shared/SmoothScroll";

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

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const { locale } = (await params) as { locale: string };

  // ✅ getMessages attend un objet { locale: string }
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className={`${playfair.variable} ${montserrat.variable} ${inter.variable} scroll-smooth`}>
      <body className="font-sans antialiased text-[#2D3748] bg-[#F7FAFC]">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SmoothScroll>
            <Navbar />
            <div className="m-0 p-0 pt-12">
              {children}
            </div>
            <Footer />
          </SmoothScroll>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}