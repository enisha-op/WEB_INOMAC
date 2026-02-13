'use client'
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export const Preloader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulamos la carga de recursos
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black"
        >
          <div className="flex flex-col items-center">
            {/* Logo con animación de entrada y pulso en ROJO */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 1, 
                repeat: Infinity, 
                repeatType: "reverse",
                ease: "easeInOut" 
              }}
              className="relative"
            >
              <h1 className="text-4xl md:text-6xl font-light tracking-[0.4em] text-white uppercase">
                INO<span className="font-black italic text-red-600">MAC</span>
              </h1>
            </motion.div>

            {/* Barra de carga minimalista en ROJO */}
            <motion.div 
              className="mt-8 h-[1px] bg-red-600"
              initial={{ width: 0 }}
              animate={{ width: "100px" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            
            {/* Opcional: Subtítulo con opacidad baja */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              className="mt-4 text-[10px] font-bold tracking-[0.5em] text-white uppercase"
            >
              High Performance
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};