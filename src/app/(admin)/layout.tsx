'use client'
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Definimos si estamos en login para ocultar el sidebar
  const isLoginPage = pathname === "/admin/login" || pathname === "/login";

  return (
    <ThemeProvider>
      <div className="flex min-h-screen bg-theme transition-colors duration-500">
        
        {/* Sidebar: Se mantiene fijo a la izquierda */}
        {!isLoginPage && <AdminSidebar />}

        {/* Contenedor de contenido: Sin Navbar, el contenido empieza arriba de todo */}
        <div className="flex flex-col flex-grow w-full min-w-0">
          
          <main className={`flex-grow ${!isLoginPage ? "p-8 md:p-12" : "w-full"}`}>
            {/* El contenido ahora inicia desde el borde superior de la pantalla */}
            {children}
          </main>
          
        </div>
      </div>
    </ThemeProvider>
  );
}