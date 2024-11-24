import "@/app/styles/globals.css";

import { QueryProviders } from "@/components/query-provider";
import { Sidebar } from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className="flex h-dvh overflow-hidden">
        <QueryProviders>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Sidebar />
            {children}
          </ThemeProvider>
        </QueryProviders>
      </body>
    </html>
  );
}
