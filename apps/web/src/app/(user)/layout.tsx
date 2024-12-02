import { QueryProviders } from "@/components/query-provider";
import { Sidebar } from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProviders>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        {children}
        <Toaster richColors={true} />
      </div>
    </QueryProviders>
  );
}
