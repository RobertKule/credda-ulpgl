import { getMessages } from "next-intl/server";
import { Lora, Inter } from 'next/font/google'
import Providers from "@/components/shared/Providers";
import MainLayoutWrapper from "@/components/shared/MainLayoutWrapper";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import { sql } from "@/lib/db";
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

  const messages = await getMessages({ locale });

  // Fetch active announcements (with trilingual support)
  const announcements = (await sql`
    SELECT a.id, t.content, a."isActive"
    FROM "Announcement" a
    JOIN "AnnouncementTranslation" t ON t."announcementId" = a.id
    WHERE a."isActive" = true AND t.language = ${locale}
    ORDER BY a."createdAt" DESC
  `.catch(() => [])) as { id: string; content: string; isActive: boolean }[];

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
      <body className="font-sans antialiased text-foreground bg-background relative">
        {announcements && announcements.length > 0 && <AnnouncementBar announcements={announcements} />}
        <Providers locale={locale} messages={messages}>
          <MainLayoutWrapper>
            {children}
          </MainLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}