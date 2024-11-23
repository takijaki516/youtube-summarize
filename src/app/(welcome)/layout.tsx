import type { Metadata } from "next";
import "@/app/styles/globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";
import { TailwindIndicator } from "@/components/tailwind-indicator";

export const metadata: Metadata = {
  title: "vercel ai video summarizer",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "relative flex min-h-screen flex-col bg-background antialiased",
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="container flex-1">{children}</main>
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
