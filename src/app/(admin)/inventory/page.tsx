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

  // URL base desde el .env
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchTrucks = async () => {
    try {
      // Usamos la variable de entorno para producción
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
    fetchTrucks();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    const confirmed = window.confirm(`¿Estás seguro de eliminar el modelo "${name}"?`);
    if (confirmed) {
      try {
        const resp = await fetch(`${API_URL}/admin/trucks/${id}`, {
          method: 'DELETE',
        });
        if (resp.ok) {
          setTrucks(trucks.filter((t: any) => t.id !== id));
          alert("Unidad eliminada correctamente del sistema.");
        }
      } catch (error) {
        alert("No se pudo eliminar la unidad. Intenta de nuevo.");
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
    <div className="p-8 md:p-12">
      {/* HEADER */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">
            Gestión de <span className="text-primary">Inventario</span>
          </h1>
          <p className="text-muted-theme text-xs font-bold uppercase tracking-widest mt-2">
            Control de flota y fichas técnicas en tiempo real
          </p>
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-8 py-4 flex items-center gap-4 font-black uppercase text-[10px] tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-900/20"
        >
          <Plus size={18} /> Añadir Camión
        </button>
      </div>

      {loading ? (
        <div className="bg-[var(--card-bg)] border border-theme p-20 text-center">
           <Truck className="mx-auto text-muted-theme opacity-10 mb-6 animate-pulse" size={80} />
           <p className="text-muted-theme font-bold uppercase text-xs tracking-[0.3em]">Sincronizando con Railway...</p>
        </div>
      ) : (
        <div className="bg-[var(--card-bg)] border border-theme rounded-sm overflow-hidden shadow-2xl">
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
                    <div className="w-16 h-10 bg-black/40 border border-theme overflow-hidden flex items-center justify-center">
                      {/* NOTA: Ya no concatenamos localhost, Cloudinary da la URL completa */}
                      {truck.img ? (
                        <img src={truck.img} alt={truck.name} className="w-full h-full object-contain" />
                      ) : <Box size={16} className="opacity-20"/>}
                    </div>
                  </td>
                  <td className="p-6 font-bold uppercase">{truck.name}</td>
                  <td className="p-6 text-[10px] text-muted-theme font-bold uppercase">{truck.specs}</td>
                  <td className="p-6 font-mono text-primary font-bold">${truck.price.toLocaleString()}</td>
                  <td className="p-6 text-right space-x-2">
                    {/* NOTA: Link directo a la ficha en Cloudinary */}
                    {truck.pdf && (
                      <a href={truck.pdf} target="_blank" rel="noopener noreferrer" className="p-2 text-muted-theme hover:text-primary transition-colors inline-block">
                        <Download size={16} />
                      </a>
                    )}
                    <button onClick={() => handleEdit(truck)} className="p-2 text-muted-theme hover:text-white transition-colors">
                      <Edit3 size={16}/>
                    </button>
                    <button onClick={() => handleDelete(truck.id, truck.name)} className="p-2 text-muted-theme hover:text-red-500 transition-colors">
                      <Trash2 size={16}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL CON ANIMACIÓN */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleCloseModal} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="relative w-full max-w-4xl max-h-[95vh] overflow-y-auto custom-scrollbar">
              <AddTruckForm 
                initialData={editingTruck} 
                onSuccess={() => { handleCloseModal(); fetchTrucks(); }} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}