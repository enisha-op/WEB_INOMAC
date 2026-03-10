'use client'
import { useState, useEffect } from "react";
import { 
  UserPlus, Loader2, AlertCircle, CheckCircle2, 
  Search, Trash2, Mail, Phone as PhoneIcon, Truck, User, 
  Tag, ChevronLeft, ChevronRight, FileText, X, Calculator, Plus
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
  
  // ESTADOS PARA COTIZACIÓN MÚLTIPLE
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [trucks, setTrucks] = useState([]);
  const [quoteItems, setQuoteItems] = useState<any[]>([]); 
  const [isCreatingQuote, setIsCreatingQuote] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // CÁLCULOS DINÁMICOS
  const subtotal = quoteItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
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

  // FUNCIONES CORREGIDAS PARA MANEJAR ÍTEMS
  const addVehicleRow = () => {
    setQuoteItems([...quoteItems, { id: Date.now(), truckId: "", name: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeVehicleRow = (id: number) => {
    setQuoteItems(quoteItems.filter(item => item.id !== id));
  };

  const updateItem = (id: number, field: string, value: any) => {
    setQuoteItems(prevItems => prevItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleCreateQuote = async () => {
    if (quoteItems.length === 0) return alert("Agrega al menos un vehículo a la lista");
    if (quoteItems.some(item => !item.name)) return alert("Asegúrate de seleccionar un modelo en todas las filas");

    setIsCreatingQuote(true);
    try {
      const resAmounts = await fetch(`${API_URL}/admin/quotes/${selectedCustomer.id}/amounts`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total_amount: totalConIgv,
          items: quoteItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            unit_price: item.unitPrice
          }))
        })
      });

      const allModels = quoteItems.map(i => i.name).join(", ");
      const resUpdate = await fetch(`${API_URL}/admin/quotes/${selectedCustomer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedCustomer.name,
          model: allModels,
          message: `Cotización múltiple (${quoteItems.length} items) generada desde el directorio.`
        })
      });

      if (resAmounts.ok && resUpdate.ok) {
        alert("¡Cotización múltiple generada con éxito!");
        setSelectedCustomer(null);
        setQuoteItems([]);
        fetchCustomers();
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
      model: "REGISTRO MANUAL (ADMIN)",
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
    <div className="p-4 md:p-8 lg:p-12 space-y-12 max-w-[1600px] mx-auto overflow-x-hidden text-[var(--foreground)] bg-[var(--background)] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic">Directorio de <span className="text-primary">Clientes</span></h1>
          <p className="text-muted-theme text-[9px] font-bold uppercase tracking-[0.2em] mt-2">Gestión centralizada de registros y cotizaciones</p>
        </header>

        <form onSubmit={handleSubmitClient} className="bg-[var(--card-bg)] border border-theme p-5 md:p-10 shadow-2xl space-y-6 rounded-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <input name="name" type="text" required className="w-full bg-[var(--background)] border border-theme p-4 outline-none focus:border-primary transition-all text-[11px] font-bold uppercase text-[var(--foreground)]" placeholder="RAZÓN SOCIAL / NOMBRE" />
            <input name="ruc" type="text" className="w-full bg-[var(--background)] border border-theme p-4 outline-none focus:border-primary transition-all text-[11px] font-bold uppercase text-[var(--foreground)]" placeholder="RUC / DNI" />
            <input name="email" type="email" required className="w-full bg-[var(--background)] border border-theme p-4 outline-none focus:border-primary transition-all text-[11px] font-bold uppercase text-[var(--foreground)]" placeholder="EMAIL" />
            <div className="border border-theme focus-within:border-primary transition-all bg-[var(--background)] px-2 flex items-center">
              <PhoneInput international defaultCountry="PE" value={phoneNumber} onChange={setPhoneNumber} className="custom-phone-input py-2 w-full" />
            </div>
          </div>
          <button disabled={status === 'loading'} type="submit" className="w-full bg-primary text-white py-5 flex items-center justify-center gap-4 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-red-700 transition-all shadow-xl">
            {status === 'loading' ? <Loader2 className="animate-spin w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            {status === 'loading' ? "SINCRONIZANDO..." : "REGISTRAR EN DIRECTORIO"}
          </button>
        </form>
      </div>

      <div className="bg-[var(--card-bg)] border border-theme shadow-2xl rounded-sm overflow-hidden">
        <div className="p-5 border-b border-theme bg-primary/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-theme italic">Clientes en Base de Datos</h2>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-theme" size={14} />
            <input type="text" placeholder="BUSCAR..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setPage(1);}} className="w-full bg-[var(--background)] border border-theme py-3 pl-12 pr-4 text-[10px] font-bold uppercase outline-none focus:border-primary text-[var(--foreground)]" />
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[9px] uppercase tracking-[0.2em] text-muted-theme border-b border-theme bg-primary/5">
                <th className="p-6">Titular</th>
                <th className="p-6">Documento</th>
                <th className="p-6">Contacto</th>
                <th className="p-6">Acción</th>
              </tr>
            </thead>
            <tbody className="text-[11px] font-bold uppercase divide-y divide-white/5">
              {!loadingList && customers.map((c: any) => (
                <tr key={c.id} className="hover:bg-primary/5 transition-all group">
                  <td className="p-6">
                    <p className="text-primary font-black italic text-sm">{c.name}</p>
                    <p className="text-[9px] text-muted-theme lowercase">{c.email}</p>
                  </td>
                  <td className="p-6 text-muted-theme font-mono">{c.ruc || "N/A"}</td>
                  <td className="p-6 italic flex items-center gap-2"><PhoneIcon className="w-3 h-3 text-green-600" /> {c.phone}</td>
                  <td className="p-6">
                    <div className="flex gap-2">
                        <button 
                            onClick={() => { 
                              setSelectedCustomer(c); 
                              setQuoteItems([{ id: Date.now(), truckId: "", name: "", quantity: 1, unitPrice: 0 }]);
                            }}
                            className="flex items-center gap-2 bg-[var(--foreground)] text-[var(--background)] px-4 py-2 text-[9px] font-black hover:bg-primary hover:text-white transition-all shadow-lg"
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

        <div className="md:hidden divide-y divide-white/5">
          {!loadingList && customers.map((c: any) => (
            <div key={c.id} className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                    <div><h3 className="text-primary font-black uppercase text-sm italic">{c.name}</h3><p className="text-[9px] text-muted-theme">{c.email}</p></div>
                    <button onClick={() => handleDelete(c.id)} className="p-2 text-red-500/50"><Trash2 size={14}/></button>
                </div>
                <button onClick={() => { 
                    setSelectedCustomer(c); 
                    setQuoteItems([{ id: Date.now(), truckId: "", name: "", quantity: 1, unitPrice: 0 }]);
                  }} className="w-full bg-[var(--foreground)] text-[var(--background)] py-3 font-black text-[10px] uppercase flex items-center justify-center gap-2"><FileText size={14}/> GENERAR COTIZACIÓN</button>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-theme bg-primary/5 flex justify-between items-center">
          <p className="text-[9px] font-black text-muted-theme">Página {page} de {totalPages}</p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-2 bg-[var(--background)] border border-theme disabled:opacity-20"><ChevronLeft size={16}/></button>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="p-2 bg-[var(--background)] border border-theme disabled:opacity-20"><ChevronRight size={16}/></button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[var(--card-bg)] border border-theme w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-theme flex justify-between items-center bg-white/[0.02]">
                <div>
                    <h2 className="text-xl font-black uppercase italic tracking-tighter">Emitir <span className="text-primary">Cotización Múltiple</span></h2>
                    <p className="text-[8px] font-bold text-muted-theme uppercase">Cliente: {selectedCustomer.name}</p>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="text-muted-theme hover:text-white"><X size={24}/></button>
              </div>

              <div className="p-8 space-y-6 overflow-y-auto">
                <div className="space-y-4">
                  {quoteItems.map((item, index) => (
                    <div key={item.id} className="p-4 border border-theme bg-white/[0.02] rounded-sm space-y-4 relative group">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-primary italic"># ÍTEM {index + 1}</span>
                        {quoteItems.length > 1 && (
                          <button onClick={() => removeVehicleRow(item.id)} className="text-red-500 hover:text-red-700 transition-colors">
                            <Trash2 size={14}/>
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-6 space-y-2">
                          <label className="text-[8px] font-black uppercase tracking-widest text-muted-theme flex items-center gap-2"><Truck size={10}/> Modelo</label>
                          <select 
                            className="w-full bg-[var(--background)] border border-theme p-3 text-[10px] font-bold uppercase outline-none focus:border-primary text-[var(--foreground)]"
                            value={item.truckId || ""}
                            onChange={(e) => {
                              const selectedId = e.target.value;
                              const t = trucks.find((tr: any) => tr.id.toString() === selectedId);
                              if (t) {
                                updateItem(item.id, 'truckId', (t as any).id);
                                updateItem(item.id, 'name', (t as any).name);
                                updateItem(item.id, 'unitPrice', (t as any).price);
                              }
                            }}
                          >
                            <option value="" disabled>-- SELECCIONAR --</option>
                            {trucks.map((t: any) => (<option key={t.id} value={t.id}>{t.name}</option>))}
                          </select>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-[8px] font-black uppercase tracking-widest text-muted-theme">Cant.</label>
                          <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)} className="w-full bg-[var(--background)] border border-theme p-3 text-[10px] font-bold outline-none focus:border-primary text-[var(--foreground)]" />
                        </div>
                        <div className="md:col-span-4 space-y-2">
                          <label className="text-[8px] font-black uppercase tracking-widest text-muted-theme">Precio Unit ($)</label>
                          <input type="number" value={item.unitPrice} onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)} className="w-full bg-[var(--background)] border border-theme p-3 text-[10px] font-bold outline-none focus:border-primary text-[var(--foreground)]" />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button 
                    onClick={addVehicleRow}
                    className="w-full border-2 border-dashed border-theme py-4 text-[9px] font-black text-muted-theme hover:text-primary hover:border-primary transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                  >
                    <Plus size={14}/> Agregar otro vehículo a la cotización
                  </button>
                </div>

                <div className="bg-primary/5 p-6 border border-primary/20 space-y-2 rounded-sm">
                    <div className="flex justify-between text-[9px] font-bold uppercase text-muted-theme"><span>Subtotal Neto:</span><span>${subtotal.toLocaleString()}</span></div>
                    <div className="flex justify-between text-[11px] font-black uppercase text-[var(--foreground)] pt-2 border-t border-theme">
                      <span>Total con IGV (18%):</span>
                      <span className="text-primary text-xl">${totalConIgv.toLocaleString()}</span>
                    </div>
                </div>

                <button onClick={handleCreateQuote} disabled={isCreatingQuote} className="w-full bg-primary text-white py-5 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-red-700 transition-all flex items-center justify-center gap-4 shadow-xl shadow-red-900/20">
                  {isCreatingQuote ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={18}/>}
                  {isCreatingQuote ? "PROCESANDO COTIZACIÓN..." : "CONFIRMAR Y GENERAR"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-phone-input .PhoneInputInput {
          background: transparent; border: none; outline: none;
          font-weight: 700; font-size: 0.8rem; color: var(--foreground);
          text-transform: uppercase; width: 100%; padding-left: 8px;
        }
      `}</style>
    </div>
  );
}