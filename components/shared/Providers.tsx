"use client";

import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import SmoothScroll from "./SmoothScroll";
import { ThemeProvider } from "./ThemeProvider";

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
            {children}
          </SmoothScroll>
        </NextIntlClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
