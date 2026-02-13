'use client'
import { useState, useEffect, useRef } from "react";
import { X, User, Truck, Calculator, Save, Loader2, Mail, Phone, Hash, Search, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function CreateQuoteModal({ onClose, onSuccess, API_URL }: any) {
  const [customers, setCustomers] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  
  // ESTADOS DE BÚSQUEDA Y SELECCIÓN
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  
  // ESTADOS DE PRODUCTO
  const [selectedTruck, setSelectedTruck] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [customPrice, setCustomPrice] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);

  // Cálculos financieros
  const subtotal = quantity * customPrice;
  const igv = subtotal * 0.18;
  const totalConIgv = subtotal + igv;

  // LÓGICA DE BÚSQUEDA GLOBAL (Pide 100 resultados para ignorar la paginación de 15)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (API_URL) {
        setSearching(true);
        try {
          // IMPORTANTE: per_page=100 asegura que veas a todos tus clientes en la búsqueda
          const res = await fetch(`${API_URL}/admin/quotes?search=${searchTerm}&per_page=100`);
          const data = await res.json();
          setCustomers(data.quotes || []);
          // Solo mostramos resultados si hay algo escrito o si el usuario hace clic en el buscador
          if (searchTerm.length >= 0) setShowResults(true);
        } catch (e) {
          console.error("Error cargando clientes:", e);
        } finally {
          setSearching(false);
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, API_URL]);

  // Carga de inventario y listener para cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/trucks`);
        const data = await res.json();
        setTrucks(data || []);
      } catch (e) { console.error(e); }
    };
    fetchTrucks();
      
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [API_URL]);

  const handleSubmit = async () => {
    if (!selectedCustomer || !selectedTruck) return alert("Seleccione cliente y unidad");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/quotes/manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: selectedCustomer.id,
          model: selectedTruck.name,
          quantity,
          unit_price: customPrice,
          total_amount: totalConIgv
        })
      });
      if (res.ok) { onSuccess(); onClose(); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-md">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0a0a0a] border border-white/10 w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">Generar <span className="text-primary">Nueva Cotización</span></h2>
          <button onClick={onClose} className="text-muted-theme hover:text-white transition-colors"><X size={24}/></button>
        </div>

        <div className="p-6 sm:p-8 space-y-8 overflow-y-auto custom-scrollbar">
          
          {/* BUSCADOR DE CLIENTES PERSONALIZADO (NO USA SELECT) */}
          <div className="space-y-3" ref={searchRef}>
            <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <User size={12}/> {selectedCustomer ? "Cliente Confirmado" : "Buscar Cliente en Directorio"}
            </label>
            
            {!selectedCustomer ? (
              <div className="relative">
                <div className="relative group">
                  <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${searching ? 'text-primary' : 'text-muted-theme'}`} size={16} />
                  <input 
                    type="text"
                    autoFocus
                    placeholder="ESCRIBE NOMBRE O RUC PARA FILTRAR..."
                    className="w-full bg-white/5 border border-white/10 p-5 pl-12 text-xs font-bold uppercase outline-none focus:border-primary focus:bg-white/[0.08] transition-all text-white shadow-inner"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setShowResults(true)}
                  />
                  {searching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-primary" size={16} />}
                </div>

                {/* RESULTADOS FLOTANTES */}
                <AnimatePresence>
                  {showResults && customers.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="absolute top-full left-0 w-full bg-[#111] border border-white/10 mt-1 z-50 shadow-2xl max-h-60 overflow-y-auto custom-scrollbar rounded-sm"
                    >
                      {customers.map((c: any) => (
                        <div 
                          key={c.id} 
                          onClick={() => { setSelectedCustomer(c); setShowResults(false); }}
                          className="p-4 border-b border-white/5 hover:bg-primary/10 cursor-pointer transition-colors group"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-[11px] font-black uppercase tracking-tight group-hover:text-primary transition-colors text-white">{c.name}</span>
                            <span className="text-[8px] bg-white/10 px-2 py-0.5 rounded-full text-muted-theme">
                              {c.model === "REGISTRO MANUAL (ADMIN)" ? "MANUAL" : "WEB"}
                            </span>
                          </div>
                          <div className="flex gap-4 mt-1 opacity-50 text-white italic">
                            <span className="text-[9px] font-mono">{c.ruc || 'S/D'}</span>
                            <span className="text-[9px] lowercase">{c.email}</span>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* TARJETA DE CLIENTE SELECCIONADO */
              <motion.div initial={{ scale: 0.98 }} animate={{ scale: 1 }} className="bg-primary/10 border border-primary/30 p-5 rounded-sm flex justify-between items-center group">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-primary" />
                    <p className="text-sm font-black uppercase italic tracking-tight text-white">{selectedCustomer.name}</p>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 opacity-80 text-white">
                    <div className="flex items-center gap-2 text-[10px] font-bold"><Hash size={10} className="text-primary"/> {selectedCustomer.ruc || 'N/A'}</div>
                    <div className="flex items-center gap-2 text-[10px] font-bold"><Mail size={10} className="text-primary"/> {selectedCustomer.email}</div>
                    <div className="flex items-center gap-2 text-[10px] font-bold"><Phone size={10} className="text-primary"/> {selectedCustomer.phone}</div>
                  </div>
                </div>
                <button 
                  onClick={() => { setSelectedCustomer(null); setSearchTerm(""); }}
                  className="p-2 text-muted-theme hover:text-white hover:bg-white/10 rounded-full transition-all"
                >
                  <X size={18} />
                </button>
              </motion.div>
            )}
          </div>

          {/* PRODUCTO Y CANTIDAD */}
          <div className="grid md:grid-cols-2 gap-6 border-t border-white/5 pt-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2"><Truck size={12}/> Unidad</label>
              <select 
                className="w-full bg-white/5 border border-white/10 p-4 text-[11px] font-bold uppercase outline-none focus:border-primary text-white"
                onChange={(e) => {
                  const t = trucks.find((tr: any) => tr.id === parseInt(e.target.value));
                  setSelectedTruck(t);
                  if (t) setCustomPrice((t as any).price);
                }}
              >
                <option value="" className="bg-[#0a0a0a]">-- SELECCIONAR MODELO --</option>
                {trucks.map((t: any) => (<option key={t.id} value={t.id} className="bg-[#0a0a0a] text-white">{t.name}</option>))}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2"><Calculator size={12}/> Cantidad</label>
              <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))} className="w-full bg-white/5 border border-white/10 p-4 text-[11px] font-bold outline-none focus:border-primary text-white shadow-inner" />
            </div>
          </div>

          {/* DESGLOSE DE MONTOS EN VIVO */}
          <div className="bg-white/[0.02] border border-white/5 rounded-sm overflow-hidden shadow-2xl">
            <div className="p-6 space-y-3 border-b border-white/5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-theme italic">Precio Unitario Aplicado ($)</label>
              <div className="flex items-center gap-4">
                 <span className="text-3xl font-black text-primary">$</span>
                 <input 
                  type="number" 
                  value={customPrice} 
                  onChange={(e) => setCustomPrice(parseFloat(e.target.value))} 
                  className="w-full bg-transparent p-0 text-4xl font-black text-white outline-none" 
                />
              </div>
            </div>
            
            <div className="p-6 bg-primary/5 space-y-3">
              <div className="flex justify-between text-[10px] font-bold uppercase text-muted-theme">
                <span>Subtotal Operativo:</span>
                <span className="text-white font-mono">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase text-muted-theme">
                <span>IGV Aplicado (18%):</span>
                <span className="text-white font-mono">${igv.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-white/10 mt-2">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white italic">Inversión Total Final:</span>
                <span className="text-3xl font-black text-primary italic underline underline-offset-8 font-mono">${totalConIgv.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleSubmit} 
            disabled={loading || !selectedCustomer || !selectedTruck} 
            className={`w-full py-6 font-black uppercase tracking-[0.4em] text-xs transition-all flex items-center justify-center gap-4 shadow-xl ${
              (!selectedCustomer || !selectedTruck) 
              ? 'bg-white/5 text-muted-theme cursor-not-allowed opacity-50' 
              : 'bg-primary text-white hover:bg-red-700 shadow-red-900/20'
            }`}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20}/>}
            {loading ? "SINCRO..." : "REGISTRAR COTIZACIÓN OFICIAL"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}