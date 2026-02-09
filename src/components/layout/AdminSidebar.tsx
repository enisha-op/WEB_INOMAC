'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Truck, LogOut, FileText } from "lucide-react"; // Importamos FileText

export const AdminSidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { 
      name: "Dashboard", 
      href: "/dashboard", 
      icon: <LayoutDashboard size={20} /> 
    },
    { 
      name: "Cotizaciones", 
      href: "/quotes", // Nueva ruta separada
      icon: <FileText size={20} /> 
    },
    { 
      name: "Inventario", 
      href: "/inventory", 
      icon: <Truck size={20} /> 
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[var(--card-bg)] border-r border-theme p-6 flex flex-col justify-between sticky top-0">
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

      <button className="flex items-center gap-4 p-4 text-muted-theme hover:text-red-500 transition-colors text-[10px] font-black uppercase tracking-widest border-t border-theme pt-8">
        <LogOut size={20} />
        Cerrar Sesión
      </button>
    </aside>
  );
};