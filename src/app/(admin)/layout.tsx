'use client'
import { AdminNavbar } from "@/components/layout/AdminNavbar";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      {/* El div ahora no tiene un fondo fijo para permitir que el tema lo controle */}
      <div className="min-h-screen transition-colors duration-500">
        <AdminNavbar />
        <main>
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}