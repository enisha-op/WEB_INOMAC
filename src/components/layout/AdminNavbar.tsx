'use client'
import { LogOut, LayoutDashboard, User } from "lucide-react";
import { useRouter } from "next/navigation";

export const AdminNavbar = () => {
  const router = useRouter();

  return (
    <nav className="w-full bg-black border-b border-white/10 px-8 py-4 flex justify-between items-center z-[110]">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
        <h2 className="text-xl font-light tracking-tighter uppercase text-white">
          INO<span className="font-black italic" style={{ color: '#E60000' }}>MAC</span>
        </h2>
        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/50 uppercase font-bold tracking-widest ml-2">
          Admin
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest">
          <User size={14} />
          <span>Administrador</span>
        </div>
        
        <button 
          onClick={() => router.push('/login')}
          className="flex items-center gap-2 bg-[#E60000]/10 hover:bg-[#E60000] text-[#E60000] hover:text-white px-4 py-2 rounded-sm transition-all text-xs font-black uppercase tracking-widest"
        >
          <LogOut size={16} />
          <span className="hidden md:block">Salir</span>
        </button>
      </div>
    </nav>
  );
};