'use client'
import { useState, useEffect } from "react";
import { 
  Search, X, Download, Save, Calculator, Phone, Loader2, User, Mail, Truck, 
  Hash, ChevronLeft, ChevronRight 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- COMPONENTE INTERNO: MODAL PARA CREAR COTIZACIÓN ---
function CreateQuoteModal({ onClose, onSuccess, API_URL }: any) {
  const [customers, setCustomers] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedTruck, setSelectedTruck] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [customPrice, setCustomPrice] = useState(0);

  const customerData: any = customers.find((c: any) => c.id.toString() === selectedCustomerId);

  useEffect(() => {
    const fetchData = async () => {
      const [resCust, resTrucks] = await Promise.all([
        fetch(`${API_URL}/admin/quotes?search=`),
        fetch(`${API_URL}/admin/trucks`)
      ]);
      const dataCust = await resCust.json();
      const dataTrucks = await resTrucks.json();
      setCustomers(dataCust.quotes || []);
      setTrucks(dataTrucks || []);
    };
    fetchData();
  }, [API_URL]);

  const handleSubmit = async () => {
    if (!selectedCustomerId || !selectedTruck) return alert("Selecciona cliente y unidad");
    setLoading(true);
    
    const subtotal = quantity * customPrice;
    const totalWithIgv = subtotal * 1.18;

    try {
      const res = await fetch(`${API_URL}/admin/quotes/manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: selectedCustomerId,
          model: selectedTruck.name,
          quantity,
          unit_price: customPrice,
          total_amount: totalWithIgv
        })
      });
      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-md">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0a0a0a] border border-white/10 w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <h2 className="text-xl font-black uppercase italic tracking-tighter">Generar <span className="text-primary">Cotización</span></h2>
          <button onClick={onClose} className="text-muted-theme hover:text-white transition-colors"><X size={24}/></button>
        </div>

        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2"><User size={12}/> Cliente del Directorio</label>
            <select 
              className="w-full bg-white/5 border border-white/10 p-4 text-[11px] font-bold uppercase outline-none focus:border-primary text-white"
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              value={selectedCustomerId}
            >
              <option value="" className="bg-[#0a0a0a]">-- SELECCIONAR CLIENTE --</option>
              {customers.map((c: any) => (
                <option key={c.id} value={c.id} className="bg-[#0a0a0a]">{c.name}</option>
              ))}
            </select>

            <AnimatePresence>
              {customerData && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-4 bg-primary/5 border border-primary/20 rounded-sm">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-theme truncate"><Hash size={12} className="text-primary"/> {customerData.ruc || 'S/D'}</div>
                  <div className="flex items-center gap-2 text-[10px] font-bold lowercase text-muted-theme truncate"><Mail size={12} className="text-primary"/> {customerData.email}</div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-muted-theme italic"><Phone size={12} className="text-primary"/> {customerData.phone}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid md:grid-cols-2 gap-6 border-t border-white/5 pt-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2"><Truck size={12}/> Unidad</label>
              <select 
                className="w-full bg-white/5 border border-white/10 p-4 text-[11px] font-bold uppercase outline-none focus:border-primary text-white"
                onChange={(e) => {
                  const truck = trucks.find((t: any) => t.id === parseInt(e.target.value));
                  setSelectedTruck(truck);
                  if (truck) setCustomPrice((truck as any).price);
                }}
              >
                <option value="" className="bg-[#0a0a0a]">-- MODELO --</option>
                {trucks.map((t: any) => (
                  <option key={t.id} value={t.id} className="bg-[#0a0a0a]">{t.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2"><Calculator size={12}/> Cantidad</label>
              <input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 p-4 text-[11px] font-bold outline-none focus:border-primary text-white" />
            </div>
          </div>

          <div className="space-y-3 bg-white/[0.02] p-6 border border-white/5">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-theme">Precio Unitario ($)</label>
            <div className="flex items-center gap-4">
               <span className="text-2xl font-black text-primary">$</span>
               <input type="number" value={customPrice} onChange={(e) => setCustomPrice(parseFloat(e.target.value))} className="w-full bg-transparent p-0 text-3xl font-black text-white outline-none" />
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading} className="w-full bg-primary text-white py-6 font-black uppercase tracking-[0.3em] text-xs hover:bg-red-700 transition-all flex items-center justify-center gap-4 shadow-xl">
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5"/>}
            {loading ? "PROCESANDO..." : "REGISTRAR COTIZACIÓN"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL ---
export default function QuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [quoteItems, setQuoteItems] = useState<any[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (selectedQuote) {
      const models = selectedQuote.model.split(',').map((m: string) => m.trim());
      const items = models.map((name: string) => ({
        name,
        quantity: selectedQuote.quantity || 1,
        unit_price: selectedQuote.unit_price || 0
      }));
      setQuoteItems(items);
    }
  }, [selectedQuote]);

  const subtotal = quoteItems.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
  const igv = subtotal * 0.18;
  const totalConIgv = subtotal + igv;

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/quotes?status=${statusFilter}&search=${searchTerm}&page=${page}`);
      const result = await response.json();
      setQuotes(result.quotes || []);
      setTotalPages(result.total_pages || 1);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  useEffect(() => { 
    if (API_URL) fetchQuotes(); 
  }, [statusFilter, searchTerm, page, API_URL]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const resp = await fetch(`${API_URL}/admin/quotes/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (resp.ok) {
        setQuotes((prev: any) => prev.map((q: any) => q.id === id ? { ...q, status: newStatus } : q));
      }
    } catch (error) { console.error(error); }
  };

  const handleUpdateAmounts = async () => {
    if (quoteItems.some(item => item.quantity <= 0 || item.unit_price <= 0)) {
      alert("ERROR: Datos inválidos"); return;
    }
    try {
      const resp = await fetch(`${API_URL}/admin/quotes/${selectedQuote.id}/amounts`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total_amount: totalConIgv, items: quoteItems })
      });
      if (resp.ok) {
        setIsEditingAmount(false);
        fetchQuotes();
        alert("Montos sincronizados.");
      }
    } catch (error) { console.error(error); }
  };

  const generatePDF = (quote: any) => {
    const doc = new jsPDF();
    doc.setFillColor(230, 0, 0);
    doc.rect(0, 0, 210, 45, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold"); doc.setFontSize(26); doc.text("INOMAC", 15, 25);
    doc.setFontSize(9); doc.text("COTIZACIÓN OFICIAL - INC. IGV 18%", 15, 33);
    doc.text(`ID: #${quote.id.toString().padStart(6, '0')}`, 145, 25);
    doc.text(`FECHA: ${quote.date}`, 145, 33);
    doc.setTextColor(0, 0, 0); doc.setFontSize(12); doc.text("INFORMACIÓN DEL CLIENTE", 15, 60);
    autoTable(doc, {
      startY: 65,
      body: [["TITULAR:", quote.name.toUpperCase()], ["RUC / DNI:", quote.ruc || "N/A"], ["WHATSAPP:", quote.phone || "N/A"], ["EMAIL:", quote.email.toLowerCase()]],
      theme: 'plain', styles: { fontSize: 9 }, columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } }
    });
    const bodyRows = quoteItems.map(item => [item.name.toUpperCase(), item.quantity, `$${item.unit_price.toLocaleString()}`, `$${(item.quantity * item.unit_price).toLocaleString()}`]);
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 15,
      head: [['MODELO', 'CANT', 'PRECIO UNIT.', 'SUBTOTAL']],
      body: bodyRows,
      foot: [['', '', 'SUBTOTAL:', `$${subtotal.toLocaleString()}`], ['', '', 'IGV (18%):', `$${igv.toLocaleString()}`], ['', '', 'TOTAL NETO:', `$${totalConIgv.toLocaleString()}`]],
      headStyles: { fillColor: [40, 40, 40] },
      footStyles: { fillColor: [245, 245, 245], textColor: [0, 0, 0], fontStyle: 'bold' },
      styles: { fontSize: 9 },
      columnStyles: { 0: { cellWidth: 85 } },
      didParseCell: (data) => { if (data.section === 'foot' && data.row.index === 2) { data.cell.styles.fillColor = [230, 0, 0]; data.cell.styles.textColor = [255, 255, 255]; } }
    });
    doc.save(`Cotizacion_INOMAC_${quote.id}.pdf`);
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto">
      <div className="mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic">Gestión de <span className="text-primary">Cotizaciones</span></h1>
          <p className="text-muted-theme text-[10px] md:text-xs font-bold uppercase tracking-widest mt-2">Seguimiento de leads y cierre de ventas Cloud</p>
        </div>
        {/* <button 
          onClick={() => setShowCreateModal(true)}
          className="w-full md:w-auto bg-white text-black px-8 py-4 font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3"
        >
          <Save className="w-4 h-4" /> Nueva Cotización
        </button> */}
      </div>

      <div className="bg-[var(--card-bg)] border border-theme shadow-2xl overflow-hidden rounded-sm">
        <div className="p-4 md:p-8 border-b border-theme flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-primary/5">
          <div className="relative group w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-theme group-focus-within:text-primary w-4 h-4" />
            <input type="text" placeholder="BUSCAR NOMBRE O RUC..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setPage(1);}} className="w-full bg-theme border border-theme py-3 md:py-4 pl-12 pr-4 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-primary transition-all shadow-inner" />
          </div>
          <select value={statusFilter} onChange={(e) => {setStatusFilter(e.target.value); setPage(1);}} className="bg-theme border border-theme text-[10px] uppercase font-bold p-3 md:p-4 outline-none cursor-pointer w-full lg:w-auto">
            <option value="Todos">Todos los Estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Contactado">Contactado</option>
            <option value="Vendido">Vendido</option>
          </select>
        </div>

        {loading ? (
          <div className="p-10 md:p-20 text-center"><Loader2 className="animate-spin mx-auto text-primary mb-4 w-10 h-10" /><p className="text-[10px] font-black uppercase tracking-widest">Sincronizando...</p></div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-primary/5 border-b border-theme text-[9px] uppercase tracking-[0.3em] text-muted-theme">
                  <tr><th className="p-6">Lead / Entidad</th><th className="p-6">Unidad(es)</th><th className="p-6">Inversión (Inc. IGV)</th><th className="p-6 text-center">Estado</th><th className="p-6 text-right">Acción</th></tr>
                </thead>
                <tbody className="text-sm divide-y divide-theme">
                  {quotes.map((quote: any) => (
                    <tr key={quote.id} onClick={() => setSelectedQuote(quote)} className="hover:bg-primary/[0.03] transition-all cursor-pointer group">
                      <td className="p-6"><p className="font-black uppercase tracking-tight group-hover:text-primary">{quote.name}</p><p className="text-[10px] text-muted-theme italic lowercase">{quote.email}</p></td>
                      <td className="p-6 uppercase text-[10px] font-bold truncate max-w-[150px]">{quote.model}</td>
                      <td className="p-6 font-black text-primary italic">${quote.total?.toLocaleString() || '0'}</td>
                      <td className="p-6 text-center" onClick={(e) => e.stopPropagation()}>
                        <select value={quote.status} onChange={(e) => handleStatusChange(quote.id, e.target.value)} className={`text-[9px] font-black uppercase px-3 py-2 rounded-sm border-none cursor-pointer ${quote.status === 'Vendido' ? 'bg-green-600 text-white' : quote.status === 'Contactado' ? 'bg-blue-600 text-white' : 'bg-primary text-white'}`}>
                          <option value="Pendiente">Pendiente</option>
                          <option value="Contactado">Contactado</option>
                          <option value="Vendido">Vendido</option>
                        </select>
                      </td>
                      <td className="p-6 text-right" onClick={(e) => e.stopPropagation()}><button onClick={() => generatePDF(quote)} className="text-muted-theme hover:text-primary p-2 transition-transform hover:scale-110"><Download className="w-5 h-5" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-theme">
              {quotes.map((quote: any) => (
                <div key={quote.id} onClick={() => setSelectedQuote(quote)} className="p-6 space-y-4 active:bg-white/5 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1"><h3 className="font-black uppercase text-sm group-hover:text-primary italic">{quote.name}</h3><p className="text-[10px] text-muted-theme lowercase truncate max-w-[200px]">{quote.email}</p></div>
                    <button onClick={(e) => { e.stopPropagation(); generatePDF(quote); }} className="p-2 bg-white/5 text-primary rounded-sm border border-white/5"><Download className="w-4 h-4" /></button>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-theme"><Truck className="w-3 h-3 text-primary" /> {quote.model}</div>
                  <div className="flex justify-between items-center pt-2">
                    <p className="font-black text-lg text-primary italic">${quote.total?.toLocaleString() || '0'}</p>
                    <div onClick={(e) => e.stopPropagation()}>
                      <select value={quote.status} onChange={(e) => handleStatusChange(quote.id, e.target.value)} className={`text-[8px] font-black uppercase px-4 py-2 rounded-sm border-none ${quote.status === 'Vendido' ? 'bg-green-600 text-white' : quote.status === 'Contactado' ? 'bg-blue-600 text-white' : 'bg-primary text-white'}`}>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Contactado">Contactado</option>
                        <option value="Vendido">Vendido</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-theme bg-primary/5 flex justify-between items-center">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-theme">Página <span className="text-primary">{page}</span> de {totalPages}</p>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-3 bg-theme border border-theme rounded-sm disabled:opacity-20 hover:border-primary transition-colors"><ChevronLeft size={16} /></button>
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="p-3 bg-theme border border-theme rounded-sm disabled:opacity-20 hover:border-primary transition-colors"><ChevronRight size={16} /></button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* MODALES */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateQuoteModal API_URL={API_URL} onClose={() => setShowCreateModal(false)} onSuccess={() => { fetchQuotes(); alert("Cotización generada"); }} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedQuote && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-2 sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedQuote(null)} className="absolute inset-0 bg-black/95 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[var(--card-bg)] border border-theme w-full max-w-6xl relative z-[201] rounded-sm shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[90vh]">
              <div className="flex-grow p-5 md:p-12 overflow-y-auto border-b lg:border-b-0 lg:border-r border-theme custom-scrollbar">
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div><span className="text-primary font-black italic text-3xl md:text-4xl tracking-tighter uppercase">INOMAC</span><h2 className="text-sm md:text-xl font-bold uppercase tracking-widest mt-1">Cotización Nº {selectedQuote.id.toString().padStart(6, '0')}</h2></div>
                  <div className="text-left sm:text-right uppercase font-black"><p className="text-[9px] text-muted-theme">Registro Cloud</p><p className="text-[10px] md:text-xs italic">{selectedQuote.date}</p></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-[10px] font-bold uppercase">
                  <div className="space-y-3"><div><p className="text-muted-theme text-[8px] mb-1">Titular</p><p className="text-sm font-black text-primary tracking-tight">{selectedQuote.name}</p></div><div><p className="text-muted-theme text-[8px] mb-1">RUC / DNI</p><p>{selectedQuote.ruc || 'Natural'}</p></div></div>
                  <div className="space-y-3 sm:text-right"><div><p className="text-muted-theme text-[8px] mb-1">Contacto</p><p className="lowercase font-medium text-xs mb-1">{selectedQuote.email}</p><p>{selectedQuote.phone}</p></div></div>
                </div>
                <div className="border border-theme overflow-x-auto mb-6">
                  <table className="w-full text-left min-w-[500px]">
                    <thead className="bg-primary/5 text-[9px] font-black uppercase tracking-widest border-b border-theme">
                      <tr><th className="p-4">Descripción</th><th className="p-4 text-center w-20">Cant.</th><th className="p-4 text-right">Precio Unit.</th><th className="p-4 text-right">Subtotal</th></tr>
                    </thead>
                    <tbody className="text-[11px] font-bold uppercase">
                      {quoteItems.map((item, idx) => (
                        <tr key={idx} className="border-b border-theme last:border-0 hover:bg-white/[0.02]">
                          <td className="p-4 text-primary font-black italic">{item.name}</td>
                          <td className="p-4 text-center">{isEditingAmount ? <input type="number" value={item.quantity} onChange={(e) => { const n = [...quoteItems]; n[idx].quantity = parseInt(e.target.value); setQuoteItems(n); }} className="w-14 bg-theme border border-theme p-1 text-center" /> : item.quantity}</td>
                          <td className="p-4 text-right">{isEditingAmount ? <input type="number" value={item.unit_price} onChange={(e) => { const n = [...quoteItems]; n[idx].unit_price = parseFloat(e.target.value); setQuoteItems(n); }} className="w-20 bg-theme border border-theme p-1 text-right" /> : `$${item.unit_price.toLocaleString()}`}</td>
                          <td className="p-4 text-right font-black">${(item.quantity * item.unit_price).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end"><div className="w-full sm:max-w-xs space-y-1 text-[9px] font-black uppercase tracking-widest"><div className="flex justify-between p-2 bg-primary/5"><span>Subtotal:</span><span>${subtotal.toLocaleString()}</span></div><div className="flex justify-between p-2 bg-primary/5"><span className="text-red-600">IGV (18%):</span><span>${igv.toLocaleString()}</span></div><div className="flex justify-between p-3 bg-primary text-white text-sm"><span>TOTAL USD:</span><span>${totalConIgv.toLocaleString()}</span></div></div></div>
              </div>
              <div className="w-full lg:w-80 bg-primary/5 p-6 md:p-8 flex flex-col justify-between border-t lg:border-t-0 border-theme">
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-theme mb-2 col-span-2 hidden lg:block">Operaciones</p>
                  {!isEditingAmount ? <button onClick={() => setIsEditingAmount(true)} className="w-full bg-theme border border-theme p-3 md:p-4 text-[9px] font-black uppercase flex items-center justify-center gap-2 hover:bg-primary transition-all"><Calculator size={14} /> Editar</button> : <button onClick={handleUpdateAmounts} className="w-full bg-primary text-white p-3 md:p-4 text-[9px] font-black uppercase flex items-center justify-center gap-2 shadow-lg"><Save size={14} /> Guardar</button>}
                  <button onClick={() => generatePDF(selectedQuote)} className="w-full bg-theme border border-theme p-3 md:p-4 text-[9px] font-black uppercase flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all"><Download size={14} /> PDF</button>
                  <button onClick={() => { const phone = selectedQuote.phone || ""; const msg = encodeURIComponent(`Hola ${selectedQuote.name}, te saluda INOMAC. Cotización Nº${selectedQuote.id} por $${totalConIgv.toLocaleString()}.`); window.open(`https://wa.me/51${phone.replace(/\s+/g, '')}?text=${msg}`, '_blank'); }} className="w-full bg-green-600 text-white p-3 md:p-4 text-[9px] font-black uppercase flex items-center justify-center gap-2 shadow-xl col-span-2 lg:col-span-1"><Phone size={14} /> WhatsApp</button>
                </div>
                <button onClick={() => setSelectedQuote(null)} className="mt-6 lg:mt-10 w-full text-[9px] font-black uppercase text-muted-theme hover:text-primary transition-colors py-2">Cerrar Ficha</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}