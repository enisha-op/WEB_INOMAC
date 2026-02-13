'use client'
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, Download, ChevronRight, Truck as TruckIcon, Loader2 } from "lucide-react";

export const CatalogElite = () => {
  const [trucks, setTrucks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false); // Estado para el feedback de descarga
  const [selectedTruck, setSelectedTruck] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState<string>("");
  const [viewIndex, setViewIndex] = useState<number>(0);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        const response = await fetch(`${API_URL}/admin/trucks`);
        const data = await response.json();
        setTrucks(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (API_URL) fetchTrucks();
  }, [API_URL]);

  // FUNCIÓN MAESTRA DE DESCARGA (Fuerza .pdf)
  const handleDownloadPDF = async (pdfUrl: string, truckName: string) => {
    setDownloading(true);
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Creamos un nombre de archivo limpio
      const fileName = `Ficha_Tecnica_INOMAC_${truckName.replace(/\s+/g, '_')}.pdf`;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar:", error);
      window.open(pdfUrl, '_blank'); // Backup por si falla el fetch
    } finally {
      setDownloading(false);
    }
  };

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

  if (loading) return (
    <div className="py-24 flex flex-col items-center justify-center text-red-600 bg-white">
      <TruckIcon className="animate-pulse mb-4" size={48} />
      <span className="font-bold uppercase tracking-[0.3em] text-[10px]">Sincronizando Inventario...</span>
    </div>
  );

  return (
    <section id="catalogo" className="py-24 bg-white text-black overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="mb-24 text-center md:text-left">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <span className="text-red-600 font-bold tracking-[0.5em] uppercase text-[12px] mb-4 block">Catálogo Oficial</span>
            <h2 className="text-5xl md:text-7xl font-light uppercase tracking-tighter">
              EQUIPOS <span className="font-black italic text-red-600">PESADOS</span>
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          {trucks.map((truck, i) => (
            <motion.div key={i} className="group relative flex flex-col cursor-pointer" onClick={() => openDetails(truck)}>
              <div className="relative aspect-video mb-8 overflow-hidden bg-gray-50 rounded-sm border border-gray-100">
                <motion.img 
                  animate={{ opacity: (viewIndex === 0 || !truck.imgSide) ? 1 : 0 }} 
                  transition={{ duration: 1 }} 
                  src={truck.img} 
                  className="w-full h-full object-cover" 
                />
                {truck.imgSide && (
                  <motion.img 
                    animate={{ opacity: viewIndex === 1 ? 1 : 0 }} 
                    transition={{ duration: 1 }} 
                    src={truck.imgSide} 
                    className="absolute inset-0 w-full h-full object-cover" 
                  />
                )}
                <div className="absolute bottom-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="bg-red-600 text-white p-5 shadow-2xl">
                    <ArrowUpRight size={24} strokeWidth={3} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col grow px-2">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-3xl font-bold uppercase tracking-tight group-hover:text-red-600 transition-colors duration-300">{truck.name}</h4>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-red-600 border-b border-red-600 uppercase italic">Inomac Elite</span>
                </div>
                <button className="mt-8 w-full md:w-auto flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] bg-red-600 text-white px-8 py-4 rounded-sm hover:bg-black transition-all">
                  Explorar Unidad <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* MODAL DE DETALLES */}
      <AnimatePresence>
        {isModalOpen && selectedTruck && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center md:p-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-white/90 backdrop-blur-md" />
            <motion.div 
              initial={{ opacity: 0, y: "100%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "100%" }} 
              className="relative bg-white w-full h-full md:h-auto md:max-w-6xl md:max-h-[95vh] overflow-y-auto border border-gray-100 text-black p-6 md:p-12 shadow-2xl"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 bg-red-600 text-white p-3 rounded-full hover:bg-black transition-colors z-[120]">
                <X className="w-6 h-6" /> 
              </button>
              
              <div className="grid md:grid-cols-2 gap-12 mt-12 md:mt-0">
                <div className="space-y-6">
                  <div className="aspect-video overflow-hidden border border-gray-100 bg-gray-50 rounded-sm">
                    <motion.img key={activeImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={activeImage} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex gap-4">
                     <button onClick={() => setActiveImage(selectedTruck.img)} className={`w-24 aspect-video border-2 ${activeImage === selectedTruck.img ? 'border-red-600' : 'border-gray-100'} overflow-hidden rounded-sm`}>
                        <img src={selectedTruck.img} className="w-full h-full object-cover" />
                     </button>
                     {selectedTruck.imgSide && (
                        <button onClick={() => setActiveImage(selectedTruck.imgSide)} className={`w-24 aspect-video border-2 ${activeImage === selectedTruck.imgSide ? 'border-red-600' : 'border-gray-100'} overflow-hidden rounded-sm`}>
                           <img src={selectedTruck.imgSide} className="w-full h-full object-cover" />
                        </button>
                     )}
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-red-600 font-bold tracking-[0.5em] text-[10px] uppercase mb-4 block underline">Ficha Técnica Oficial</span>
                  <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter mb-8 leading-tight">{selectedTruck.name}</h2>
                  
                  {/* Especificaciones */}
                  <div className="space-y-4 border-y border-gray-100 py-8 mb-8">
                    {selectedTruck.motor && (
                      <div className="flex justify-between border-b border-gray-50 pb-3">
                        <span className="text-gray-400 uppercase text-[10px] font-black tracking-widest">Motor</span>
                        <span className="text-sm font-bold">{selectedTruck.motor}</span>
                      </div>
                    )}
                    {selectedTruck.transmission && (
                      <div className="flex justify-between border-b border-gray-50 pb-3">
                        <span className="text-gray-400 uppercase text-[10px] font-black tracking-widest">Transmisión</span>
                        <span className="text-sm font-bold">{selectedTruck.transmission}</span>
                      </div>
                    )}
                    {selectedTruck.traction && (
                      <div className="flex justify-between">
                        <span className="text-gray-400 uppercase text-[10px] font-black tracking-widest">Tracción</span>
                        <span className="text-sm font-bold">{selectedTruck.traction}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto">
                    {selectedTruck.pdf ? (
                      <button 
                        onClick={() => handleDownloadPDF(selectedTruck.pdf, selectedTruck.name)}
                        disabled={downloading}
                        className="w-full bg-red-600 text-white py-6 text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-black transition-all shadow-xl"
                      >
                        {downloading ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} strokeWidth={3} />}
                        {downloading ? "GENERANDO PDF..." : "DESCARGAR FICHA TÉCNICA (PDF)"}
                      </button>
                    ) : (
                      <div className="p-6 bg-gray-50 text-gray-400 text-center text-[10px] font-bold uppercase tracking-widest border border-dashed border-gray-200">
                        Documentación en proceso de carga
                      </div>
                    )}
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