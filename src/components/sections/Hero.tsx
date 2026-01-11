'use client'
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <section id="inicio" className="relative h-screen w-full flex items-end pb-20 overflow-hidden bg-black">
      {/* Background Image - Estilo Porsche: Limpio y Full Screen */}
      <div className="absolute inset-0">
        <img
          src="/hero-truck.jpg" 
          alt="Camión INOMAC"
          className="w-full h-full object-cover opacity-80"
        />
        {/* Gradiente sutil para legibilidad inferior */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-20">
        <div className="max-w-4xl">
          {/* Tag Minimalista */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <span className="text-white text-xs font-bold tracking-[0.5em] uppercase mb-4 block">
              Inomac Performance
            </span>
          </motion.div>

          {/* Título Estilo Porsche: Grande, Blanco y Elegante */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-8xl font-light text-white mb-8 tracking-tighter leading-none"
          >
            POTENCIA <br />
            <span className="font-black italic text-primary">SIN LÍMITES</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-300 mb-10 max-w-xl font-light leading-relaxed"
          >
            La excelencia en transporte de carga pesada. Descubra la nueva generación de camiones diseñados para el máximo rendimiento.
          </motion.p>

          {/* Botones Estilo Porsche: Rectangulares y Minimalistas */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button className="bg-white text-black px-10 py-4 font-bold uppercase text-xs tracking-widest hover:bg-primary hover:text-white transition-all duration-500 flex items-center justify-center gap-3">
              Explorar Modelos
              <ArrowRight size={16} />
            </button>
            <button className="bg-transparent border border-white/40 text-white px-10 py-4 font-bold uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all duration-500">
              Configurar Unidad
            </button>
          </motion.div>
        </div>
      </div>

      {/* Indicador de Scroll Minimalista a la derecha */}
      <div className="absolute right-10 bottom-10 hidden md:block">
        <div className="flex flex-col items-center gap-4">
          <span className="text-white/40 [writing-mode:vertical-lr] uppercase tracking-[0.3em] text-[10px] font-bold">Scroll</span>
          <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
            <motion.div 
              animate={{ y: [0, 48] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 w-full h-4 bg-primary"
            />
          </div>
        </div>
      </div>
    </section>
  );
};