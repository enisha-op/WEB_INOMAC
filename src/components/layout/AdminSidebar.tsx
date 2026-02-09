'use client'
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Truck, LogOut, FileText, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); // Estado para el menú móvil

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  };

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Cotizaciones", href: "/quotes", icon: <FileText size={20} /> },
    { name: "Inventario", href: "/inventory", icon: <Truck size={20} /> },
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* BOTÓN HAMBURGUESA (Solo visible en móviles) */}
      <div className="lg:hidden fixed top-4 left-4 z-[400]">
        <button 
          onClick={() => setIsOpen(true)}
          className="p-3 bg-primary text-white rounded-sm shadow-2xl"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* OVERLAY Y MENÚ MÓVIL */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-[450] lg:hidden"
            />
            <motion.aside 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 w-72 h-full bg-[var(--card-bg)] border-r border-theme p-8 z-[500] flex flex-col justify-between lg:hidden"
            >
              <div>
                <div className="flex justify-between items-center mb-12">
                  <div>
                    <h2 className="text-2xl font-black italic text-primary">INOMAC</h2>
                    <p className="text-[10px] text-muted-theme uppercase font-bold tracking-widest">Admin Panel</p>
                  </div>
                  <button onClick={closeMenu} className="text-muted-theme hover:text-primary"><X size={28} /></button>
                </div>

                <nav className="space-y-4">
                  {menuItems.map((item) => (
                    <Link 
                      key={item.href} 
                      href={item.href}
                      onClick={closeMenu}
                      className={`flex items-center gap-4 p-5 rounded-sm transition-all text-[11px] font-black uppercase tracking-widest ${
                        pathname === item.href ? "bg-primary text-white shadow-xl" : "text-muted-theme hover:bg-white/5"
                      }`}
                    >
                      {item.icon} {item.name}
                    </Link>
                  ))}
                </nav>
              </div>

              <button onClick={handleLogout} className="flex items-center gap-4 p-5 text-muted-theme hover:text-red-500 transition-colors text-[11px] font-black uppercase tracking-widest border-t border-theme">
                <LogOut size={20} /> Cerrar Sesión
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* SIDEBAR DESKTOP (Visible solo en lg: pantallas grandes) */}
      <aside className="hidden lg:flex w-64 min-h-screen bg-[var(--card-bg)] border-r border-theme p-6 flex-col justify-between sticky top-0">
        <div>
          <div className="mb-12">
            <h2 className="text-2xl font-black italic text-primary">INOMAC</h2>
            <p className="text-[10px] text-muted-theme uppercase font-bold tracking-widest">Admin Panel</p>
          </div>

          <nav className="space-y-4">
            {menuItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-4 p-4 rounded-sm transition-all text-[10px] font-black uppercase tracking-widest ${
                  pathname === item.href 
                  ? "bg-primary text-white shadow-xl shadow-red-900/30 scale-[1.02]" 
                  : "text-muted-theme hover:bg-white/5 hover:text-primary"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 p-4 text-muted-theme hover:text-red-500 transition-colors text-[10px] font-black uppercase tracking-widest border-t border-theme pt-8 w-full"
        >
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </aside>
    </>
  );
};