'use client'
import { useState, useEffect } from "react";
import { 
  UserPlus, Loader2, AlertCircle, CheckCircle2, 
  Search, Trash2, Mail, Phone as PhoneIcon, Truck, User, 
  Tag, ChevronLeft, ChevronRight, FileText, X, Calculator, Save
} from "lucide-react";
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { motion, AnimatePresence } from "framer-motion";

export default function CustomersPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const [customers, setCustomers] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [trucks, setTrucks] = useState([]);
  const [selectedTruck, setSelectedTruck] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [customPrice, setCustomPrice] = useState(0);
  const [isCreatingQuote, setIsCreatingQuote] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const subtotal = quantity * customPrice;
  const totalConIgv = subtotal * 1.18;

  const fetchCustomers = async () => {
    setLoadingList(true);
    try {
      const response = await fetch(`${API_URL}/admin/quotes?search=${searchTerm}&page=${page}&per_page=15`);
      const data = await response.json();
      setCustomers(data.quotes || []);
      setTotalPages(data.total_pages || 1);
    } catch (error) { console.error(error); }
    finally { setLoadingList(false); }
  };

  useEffect(() => {
    if (API_URL) {
        fetchCustomers();
        fetch(`${API_URL}/admin/trucks`).then(res => res.json()).then(data => setTrucks(data));
    }
  }, [searchTerm, page, API_URL]);

  // --- LÓGICA CORE: ACTUALIZAR EN LUGAR DE CREAR NUEVO ---
  const handleCreateQuote = async () => {
    if (!selectedTruck) return alert("Selecciona un modelo");
    setIsCreatingQuote(true);
    try {
      // 1. Actualizamos el monto y items del registro existente
      const resAmounts = await fetch(`${API_URL}/admin/quotes/${selectedCustomer.id}/amounts`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total_amount: totalConIgv,
          items: [{
            name: selectedTruck.name,
            quantity: quantity,
            unit_price: customPrice
          }]
        })
      });

      // 2. Actualizamos el modelo y mensaje para que deje de ser "REGISTRO MANUAL"
      const resUpdate = await fetch(`${API_URL}/admin/quotes/${selectedCustomer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedCustomer.name,
          model: selectedTruck.name,
          message: `Cotización formal generada desde el directorio.`
        })
      });

      if (resAmounts.ok && resUpdate.ok) {
        alert("¡Registro convertido a cotización con éxito!");
        setSelectedCustomer(null);
        fetchCustomers(); // Refrescar tabla
      }
    } catch (e) { 
        console.error(e); 
        alert("Error al procesar la cotización");
    } finally { 
        setIsCreatingQuote(false); 
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este registro?")) return;
    try {
      const resp = await fetch(`${API_URL}/admin/quotes/${id}`, { method: 'DELETE' });
      if (resp.ok) fetchCustomers();
    } catch (error) { alert("Error al eliminar"); }
  };

  const handleSubmitClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
      setErrorMessage("Número no válido");
      setStatus('error');
      return;
    }
    setStatus('loading');
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: phoneNumber,
      ruc: formData.get('ruc'),
      model: "REGISTRO MANUAL (ADMIN)", // Etiqueta inicial
      message: formData.get('message') || "Registrado desde el panel administrativo.",
    };

    try {
      const response = await fetch(`${API_URL}/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setStatus('success');
        setPhoneNumber(undefined);
        (e.target as HTMLFormElement).reset();
        fetchCustomers();
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (error) { setStatus('error'); }
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-12 max-w-[1600px] mx-auto overflow-x-hidden text-white bg-black min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic">Directorio de <span className="text-primary">Clientes</span></h1>
          <p className="text-muted-theme text-[9px] font-bold uppercase tracking-[0.2em] mt-2">Evita duplicados convirtiendo registros manuales en cotizaciones reales</p>
        </header>

        <form onSubmit={handleSubmitClient} className="bg-[#0a0a0a] border border-white/10 p-5 md:p-10 shadow-2xl space-y-6 rounded-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <input name="name" type="text" required className="w-full bg-black border border-white/10 p-4 outline-none focus:border-primary transition-all text-[11px] font-bold uppercase text-white" placeholder="RAZÓN SOCIAL / NOMBRE" />
            <input name="ruc" type="text" className="w-full bg-black border border-white/10 p-4 outline-none focus:border-primary transition-all text-[11px] font-bold uppercase text-white" placeholder="RUC / DNI" />
            <input name="email" type="email" required className="w-full bg-black border border-white/10 p-4 outline-none focus:border-primary transition-all text-[11px] font-bold uppercase text-white" placeholder="EMAIL" />
            <div className="border border-white/10 focus-within:border-primary transition-all bg-black px-2 flex items-center">
              <PhoneInput international defaultCountry="PE" value={phoneNumber} onChange={setPhoneNumber} className="custom-phone-input py-2 w-full" />
            </div>
          </div>
          <button disabled={status === 'loading'} type="submit" className="w-full bg-primary text-white py-5 flex items-center justify-center gap-4 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-red-700 transition-all shadow-xl">
            {status === 'loading' ? <Loader2 className="animate-spin w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            {status === 'loading' ? "SINCRONIZANDO..." : "REGISTRAR EN DIRECTORIO"}
          </button>
        </form>
      </div>

      <div className="bg-[#0a0a0a] border border-white/10 shadow-2xl rounded-sm overflow-hidden">
        <div className="p-5 border-b border-white/10 bg-primary/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-theme italic">Clientes en Base de Datos</h2>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-theme" size={14} />
            <input type="text" placeholder="BUSCAR..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setPage(1);}} className="w-full bg-black border border-white/10 py-3 pl-12 pr-4 text-[10px] font-bold uppercase outline-none focus:border-primary text-white" />
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[9px] uppercase tracking-[0.2em] text-muted-theme border-b border-white/10 bg-primary/5">
                <th className="p-6">Titular</th>
                <th className="p-6">Documento</th>
                <th className="p-6">Contacto</th>
                <th className="p-6">Acción</th>
              </tr>
            </thead>
            <tbody className="text-[11px] font-bold uppercase divide-y divide-white/5">
              {!loadingList && customers.map((c: any) => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-all group">
                  <td className="p-6">
                    <p className="text-primary font-black italic text-sm">{c.name}</p>
                    <p className="text-[9px] text-muted-theme lowercase">{c.email}</p>
                  </td>
                  <td className="p-6 text-muted-theme font-mono">{c.ruc || "N/A"}</td>
                  <td className="p-6 italic flex items-center gap-2"><PhoneIcon className="w-3 h-3 text-green-600" /> {c.phone}</td>
                  <td className="p-6">
                    <div className="flex gap-2">
                        <button 
                            onClick={() => { setSelectedCustomer(c); setCustomPrice(0); }}
                            className="flex items-center gap-2 bg-white text-black px-4 py-2 text-[9px] font-black hover:bg-primary hover:text-white transition-all shadow-lg"
                        >
                            <FileText size={12}/> COTIZAR
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="p-2 text-muted-theme hover:text-red-600 transition-all"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MÓVIL */}
        <div className="md:hidden divide-y divide-white/5">
          {!loadingList && customers.map((c: any) => (
            <div key={c.id} className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                    <div><h3 className="text-primary font-black uppercase text-sm italic">{c.name}</h3><p className="text-[9px] text-muted-theme">{c.email}</p></div>
                    <button onClick={() => handleDelete(c.id)} className="p-2 text-red-500/50"><Trash2 size={14}/></button>
                </div>
                <button onClick={() => { setSelectedCustomer(c); setCustomPrice(0); }} className="w-full bg-white text-black py-3 font-black text-[10px] uppercase flex items-center justify-center gap-2"><FileText size={14}/> GENERAR COTIZACIÓN</button>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-white/10 bg-primary/5 flex justify-between items-center">
          <p className="text-[9px] font-black text-muted-theme">Página {page} de {totalPages}</p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-2 bg-black border border-white/10 disabled:opacity-20"><ChevronLeft size={16}/></button>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="p-2 bg-black border border-white/10 disabled:opacity-20"><ChevronRight size={16}/></button>
          </div>
        </div>
      </div>

      {/* MODAL DE CONVERSIÓN A COTIZACIÓN */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0a0a0a] border border-white/10 w-full max-w-xl rounded-sm shadow-2xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div>
                    <h2 className="text-xl font-black uppercase italic tracking-tighter">Emitir <span className="text-primary">Cotización</span></h2>
                    <p className="text-[8px] font-bold text-muted-theme uppercase">Actualizando lead: {selectedCustomer.name}</p>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="text-muted-theme hover:text-white"><X size={24}/></button>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-2"><Truck size={12}/> Unidad Solicitada</label>
                  <select className="w-full bg-black border border-white/10 p-4 text-[11px] font-bold uppercase outline-none focus:border-primary text-white" onChange={(e) => { const t = trucks.find((tr: any) => tr.id === parseInt(e.target.value)); setSelectedTruck(t); if (t) setCustomPrice((t as any).price); }}>
                    <option value="" className="bg-black">-- SELECCIONAR MODELO --</option>
                    {trucks.map((t: any) => (<option key={t.id} value={t.id} className="bg-black">{t.name}</option>))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest text-primary"><Calculator size={12} className="inline mr-1"/> Cantidad</label>
                        <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))} className="w-full bg-black border border-white/10 p-4 text-[11px] font-bold outline-none focus:border-primary text-white" />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest text-primary">Precio Pactado ($)</label>
                        <input type="number" value={customPrice} onChange={(e) => setCustomPrice(parseFloat(e.target.value))} className="w-full bg-black border border-white/10 p-4 text-[11px] font-bold outline-none focus:border-primary text-white" />
                    </div>
                </div>

                <div className="bg-primary/5 p-6 border border-primary/20 space-y-2">
                    <div className="flex justify-between text-[9px] font-bold uppercase text-muted-theme"><span>Subtotal:</span><span>${subtotal.toLocaleString()}</span></div>
                    <div className="flex justify-between text-[11px] font-black uppercase text-white pt-2 border-t border-white/10"><span>Total con IGV (18%):</span><span className="text-primary text-lg">${totalConIgv.toLocaleString()}</span></div>
                </div>

                <button onClick={handleCreateQuote} disabled={isCreatingQuote} className="w-full bg-primary text-white py-5 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-red-700 transition-all flex items-center justify-center gap-4 shadow-xl shadow-red-900/20">
                  {isCreatingQuote ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={18}/>}
                  {isCreatingQuote ? "ACTUALIZANDO..." : "CONFIRMAR Y COTIZAR"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-phone-input .PhoneInputInput {
          background: transparent; border: none; outline: none;
          font-weight: 700; font-size: 0.8rem; color: white;
          text-transform: uppercase; width: 100%; padding-left: 8px;
        }
      `}</style>
    </div>
  );
}