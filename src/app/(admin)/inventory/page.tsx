'use client'
import { useState, useEffect } from "react";
import { Plus, Truck, Download, Trash2, Edit3, Box, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AddTruckForm from "@/app/(admin)/AddTruckForm";

export default function InventoryPage() {
  const [showModal, setShowModal] = useState(false);
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTruck, setEditingTruck] = useState<any>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchTrucks = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/trucks`);
      const data = await response.json();
      setTrucks(data);
    } catch (error) {
      console.error("Error al cargar inventario:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (API_URL) fetchTrucks();
  }, [API_URL]);

  const handleDelete = async (id: number, name: string) => {
    const confirmed = window.confirm(`¿Estás seguro de eliminar el modelo "${name}"?`);
    if (confirmed) {
      try {
        const resp = await fetch(`${API_URL}/admin/trucks/${id}`, {
          method: 'DELETE',
        });
        if (resp.ok) {
          setTrucks(trucks.filter((t: any) => t.id !== id));
          alert("Unidad eliminada correctamente.");
        }
      } catch (error) {
        alert("No se pudo eliminar la unidad.");
      }
    }
  };

  const handleEdit = (truck: any) => {
    setEditingTruck(truck);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTruck(null);
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto">
      {/* HEADER RESPONSIVE */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter">
            Gestión de <span className="text-primary">Inventario</span>
          </h1>
          <p className="text-muted-theme text-[10px] md:text-xs font-bold uppercase tracking-widest mt-2">
            Control de flota y fichas técnicas en tiempo real
          </p>
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-primary text-white px-6 md:px-8 py-4 flex items-center justify-center gap-4 font-black uppercase text-[10px] tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-900/20"
        >
          <Plus className="w-5 h-5" /> Añadir Camión
        </button>
      </div>

      {loading ? (
        <div className="bg-[var(--card-bg)] border border-theme p-10 md:p-20 text-center rounded-sm">
           <Truck className="mx-auto text-muted-theme opacity-10 mb-6 animate-pulse w-16 h-16 md:w-20 md:h-20" />
           <p className="text-muted-theme font-bold uppercase text-[10px] tracking-[0.3em]">Sincronizando Inventario...</p>
        </div>
      ) : (
        <div className="bg-[var(--card-bg)] border border-theme rounded-sm overflow-hidden shadow-2xl">
          
          {/* VISTA PARA TABLETS Y DESKTOP (TABLA) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-primary/5 border-b border-theme">
                <tr className="text-[10px] uppercase tracking-[0.2em] text-muted-theme">
                  <th className="p-6">Vista</th>
                  <th className="p-6">Modelo</th>
                  <th className="p-6">Especificaciones</th>
                  <th className="p-6">Precio</th>
                  <th className="p-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {trucks.map((truck: any) => (
                  <tr key={truck.id} className="border-b border-theme hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6">
                      <div className="w-16 h-10 bg-black/40 border border-theme overflow-hidden flex items-center justify-center rounded-sm">
                        {truck.img ? (
                          <img src={truck.img} alt={truck.name} className="w-full h-full object-contain" />
                        ) : <Box className="w-4 h-4 opacity-20"/>}
                      </div>
                    </td>
                    <td className="p-6 font-bold uppercase tracking-tight">{truck.name}</td>
                    <td className="p-6 text-[10px] text-muted-theme font-bold uppercase">{truck.specs}</td>
                    <td className="p-6 font-mono text-primary font-bold italic">${truck.price.toLocaleString()}</td>
                    <td className="p-6 text-right space-x-2">
                      {truck.pdf && (
                        <a href={truck.pdf} target="_blank" rel="noopener noreferrer" className="p-2 text-muted-theme hover:text-primary transition-all inline-block hover:scale-110">
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                      <button onClick={() => handleEdit(truck)} className="p-2 text-muted-theme hover:text-white transition-all hover:scale-110">
                        <Edit3 className="w-4 h-4"/>
                      </button>
                      <button onClick={() => handleDelete(truck.id, truck.name)} className="p-2 text-muted-theme hover:text-red-500 transition-all hover:scale-110">
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* VISTA PARA MÓVILES (CARDS) */}
          <div className="md:hidden divide-y divide-theme">
            {trucks.map((truck: any) => (
              <div key={truck.id} className="p-6 space-y-4 bg-white/[0.01]">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-14 bg-black/40 border border-theme p-2 flex items-center justify-center rounded-sm">
                    {truck.img ? (
                      <img src={truck.img} alt={truck.name} className="w-full h-full object-contain" />
                    ) : <Box className="w-5 h-5 opacity-20"/>}
                  </div>
                  <div>
                    <h3 className="font-black uppercase text-sm tracking-tight">{truck.name}</h3>
                    <p className="text-primary font-mono font-bold italic">${truck.price.toLocaleString()}</p>
                  </div>
                </div>
                
                <p className="text-[10px] text-muted-theme font-bold uppercase leading-relaxed bg-black/20 p-3 border-l-2 border-primary">
                  {truck.specs}
                </p>

                <div className="flex justify-end gap-3 pt-2">
                  {truck.pdf && (
                    <a href={truck.pdf} target="_blank" rel="noopener noreferrer" className="flex-1 bg-white/5 p-4 flex justify-center text-muted-theme rounded-sm border border-theme active:bg-primary/20">
                      <Download className="w-5 h-5" />
                    </a>
                  )}
                  <button onClick={() => handleEdit(truck)} className="flex-1 bg-white/5 p-4 flex justify-center text-muted-theme rounded-sm border border-theme active:bg-white/10">
                    <Edit3 className="w-5 h-5"/>
                  </button>
                  <button onClick={() => handleDelete(truck.id, truck.name)} className="flex-1 bg-red-600/10 p-4 flex justify-center text-red-500 rounded-sm border border-red-900/20 active:bg-red-600/30">
                    <Trash2 className="w-5 h-5"/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL RESPONSIVE */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleCloseModal} className="absolute inset-0 bg-black/95 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} 
              className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto custom-scrollbar bg-[var(--card-bg)] border border-theme rounded-sm shadow-2xl"
            >
              {/* Botón flotante para cerrar el modal */}
              <div className="sticky top-0 right-0 p-4 flex justify-end z-[310] pointer-events-none">
                <button onClick={handleCloseModal} className="p-2 bg-black/60 text-white rounded-full border border-white/10 backdrop-blur-md pointer-events-auto hover:bg-primary transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="px-4 pb-8 md:px-8 md:pb-12 -mt-10">
                <AddTruckForm 
                  initialData={editingTruck} 
                  onSuccess={() => { handleCloseModal(); fetchTrucks(); }} 
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}