// app/[locale]/layout.tsx
import { Inter, Playfair_Display } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import "./../../app/globals.css";

import Navbar from "./../../components/shared/Navbar";
import Footer from "./../../components/shared/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // ✅ Promise obligatoire en Next 16
}) {
  const { locale } = await params; // ✅ OBLIGATOIRE

  if (!["fr", "en", "sw"].includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${playfair.variable} scroll-smooth`}
    >
      <body className="font-sans antialiased bg-white text-slate-900">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="relative flex min-h-screen flex-col">
            
            <Navbar />

            <main className="flex-1 pt-20 md:pt-28">
              {children}
            </main>

            <Footer />

          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
