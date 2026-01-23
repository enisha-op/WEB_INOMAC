'use client'
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { FileText, ChevronRight, Search, ChevronLeft, X, Calendar, Mail, Hash, Truck, Users, Phone, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [quotes, setQuotes] = useState([]);
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/stats');
        const result = await response.json();
        setStats(result);
      } catch (error) { console.error("Error al cargar estadísticas"); }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/quotes?status=${statusFilter}&search=${searchTerm}&page=${page}`);
        const result = await response.json();
        setQuotes(result.quotes);
        setTotalPages(result.total_pages);
      } catch (error) { console.error("Error al cargar cotizaciones"); }
      finally { setLoading(false); }
    };
    fetchQuotes();
  }, [statusFilter, searchTerm, page]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const resp = await fetch(`http://localhost:5000/api/admin/quotes/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (resp.ok) {
        setQuotes((prev: any) => prev.map((q: any) => q.id === id ? { ...q, status: newStatus } : q));
      }
    } catch (error) { alert("No se pudo actualizar el estado"); }
  };

  const pieData = [
    { name: 'Empresas', value: stats?.enterprises || 0 },
    { name: 'Pers. Naturales', value: (stats?.total - stats?.enterprises) || 0 },
  ];

  if (!mounted) return null;
  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-[#E60000] font-black tracking-widest uppercase">Cargando Sistema...</div>;

  return (
    // bg-theme y text-theme usan las variables de tu globals.css
    <div className="min-h-screen bg-theme text-theme transition-colors duration-500 font-sans">
      <main className="max-w-[1600px] mx-auto p-8 md:p-16">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-12">
            <h1 className="text-2xl font-black uppercase tracking-tighter">
                Panel de <span className="text-primary italic">Control</span>
            </h1>
            <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-3 rounded-full bg-white/5 border border-theme hover:scale-110 transition-all text-primary shadow-xl"
            >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </div>

        {/* CARDS SUPERIORES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-[var(--card-bg)] border border-theme p-8 rounded-sm flex items-center justify-between shadow-2xl overflow-hidden relative group">
            <div className="relative z-10">
              <p className="text-muted-theme text-[10px] uppercase font-bold tracking-widest mb-2">Total Cotizaciones</p>
              <p className="text-5xl font-black italic text-gradient">{stats?.total || 0}</p>
            </div>
            <FileText className="text-primary opacity-10 absolute -right-4 -bottom-4 rotate-12 group-hover:scale-110 transition-transform" size={120} />
          </div>

          <div className="bg-[var(--card-bg)] border border-theme p-8 rounded-sm flex items-center justify-between shadow-2xl overflow-hidden relative group">
            <div className="relative z-10">
              <p className="text-muted-theme text-[10px] uppercase font-bold tracking-widest mb-2">Clientes Corporativos</p>
              <p className="text-5xl font-black italic text-primary">{stats?.enterprises || 0}</p>
            </div>
            <Users className="text-theme opacity-5 absolute -right-4 -bottom-4 rotate-12 group-hover:scale-110 transition-transform" size={120} />
          </div>
        </div>

        {/* GRÁFICAS */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-[var(--card-bg)] border border-theme p-10 rounded-sm shadow-xl">
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-10 text-muted-theme">Interés por Modelo</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1a1a1a' : '#eee'} vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: 'var(--border-subtle)'}} contentStyle={{backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-subtle)', borderRadius: '0px'}} />
                  <Bar dataKey="total" fill="var(--primary)" barSize={40} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[var(--card-bg)] border border-theme p-10 rounded-sm shadow-xl text-center">
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-10 text-muted-theme text-left">Distribución de Clientes</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={80} outerRadius={100} paddingAngle={5} dataKey="value">
                    <Cell fill="var(--primary)" />
                    <Cell fill={theme === 'dark' ? '#1a1a1a' : '#ddd'} stroke="var(--border-subtle)" />
                  </Pie>
                  <Tooltip contentStyle={{backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-subtle)', borderRadius: '0px'}} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-8 text-[10px] font-bold uppercase tracking-widest mt-4">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-primary"></div> Empresas</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-muted-theme opacity-20"></div> Naturales</div>
              </div>
            </div>
          </div>
        </div>

        {/* BUSCADOR */}
        <div className="flex flex-col md:flex-row gap-6 mb-8 items-center justify-between bg-[var(--card-bg)] p-6 border border-theme rounded-sm shadow-xl">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-theme group-focus-within:text-primary transition-colors" size={16} />
            <input 
              type="text"
              placeholder="BUSCAR CLIENTE O RUC..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full bg-theme border border-theme py-4 pl-12 pr-4 text-[10px] font-bold uppercase tracking-[0.2em] outline-none focus:border-primary transition-all shadow-inner"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-muted-theme uppercase tracking-widest">Estado:</span>
            <select 
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="bg-theme border border-theme text-[10px] uppercase font-bold p-4 outline-none focus:border-primary cursor-pointer shadow-sm hover:border-primary/50 transition-colors"
            >
              <option value="Todos">Todos los Estados</option>
              <option value="Pendiente">Pendientes</option>
              <option value="Contactado">Contactados</option>
              <option value="Vendido">Vendidos</option>
            </select>
          </div>
        </div>

        {/* TABLA */}
        <div className="bg-[var(--card-bg)] border border-theme rounded-sm overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-primary/5 border-b border-theme">
                <tr className="text-[10px] uppercase tracking-[0.2em] text-muted-theme">
                  <th className="p-6">Cliente</th>
                  <th className="p-6">RUC / ID</th>
                  <th className="p-6">Modelo Interés</th>
                  <th className="p-6 text-center">Estado</th>
                  <th className="p-6 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {quotes.length > 0 ? quotes.map((quote: any) => (
                  <tr 
                    key={quote.id} 
                    onClick={() => setSelectedQuote(quote)}
                    className="border-b border-theme hover:bg-primary/[0.02] transition-all cursor-pointer group"
                  >
                    <td className="p-6">
                      <p className="font-bold uppercase tracking-tight group-hover:text-primary transition-colors">{quote.name}</p>
                      <p className="text-[10px] text-muted-theme">{quote.email}</p>
                    </td>
                    <td className="p-6 text-muted-theme font-mono text-xs italic">{quote.ruc || 'P. NATURAL'}</td>
                    <td className="p-6 uppercase text-[11px] font-bold tracking-tight">{quote.model}</td>
                    <td className="p-6" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-center">
                        <select 
                          value={quote.status}
                          onChange={(e) => handleStatusChange(quote.id, e.target.value)}
                          className={`text-[9px] font-black uppercase px-4 py-2 rounded-sm border-none cursor-pointer outline-none transition-all shadow-md ${
                            quote.status === 'Vendido' ? 'bg-green-500/20 text-green-500' : 
                            quote.status === 'Contactado' ? 'bg-blue-500/20 text-blue-500' : 'bg-primary/20 text-primary'
                          }`}
                        >
                          <option value="Pendiente" className="bg-black text-white">Pendiente</option>
                          <option value="Contactado" className="bg-black text-white">Contactado</option>
                          <option value="Vendido" className="bg-black text-white">Vendido</option>
                        </select>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <ChevronRight size={16} className="inline text-muted-theme group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="p-20 text-center text-muted-theme uppercase text-xs tracking-[0.5em] italic animate-pulse">Sin resultados encontrados</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINACIÓN */}
          <div className="p-6 bg-primary/5 border-t border-theme flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[10px] font-bold text-muted-theme uppercase tracking-widest">Página {page} de {totalPages}</span>
            <div className="flex gap-4">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-8 py-3 bg-theme border border-theme hover:bg-primary hover:text-white disabled:opacity-20 transition-all rounded-sm text-[10px] font-black uppercase tracking-widest shadow-lg">Anterior</button>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-8 py-3 bg-theme border border-theme hover:bg-primary hover:text-white disabled:opacity-20 transition-all rounded-sm text-[10px] font-black uppercase tracking-widest shadow-lg">Siguiente</button>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL DETALLE */}
      <AnimatePresence>
        {selectedQuote && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedQuote(null)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.95 }} className="bg-[var(--card-bg)] border border-theme w-full max-w-2xl relative z-[201] rounded-sm shadow-2xl overflow-hidden" >
              <div className="p-8 border-b border-theme flex justify-between items-center bg-primary/5">
                <div>
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter text-primary">Ficha de Cotización</h2>
                  <p className="text-[10px] text-muted-theme uppercase tracking-widest mt-1 font-bold">Registro ID: #{selectedQuote.id}</p>
                </div>
                <button onClick={() => setSelectedQuote(null)} className="text-muted-theme hover:text-primary transition-colors p-2"><X size={24} /></button>
              </div>

              <div className="p-10 space-y-10">
                <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 group">
                            <div className="p-3 bg-primary/10 text-primary rounded-sm group-hover:bg-primary group-hover:text-white transition-colors"><Hash size={18}/></div>
                            <div><p className="text-[9px] uppercase text-muted-theme font-bold">RUC</p><p className="text-sm font-bold uppercase">{selectedQuote.ruc || 'P. NATURAL'}</p></div>
                        </div>
                        <div className="flex items-center gap-4 group">
                            <div className="p-3 bg-primary/10 text-primary rounded-sm group-hover:bg-primary group-hover:text-white transition-colors"><Mail size={18}/></div>
                            <div><p className="text-[9px] uppercase text-muted-theme font-bold">Email</p><p className="text-sm font-bold">{selectedQuote.email}</p></div>
                        </div>
                        <div className="flex items-center gap-4 group">
                            <div className="p-3 bg-primary/10 text-primary rounded-sm group-hover:bg-primary group-hover:text-white transition-colors"><Phone size={18}/></div>
                            <div><p className="text-[9px] uppercase text-muted-theme font-bold">Teléfono</p><p className="text-sm font-bold">{selectedQuote.phone || 'N/A'}</p></div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 group">
                            <div className="p-3 bg-primary/10 text-primary rounded-sm group-hover:bg-primary group-hover:text-white transition-colors"><Truck size={18}/></div>
                            <div><p className="text-[9px] uppercase text-muted-theme font-bold">Modelo</p><p className="text-sm font-bold uppercase">{selectedQuote.model}</p></div>
                        </div>
                        <div className="flex items-center gap-4 group">
                            <div className="p-3 bg-primary/10 text-primary rounded-sm group-hover:bg-primary group-hover:text-white transition-colors"><Calendar size={18}/></div>
                            <div><p className="text-[9px] uppercase text-muted-theme font-bold">Fecha</p><p className="text-sm font-bold italic">{selectedQuote.date}</p></div>
                        </div>
                    </div>
                </div>
                <div className="pt-8 border-t border-theme">
                  <p className="text-[9px] uppercase text-muted-theme font-bold mb-4 tracking-tighter">Observaciones del Cliente</p>
                  <div className="bg-theme p-6 rounded-sm border border-theme italic text-muted-theme text-sm leading-relaxed shadow-inner">"{selectedQuote.message || 'Sin observaciones registradas.'}"</div>
                </div>
              </div>

              <div className="p-8 bg-primary/5 flex flex-col sm:flex-row justify-end gap-4 border-t border-theme">
                <button 
                  onClick={() => {
                    const phone = selectedQuote.phone || "";
                    const msg = encodeURIComponent(`Hola ${selectedQuote.name}, te saluda INOMAC por tu cotización del camión ${selectedQuote.model}.`);
                    window.open(`https://wa.me/51${phone.replace(/\s+/g, '')}?text=${msg}`, '_blank');
                  }}
                  className="bg-green-600 text-white px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-green-500 transition-all flex items-center justify-center gap-2 shadow-xl"
                >
                  <Phone size={14} /> WhatsApp
                </button>
                <button onClick={() => setSelectedQuote(null)} className="bg-theme border border-theme text-theme px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all shadow-xl">Cerrar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}