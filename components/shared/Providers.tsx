"use client";

import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import SmoothScroll from "./SmoothScroll";
import { ThemeProvider } from "./ThemeProvider";
import { LazyMotion, domMax } from "framer-motion";

export default function Providers({ 
  children, 
  locale, 
  messages 
}: { 
  children: React.ReactNode; 
  locale: string; 
  messages: any; 
}) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <NextIntlClientProvider locale={locale} messages={messages} timeZone="Africa/Lubumbashi">
          <SmoothScroll>
            <LazyMotion features={domMax}>
              {children}
            </LazyMotion>
          </SmoothScroll>
        </NextIntlClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
