import { getMessages } from "next-intl/server";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import Providers from "@/components/shared/Providers";

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
    <Providers locale={locale} messages={messages}>
      <Navbar />
      <div className="m-0 p-0 pt-12">
        {children}
      </div>
      <Footer />
    </Providers>
  );
}