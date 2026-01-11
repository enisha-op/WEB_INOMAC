'use client'
import { motion } from "framer-motion";
import { Facebook, Instagram, Linkedin } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white pt-24 pb-12 border-t border-white/10">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          
          {/* Logo y Branding */}
          <div className="md:col-span-4">
            <h2 className="text-2xl font-light tracking-[0.3em] uppercase mb-8">
              INO<span className="font-black italic text-primary">MAC</span>
            </h2>
            <p className="text-white/40 text-[11px] font-light leading-relaxed tracking-wider uppercase max-w-xs">
              Líderes en ingeniería de transporte de alto rendimiento. Elevando los estándares de potencia y eficiencia en cada carretera del país.
            </p>
          </div>
          
          {/* Enlaces Rápidos */}
          <div className="md:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] mb-8 text-white/30">Modelos</h4>
            <ul className="space-y-4 text-[10px] font-bold tracking-[0.1em] uppercase">
              <li><a href="#catalogo" className="text-white/60 hover:text-primary transition-colors">Titan Series</a></li>
              <li><a href="#catalogo" className="text-white/60 hover:text-primary transition-colors">Vulcan Series</a></li>
              <li><a href="#catalogo" className="text-white/60 hover:text-primary transition-colors">Roadstar</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] mb-8 text-white/30">Empresa</h4>
            <ul className="space-y-4 text-[10px] font-bold tracking-[0.1em] uppercase">
              <li><a href="#inicio" className="text-white/60 hover:text-primary transition-colors">Inicio</a></li>
              <li><a href="#financiamiento" className="text-white/60 hover:text-primary transition-colors">Finanzas</a></li>
              <li><a href="#contacto" className="text-white/60 hover:text-primary transition-colors">Asesoría</a></li>
            </ul>
          </div>

          {/* Social y Contacto */}
          <div className="md:col-span-4 flex flex-col md:items-end">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] mb-8 text-white/30">Social Media</h4>
            <div className="flex gap-8 mb-12">
              <a href="#" className="text-white/40 hover:text-primary transition-colors"><Facebook size={18} strokeWidth={1.5} /></a>
              <a href="#" className="text-white/40 hover:text-primary transition-colors"><Instagram size={18} strokeWidth={1.5} /></a>
              <a href="#" className="text-white/40 hover:text-primary transition-colors"><Linkedin size={18} strokeWidth={1.5} /></a>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase mb-2">Soporte 24/7</p>
              <p className="text-lg font-light tracking-tighter">0-800-INOMAC-PERU</p>
            </div>
          </div>
        </div>

        {/* Línea Final Legal */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] font-bold tracking-[0.3em] text-white/20 uppercase">
            © {currentYear} INOMAC S.A.C. TODOS LOS DERECHOS RESERVADOS.
          </p>
          <div className="flex gap-8 text-[9px] font-bold tracking-[0.3em] text-white/20 uppercase">
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
            <a href="#" className="hover:text-white transition-colors">Legal</a>
          </div>
        </div>
      </div>
    </footer>
  );
};