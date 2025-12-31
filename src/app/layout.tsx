import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import QueryProvider from "@/components/providers/QueryProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Skill Swap - Trade Knowledge, Not Money",
  description: "A platform to exchange skills with others.",
};

import AuthProvider from "@/components/providers/AuthProvider";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <AuthProvider>
          <QueryProvider>
            <Navbar />
            <main>{children}</main>
            <Toaster position="top-center" richColors />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
