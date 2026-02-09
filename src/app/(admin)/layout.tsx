'use client'
import { useState, useEffect } from "react"; //
import { usePathname, useRouter } from "next/navigation"; //
import { ThemeProvider } from "@/components/ThemeProvider";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter(); //
  const [authorized, setAuthorized] = useState(false); //

  // Definimos si estamos en login para ocultar el sidebar y saltar la protección
  const isLoginPage = pathname === "/admin/login" || pathname === "/login";

  useEffect(() => {
    // Si no es la página de login, verificamos la sesión
    if (!isLoginPage) {
      const isLoggedIn = localStorage.getItem("isLoggedIn"); //

      if (!isLoggedIn) {
        // Si no hay sesión, mandamos al login de inmediato
        router.push("/login"); //
      } else {
        // Si hay sesión, autorizamos la vista
        setAuthorized(true); //
      }
    } else {
      // En la página de login siempre estamos "autorizados" a verla
      setAuthorized(true);
    }
  }, [isLoginPage, router]);

  // Mientras verifica o redirige, mostramos un estado de carga elegante
  if (!authorized && !isLoginPage) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#E60000]" size={40} />
        <p className="text-[#E60000] font-black uppercase text-[10px] tracking-[0.3em]">
          Verificando Acceso...
        </p>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="flex min-h-screen bg-theme transition-colors duration-500">
        
        {/* Sidebar: Se mantiene fijo a la izquierda si no es login */}
        {!isLoginPage && <AdminSidebar />}

        <div className="flex flex-col flex-grow w-full min-w-0">
          <main className={`flex-grow ${!isLoginPage ? "p-8 md:p-12" : "w-full"}`}>
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}