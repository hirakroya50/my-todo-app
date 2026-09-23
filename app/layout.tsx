import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Providers } from "@/components/providers";
import { AuthSessionProvider } from "@/components/session-provider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "dev_todo",
  description: "Personal dev project checklists",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <head>
        {/* Must load before extension inpage scripts where possible */}
        <script src="/block-wallet-extensions.js" />
      </head>
      <body className="min-h-full font-sans antialiased" suppressHydrationWarning>
        <AuthSessionProvider>
          <Providers>{children}</Providers>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
