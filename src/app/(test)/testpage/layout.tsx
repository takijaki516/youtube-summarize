import "@/app/styles/globals.css";

export default function TestPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-pink-100">{children}</body>
    </html>
  );
}
