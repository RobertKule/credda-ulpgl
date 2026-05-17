import { getMessages } from "next-intl/server";
import { Lora, Inter } from 'next/font/google'
import Providers from "@/components/shared/Providers";
import MainLayoutWrapper from "@/components/shared/MainLayoutWrapper";
import "../globals.css";

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-lora',
  display: 'swap',
  preload: true,
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
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
    <html lang={locale} suppressHydrationWarning className={`${lora.variable} ${inter.variable} scroll-smooth`}>
      <head>
        <script
          id="theme-script"
          suppressHydrationWarning
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
      <body className="font-sans antialiased text-foreground bg-background w-screen overflow-x-hidden">
        <Providers locale={locale} messages={messages}>
          <MainLayoutWrapper>
            {children}
          </MainLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}