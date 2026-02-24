import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import "../globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export const metadata = {
  title: "CREDDa - ULPGL",
  description: "Centre de Recherche en Droit et Développement de l'ULPGL",
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
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar />
          <div className="m-0 p-0 pt-12">
            {children}
          </div>


          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}