import { Fraunces, Bricolage_Grotesque, Outfit } from 'next/font/google'
import "./globals.css";

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
})

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-bricolage',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-outfit',
  display: 'swap',
})

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
    <html lang="fr" className={`${fraunces.variable} ${bricolage.variable} ${outfit.variable} scroll-smooth`}>
      <body className="font-outfit antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
