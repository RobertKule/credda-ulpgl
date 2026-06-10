import { getMessages } from "next-intl/server";
import { Lora, Inter } from 'next/font/google'
import Providers from "@/components/shared/Providers";
import MainLayoutWrapper from "@/components/shared/MainLayoutWrapper";
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

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const { locale } = (await params) as { locale: string };

  const messages = await getMessages({ locale });

  // Fetch active announcements with title and level for the current locale
  const announcementsRaw = (await sql`
    SELECT a.id, a.level, t.title, t.content
    FROM "Announcement" a
    JOIN "AnnouncementTranslation" t ON t."announcementId" = a.id
    WHERE a."isActive" = true AND t.language = ${locale}
    ORDER BY a."createdAt" DESC
  `.catch(() => [])) as { id: string; level: string; title: string | null; content: string }[];

  const announcements = announcementsRaw.map(a => ({
    id: a.id,
    level: (a.level === "URGENT" ? "URGENT" : a.level === "WARNING" ? "WARNING" : "INFO") as "INFO" | "WARNING" | "URGENT",
    title: a.title,
    content: a.content,
  }));

  return (
    <html lang={locale} suppressHydrationWarning className={`${lora.variable} ${inter.variable} scroll-smooth overflow-x-hidden`}>
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
      <body className="font-sans antialiased text-foreground bg-background relative overflow-x-hidden">
        <Providers locale={locale} messages={messages}>
          <MainLayoutWrapper announcements={announcements}>
            {children}
          </MainLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}