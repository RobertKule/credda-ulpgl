import { getMessages } from "next-intl/server";
import Providers from "@/components/shared/Providers";
import MainLayoutWrapper from "@/components/shared/MainLayoutWrapper";

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
       {/* MainLayoutWrapper gère l'inclusion de Navbar/Footer et les marges conditionnelles */}
       <MainLayoutWrapper>
         {children}
       </MainLayoutWrapper>
    </Providers>
  );
}