'use client'
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, Download, ChevronRight } from "lucide-react";
import { TRUCKS } from "@/data/trucks";

export const CatalogElite = () => {
  const [selectedTruck, setSelectedTruck] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState<string>("");
  const [viewIndex, setViewIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewIndex((prev) => (prev === 0 ? 1 : 0));
    }, 4000); 
    return () => clearInterval(interval);
  }, []);

  const openDetails = (truck: any) => {
    setSelectedTruck(truck);
    setActiveImage(truck.img);
    setIsModalOpen(true);
  };

  return (
    <section id="catalogo" className="py-32 bg-theme text-theme transition-colors duration-500 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-24 border-b border-theme pb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-primary font-bold tracking-[0.5em] uppercase text-[10px] mb-4 block">Distribuidor Autorizado</span>
            <h3 className="text-4xl md:text-6xl font-light uppercase tracking-tighter">
              INVENTARIO <span className="font-black italic text-primary">SINOTRUK</span>
            </h3>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          {TRUCKS.map((truck, i) => (
            <motion.div 
              key={i}
              className="group relative flex flex-col cursor-pointer"
              onClick={() => openDetails(truck)}
            >
              <div className="relative aspect-video mb-8 overflow-hidden bg-theme-border/10 rounded-sm">
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-[9px] text-white font-bold uppercase tracking-widest">
                    {viewIndex === 0 ? 'Frente' : 'Lateral'}
                  </span>
                </div>

                <motion.img animate={{ opacity: viewIndex === 0 ? 1 : 0 }} transition={{ duration: 1 }} src={truck.img} className="w-full h-full object-cover" />
                {truck.imgSide && (
                  <motion.img animate={{ opacity: viewIndex === 1 ? 1 : 0 }} transition={{ duration: 1 }} src={truck.imgSide} className="absolute inset-0 w-full h-full object-cover" />
                )}

                <div className="absolute inset-0 bg-black/5" />
                <div className="absolute bottom-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="bg-primary text-white p-5 shadow-2xl">
                    <ArrowUpRight size={24} strokeWidth={3} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col grow px-2">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-2xl md:text-3xl font-light uppercase tracking-tight group-hover:text-primary transition-colors duration-300">{truck.name}</h4>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-primary border-b border-primary uppercase">Nuevo 2026</span>
                </div>
                <p className="text-theme font-medium text-xs tracking-widest uppercase mb-8 italic">{truck.specs}</p>
                
                {/* SECCIÓN CORREGIDA: Ajuste de espaciado en mobile */}
                <div className="mt-auto pt-8 border-t border-theme flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
                  <div>
                    <span className="text-theme/40 text-[10px] uppercase block mb-1 font-bold">Inversión</span>
                    <span className="font-black text-3xl tracking-tight text-primary">{truck.price}</span>
                  </div>
                  <button className="w-full md:w-auto flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] bg-primary text-white px-8 py-4 md:py-3 rounded-sm hover:brightness-110 transition-all shadow-lg">
                    Ver Detalles <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && selectedTruck && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center md:p-10">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsModalOpen(false)} 
              className="absolute inset-0 bg-black/95 backdrop-blur-xl" 
            />
            
            <motion.div 
              initial={{ opacity: 0, y: "100%" }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: "100%" }} 
              className="relative bg-theme w-full h-full md:h-auto md:max-w-6xl md:max-h-[95vh] overflow-y-auto border-t md:border border-theme text-theme p-6 md:p-12 shadow-2xl no-scrollbar"
            >
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="fixed md:absolute top-6 right-6 z-[110] bg-primary text-white p-3 rounded-full shadow-lg flex items-center justify-center"
              >
                <X className="w-6 h-6 md:w-8 md:h-8" /> 
              </button>
              
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 mt-12 md:mt-0">
                <div className="space-y-4 md:space-y-6">
                  <div className="aspect-video overflow-hidden border border-theme bg-black/5 rounded-sm shadow-inner">
                    <motion.img 
                      key={activeImage} 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      src={activeImage} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                    {[selectedTruck.img, selectedTruck.imgSide].map((pic, idx) => pic && (
                      <button 
                        key={idx} 
                        onClick={() => setActiveImage(pic)} 
                        className={`relative flex-shrink-0 w-24 md:w-28 aspect-video border-2 transition-all rounded-md ${activeImage === pic ? 'border-primary' : 'border-theme/20 opacity-40'}`}
                      >
                        <img src={pic} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-primary font-bold tracking-[0.5em] text-[10px] uppercase mb-4 block">SinoTruk Luxury GNL</span>
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter mb-2 text-theme leading-tight">
                    {selectedTruck.name}
                  </h2>
                  <p className="text-xl md:text-2xl font-light text-primary mb-6 italic">{selectedTruck.price} USD</p>
                  
                  <div className="space-y-3 border-y border-theme/20 py-6 mb-8">
                    {Object.entries(selectedTruck.details).map(([key, value]: any) => (
                      <div key={key} className="flex justify-between items-center border-b border-theme/5 pb-3 last:border-0">
                        <span className="text-theme/50 uppercase text-[9px] md:text-xs font-black tracking-widest">{key}</span>
                        <span className="text-sm md:text-lg font-medium text-theme">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="relative group mt-auto pb-10 md:pb-0">
                    <div className="absolute -inset-1 bg-primary rounded-lg blur opacity-25 animate-pulse"></div>
                    <button className="relative w-full bg-primary text-white py-5 md:py-6 text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-foreground hover:text-background transition-all">
                      <Download size={20} strokeWidth={3} />
                      FICHA TÉCNICA
                      <ChevronRight size={20} className="hidden md:block" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};