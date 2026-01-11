'use client'
import { motion } from "framer-motion";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import { TRUCKS } from "@/data/trucks";

export const CatalogElite = () => {
  return (
    <section id="catalogo" className="py-32 bg-black text-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-8">
        
        {/* CABECERA MINIMALISTA ESTILO PORSCHE */}
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-24 border-b border-white/10 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-bold tracking-[0.5em] uppercase text-[10px] mb-4 block">
              Inomac Exclusive
            </span>
            <h3 className="text-4xl md:text-6xl font-light uppercase tracking-tighter">
              INVENTARIO <span className="font-black italic text-primary">ELITE</span>
            </h3>
          </motion.div>
          
          <motion.button 
            whileHover={{ x: 10 }}
            className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 hover:text-primary transition-colors duration-500 flex items-center gap-4 mt-8 md:mt-0"
          >
            VER TODOS LOS MODELOS <ChevronRight size={14} />
          </motion.button>
        </div>

        {/* GRID DE PRODUCTOS: MÁS ESPACIADO Y RECTO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {TRUCKS.map((truck, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="group relative flex flex-col"
            >
              {/* CONTENEDOR DE IMAGEN: SIN BORDES REDONDEADOS (PORSCHE STYLE) */}
              <div className="relative aspect-[16/10] mb-8 overflow-hidden bg-[#111]">
                <img 
                  src={truck.img} 
                  alt={truck.name} 
                  className="w-full h-full object-cover transition-all duration-1000 grayscale group-hover:grayscale-0 group-hover:scale-105 opacity-70 group-hover:opacity-100" 
                />
                
                {/* EFECTO OVERLAY SUTIL */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
                
                {/* BOTÓN FLOTANTE ESTILO PORSCHE */}
                <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="bg-white text-black p-4">
                    <ArrowUpRight size={20} />
                  </div>
                </div>
              </div>

              {/* INFORMACIÓN: LIMPIA Y TIPOGRÁFICA */}
              <div className="flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-2xl font-light uppercase tracking-tight group-hover:text-primary transition-colors duration-300">
                    {truck.name}
                  </h4>
                  <span className="text-[10px] font-bold tracking-widest text-primary border border-primary/30 px-2 py-1 uppercase">
                    Disponible
                  </span>
                </div>
                
                <p className="text-white/40 text-[11px] font-medium tracking-[0.1em] uppercase mb-6">
                  {truck.specs}
                </p>

                <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-white/30 text-[9px] uppercase tracking-[0.2em] mb-1">Precio base</span>
                    <span className="font-bold text-xl tracking-tight">{truck.price}</span>
                  </div>
                  
                  <button className="text-[10px] font-bold uppercase tracking-widest border-b border-primary text-primary pb-1 hover:text-white hover:border-white transition-all duration-300">
                    CONFIGURAR
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};