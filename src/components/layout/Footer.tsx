'use client'
import { Facebook, Instagram, Linkedin } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    /* Fondo negro fijo con borde sutil */
    <footer className="bg-black text-white pt-24 pb-12 border-t border-white/10">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          
          {/* Logo y Branding con acento Rojo */}
          <div className="md:col-span-4">
            <h2 className="text-3xl font-light tracking-[0.3em] uppercase mb-8 text-white">
              INO<span className="font-black italic text-red-600">MAC</span>
            </h2>
            <p className="text-white/60 text-sm font-medium leading-relaxed tracking-wide uppercase max-w-xs italic">
              Distribuidor Autorizado en Perú de <span className="text-white font-bold not-italic">SinoTruk</span>. 
              Respaldo, potencia y tecnología GNL líder en el mercado para el transporte pesado nacional.
            </p>
          </div>
          
          {/* Modelos Actualizados con Hover Rojo */}
          <div className="md:col-span-2">
            <h4 className="text-[12px] font-black uppercase tracking-[0.4em] mb-8 text-white/30">Modelos</h4>
            <ul className="space-y-4 text-[11px] font-bold tracking-[0.1em] uppercase">
              <li><a href="#catalogo" className="text-white/70 hover:text-red-600 transition-colors">TH7 530HP LNG</a></li>
              <li><a href="#catalogo" className="text-white/70 hover:text-red-600 transition-colors">TH7 480HP LNG</a></li>
              <li><a href="#catalogo" className="text-white/30 cursor-not-allowed">Próximos lanzamientos</a></li>
            </ul>
          </div>

          {/* Enlaces de Empresa con Hover Rojo */}
          <div className="md:col-span-2">
            <h4 className="text-[12px] font-black uppercase tracking-[0.4em] mb-8 text-white/30">Empresa</h4>
            <ul className="space-y-4 text-[11px] font-bold tracking-[0.1em] uppercase">
              <li><a href="#inicio" className="text-white/70 hover:text-red-600 transition-colors">Inicio</a></li>
              <li><a href="#financiamiento" className="text-white/70 hover:text-red-600 transition-colors">Finanzas</a></li>
              <li><a href="#contacto" className="text-white/70 hover:text-red-600 transition-colors">Asesoría</a></li>
            </ul>
          </div>

          {/* Social y Contacto con Iconos Rojos al Hover */}
          <div className="md:col-span-4 flex flex-col md:items-end">
            <h4 className="text-[12px] font-black uppercase tracking-[0.4em] mb-8 text-white/30">Social Media</h4>
            <div className="flex gap-8 mb-12">
              <a href="#" className="text-white/60 hover:text-red-600 transition-all hover:scale-110"><Facebook size={22} strokeWidth={1.5} /></a>
              <a href="#" className="text-white/60 hover:text-red-600 transition-all hover:scale-110"><Instagram size={22} strokeWidth={1.5} /></a>
              <a href="#" className="text-white/60 hover:text-red-600 transition-all hover:scale-110"><Linkedin size={22} strokeWidth={1.5} /></a>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-black tracking-[0.2em] text-white/40 uppercase mb-2">Soporte Directo</p>
              <p className="text-2xl font-bold tracking-tighter text-white">+51 949 119 350</p>
            </div>
          </div>
        </div>

        {/* Línea Final Legal */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase">
            © {currentYear} INOMAC S.A.C. DISTRIBUIDOR AUTORIZADO SINOTRUK PERÚ.
          </p>
          <div className="flex gap-8 text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase">
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Términos Legales</a>
          </div>
        </div>
      </div>
    </footer>
  );
};