import { getMessages } from "next-intl/server";
import { Fraunces, Bricolage_Grotesque, Outfit } from 'next/font/google'
import Providers from "@/components/shared/Providers";
import MainLayoutWrapper from "@/components/shared/MainLayoutWrapper";
import "../globals.css";

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
  preload: true,
})

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-bricolage',
  display: 'swap',
  preload: true,
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-outfit',
  display: 'swap',
  preload: true,
})

import SystemBanner from "@/components/shared/SystemBanner";

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
    <html lang={locale} suppressHydrationWarning className={`${fraunces.variable} ${bricolage.variable} ${outfit.variable} scroll-smooth`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                let theme = localStorage.getItem('credda-theme');
                if (!theme) {
                  theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
                }
                document.documentElement.classList.add(theme);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="font-outfit antialiased bg-background text-foreground">
        <Providers locale={locale} messages={messages}>
          <MainLayoutWrapper>
            {children}
          </MainLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}