'use client'
import { useState, useEffect } from "react";
import { 
  Search, X, Download, Save, Calculator, Phone, Loader2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function QuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [quoteItems, setQuoteItems] = useState<any[]>([]);

  // URL base desde el .env
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

  // --- LÓGICA DE CÁLCULOS TRIBUTARIOS ---
  const subtotal = quoteItems.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
  const igv = subtotal * 0.18;
  const totalConIgv = subtotal + igv;

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      // Usamos la variable de entorno de Railway
      const response = await fetch(`${API_URL}/admin/quotes?status=${statusFilter}&search=${searchTerm}&page=${page}`);
      const result = await response.json();
      setQuotes(result.quotes);
      setTotalPages(result.total_pages);
    } catch (error) { 
      console.error("Error al obtener cotizaciones de Railway:", error); 
    } finally { 
      setLoading(false); 
    }
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
      alert("ERROR: Verifique que cantidad y precio sean mayores a 0.");
      return;
    }

    try {
      const resp = await fetch(`${API_URL}/admin/quotes/${selectedQuote.id}/amounts`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          total_amount: totalConIgv, 
          items: quoteItems 
        })
      });
      if (resp.ok) {
        setIsEditingAmount(false);
        fetchQuotes();
        alert("Montos sincronizados con la base de datos de Railway.");
      }
    } catch (error) { console.error(error); }
  };

  // ... (Lógica de generatePDF se mantiene igual, es local del cliente) ...
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
      body: [
        ["TITULAR:", quote.name.toUpperCase()],
        ["RUC / DNI:", quote.ruc || "PERSONA NATURAL"],
        ["WHATSAPP:", quote.phone || "N/A"],
        ["EMAIL:", quote.email.toLowerCase()]
      ],
      theme: 'plain', styles: { fontSize: 9 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } }
    });

    const bodyRows = quoteItems.map(item => [
      item.name.toUpperCase(),
      item.quantity,
      `$${item.unit_price.toLocaleString()}`,
      `$${(item.quantity * item.unit_price).toLocaleString()}`
    ]);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 15,
      head: [['MODELO', 'CANT', 'PRECIO UNIT.', 'SUBTOTAL']],
      body: bodyRows,
      foot: [
        ['', '', 'SUBTOTAL:', `$${subtotal.toLocaleString()}`],
        ['', '', 'IGV (18%):', `$${igv.toLocaleString()}`],
        ['', '', 'TOTAL NETO:', `$${totalConIgv.toLocaleString()}`]
      ],
      headStyles: { fillColor: [40, 40, 40] },
      footStyles: { fillColor: [245, 245, 245], textColor: [0, 0, 0], fontStyle: 'bold' },
      styles: { fontSize: 9 },
      columnStyles: { 0: { cellWidth: 85 } },
      didParseCell: (data) => {
        if (data.section === 'foot' && data.row.index === 2) {
          data.cell.styles.fillColor = [230, 0, 0];
          data.cell.styles.textColor = [255, 255, 255];
        }
      }
    });

    doc.save(`Cotizacion_INOMAC_${quote.id}.pdf`);
  };

  return (
    <div className="p-8 md:p-12">
      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-4xl font-black uppercase tracking-tighter italic">Gestión de <span className="text-primary">Cotizaciones</span></h1>
        <p className="text-muted-theme text-xs font-bold uppercase tracking-widest mt-2">Seguimiento de leads y cierre de ventas en tiempo real</p>
      </div>

      {/* FILTROS Y BUSQUEDA */}
      <div className="bg-[var(--card-bg)] border border-theme shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-theme flex flex-col md:flex-row justify-between items-center gap-6 bg-primary/5">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-theme group-focus-within:text-primary" size={16} />
            <input type="text" placeholder="BUSCAR POR NOMBRE O RUC..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-theme border border-theme py-4 pl-12 pr-4 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-primary transition-all shadow-inner" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-theme border border-theme text-[10px] uppercase font-bold p-4 outline-none cursor-pointer w-full md:w-auto">
            <option value="Todos">Todos los Estados</option>
            <option value="Pendiente">Pendientes</option>
            <option value="Contactado">Contactados</option>
            <option value="Vendido">Vendidos</option>
          </select>
        </div>

        {/* TABLA DE RESULTADOS */}
        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="animate-spin mx-auto text-primary mb-4" size={40} />
            <p className="text-[10px] font-black uppercase tracking-widest">Sincronizando con Railway...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[9px] uppercase tracking-[0.3em] text-muted-theme bg-primary/5 border-b border-theme">
                <th className="p-6">Lead / Entidad</th>
                <th className="p-6">Unidad(es)</th>
                <th className="p-6">Inversión (Inc. IGV)</th>
                <th className="p-6 text-center">Estado</th>
                <th className="p-6 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote: any) => (
                <tr key={quote.id} onClick={() => setSelectedQuote(quote)} className="border-b border-theme hover:bg-primary/[0.03] transition-all cursor-pointer group">
                  <td className="p-6">
                    <p className="font-black uppercase tracking-tight group-hover:text-primary">{quote.name}</p>
                    <p className="text-[10px] text-muted-theme italic lowercase">{quote.email}</p>
                  </td>
                  <td className="p-6 uppercase text-[10px] font-bold truncate max-w-[200px]">{quote.model}</td>
                  <td className="p-6 font-black text-primary italic">${quote.total?.toLocaleString() || '0'}</td>
                  
                  <td className="p-6 text-center" onClick={(e) => e.stopPropagation()}>
                    <select 
                      value={quote.status} 
                      onChange={(e) => handleStatusChange(quote.id, e.target.value)}
                      className={`text-[9px] font-black uppercase px-4 py-2 rounded-sm border-none cursor-pointer shadow-md transition-all ${
                        quote.status === 'Vendido' 
                        ? 'bg-green-600 text-white' 
                        : quote.status === 'Contactado' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-primary text-white'
                      }`}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Contactado">Contactado</option>
                      <option value="Vendido">Vendido</option>
                    </select>
                  </td>

                  <td className="p-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => generatePDF(quote)} className="text-muted-theme hover:text-primary transition-all p-2 hover:scale-110"><Download size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL DE DETALLE Y EDICIÓN */}
      <AnimatePresence>
        {selectedQuote && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedQuote(null)} className="absolute inset-0 bg-black/95 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[var(--card-bg)] border border-theme w-full max-w-6xl relative z-[201] rounded-sm shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
              <div className="flex-grow p-8 md:p-12 overflow-y-auto border-r border-theme custom-scrollbar">
                <div className="mb-10 flex justify-between items-start border-b border-theme pb-8">
                  <div><span className="text-primary font-black italic text-4xl tracking-tighter uppercase">INOMAC</span><h2 className="text-xl font-bold uppercase tracking-widest mt-2">Cotización Nº {selectedQuote.id.toString().padStart(6, '0')}</h2></div>
                  <div className="text-right uppercase font-black"><p className="text-[10px] text-muted-theme">Registro Cloud</p><p className="text-xs italic">{selectedQuote.date}</p></div>
                </div>

                {/* INFO CLIENTE */}
                <div className="grid md:grid-cols-2 gap-10 mb-10 text-[10px] font-bold uppercase">
                  <div className="space-y-4">
                    <div><p className="text-muted-theme text-[8px] mb-1">Titular</p><p className="text-base font-black text-primary tracking-tight">{selectedQuote.name}</p></div>
                    <div><p className="text-muted-theme text-[8px] mb-1">RUC / DNI</p><p>{selectedQuote.ruc || 'Persona Natural'}</p></div>
                  </div>
                  <div className="space-y-4 text-right">
                    <div><p className="text-muted-theme text-[8px] mb-1">Contacto Directo</p><p className="lowercase font-medium text-xs mb-1">{selectedQuote.email}</p><p>{selectedQuote.phone}</p></div>
                  </div>
                </div>

                {/* TABLA DE ITEMS */}
                <div className="border border-theme overflow-hidden mb-6">
                  <table className="w-full text-left">
                    <thead className="bg-primary/5 text-[9px] font-black uppercase tracking-widest border-b border-theme">
                      <tr><th className="p-4">Descripción</th><th className="p-4 text-center w-24">Cant.</th><th className="p-4 text-right">Precio Unit.</th><th className="p-4 text-right">Subtotal</th></tr>
                    </thead>
                    <tbody className="text-[11px] font-bold uppercase">
                      {quoteItems.map((item, idx) => (
                        <tr key={idx} className="border-b border-theme last:border-0 hover:bg-white/[0.02]">
                          <td className="p-4 text-primary font-black italic">{item.name}</td>
                          <td className="p-4 text-center">
                            {isEditingAmount ? (
                              <input type="number" value={item.quantity} onChange={(e) => { const n = [...quoteItems]; n[idx].quantity = parseInt(e.target.value); setQuoteItems(n); }} className="w-16 bg-theme border border-theme p-1 text-center" />
                            ) : item.quantity}
                          </td>
                          <td className="p-4 text-right">
                            {isEditingAmount ? (
                              <input type="number" value={item.unit_price} onChange={(e) => { const n = [...quoteItems]; n[idx].unit_price = parseFloat(e.target.value); setQuoteItems(n); }} className="w-24 bg-theme border border-theme p-1 text-right" />
                            ) : `$${item.unit_price.toLocaleString()}`}
                          </td>
                          <td className="p-4 text-right font-black">${(item.quantity * item.unit_price).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* TOTALES */}
                <div className="flex justify-end">
                  <div className="w-full max-w-xs space-y-2 text-[10px] font-black uppercase tracking-widest">
                    <div className="flex justify-between p-2 bg-primary/5 border border-theme">
                      <span className="text-muted-theme">Subtotal (Neto):</span>
                      <span>${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-primary/5 border border-theme">
                      <span className="text-red-600">IGV (18%):</span>
                      <span>${igv.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-4 bg-primary text-white text-base tracking-tighter">
                      <span>TOTAL A PAGAR:</span>
                      <span>${totalConIgv.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* BARRA LATERAL ACCIONES */}
              <div className="w-full md:w-80 bg-primary/5 p-8 flex flex-col justify-between border-l border-theme">
                <div className="space-y-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-theme mb-6">Operaciones</p>
                  {!isEditingAmount ? (
                    <button onClick={() => setIsEditingAmount(true)} className="w-full bg-theme border border-theme p-4 text-[10px] font-black uppercase flex items-center justify-center gap-3 hover:bg-primary transition-all"><Calculator size={16} /> Editar Precios</button>
                  ) : (
                    <button onClick={handleUpdateAmounts} className="w-full bg-primary text-white p-4 text-[10px] font-black uppercase flex items-center justify-center gap-3"><Save size={16} /> Guardar Cambios</button>
                  )}
                  <button onClick={() => generatePDF(selectedQuote)} className="w-full bg-theme border border-theme p-4 text-[10px] font-black uppercase flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all"><Download size={16} /> Descargar PDF</button>
                  <button onClick={() => {
                    const phone = selectedQuote.phone || "";
                    const msg = encodeURIComponent(`Hola ${selectedQuote.name}, te saluda INOMAC. Proforma oficial por un total de $${totalConIgv.toLocaleString()} (IGV incluido).`);
                    window.open(`https://wa.me/51${phone.replace(/\s+/g, '')}?text=${msg}`, '_blank');
                  }} className="w-full bg-green-600 text-white p-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl"><Phone size={16} /> WhatsApp</button>
                </div>
                <button onClick={() => setSelectedQuote(null)} className="mt-10 w-full text-[10px] font-black uppercase text-muted-theme hover:text-primary transition-colors py-4">Cerrar Ficha</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}