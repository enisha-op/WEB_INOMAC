'use client'
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, AreaChart, Area 
} from 'recharts';
import { FileText, Users, Sun, Moon, TrendingUp } from "lucide-react";

export default function AnalyticsDashboard() {
  const { theme, setTheme } = useTheme();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // URL base desde el archivo .env
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    setMounted(true);
    const fetchStats = async () => {
      try {
        // Cambiamos localhost por la variable de entorno dinámica
        const response = await fetch(`${API_URL}/admin/stats`);
        const result = await response.json();
        
        setStats(result);
      } catch (error) { 
        console.error("Error cargando estadísticas de Railway:", error); 
      } finally { 
        setLoading(false); 
      }
    };
    
    if (API_URL) {
      fetchStats();
    }
  }, [API_URL]);

  if (!mounted) return null;

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-primary font-black uppercase italic tracking-widest animate-pulse">
        Sincronizando Métricas Globales...
      </p>
    </div>
  );

  return (
    <div className="p-8 md:p-12 space-y-12">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black uppercase tracking-tighter italic">
          Performance <span className="text-primary">Global</span>
        </h1>
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
          className="p-3 rounded-full bg-primary/10 border border-primary/20 transition-all hover:scale-110"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* KPIs Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[var(--card-bg)] border border-theme p-10 relative overflow-hidden group">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-theme mb-2">Total Solicitudes</p>
          <p className="text-7xl font-black italic tracking-tighter">{stats?.total || 0}</p>
          <FileText className="text-primary opacity-5 absolute -right-6 -bottom-6 rotate-12" size={180} />
        </div>
        <div className="bg-[var(--card-bg)] border border-theme p-10 relative overflow-hidden group">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-theme mb-2">Leads Corporativos</p>
          <p className="text-7xl font-black text-primary italic tracking-tighter">{stats?.enterprises || 0}</p>
          <Users className="text-primary opacity-5 absolute -right-6 -bottom-6 rotate-12" size={180} />
        </div>
      </div>

      {/* Gráfica de Tendencia Mensual */}
      <div className="bg-[var(--card-bg)] border border-theme p-10 rounded-sm shadow-2xl">
        <div className="flex items-center gap-4 mb-10 text-primary">
          <TrendingUp size={20} />
          <h3 className="text-[11px] font-black uppercase tracking-widest">Crecimiento Mensual (Inomac Cloud)</h3>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats?.lineChartData}>
              <defs>
                <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.05} vertical={false} />
              <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-subtle)', borderRadius: '4px'}} />
              <Area type="monotone" dataKey="total" stroke="var(--primary)" strokeWidth={5} fill="url(#colorTrend)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* GRÁFICA DE BARRAS: DEMANDA POR CAMIÓN */}
        <div className="bg-[var(--card-bg)] border border-theme p-10 shadow-xl">
          <h3 className="text-[10px] font-black uppercase tracking-widest mb-12 opacity-50">Demanda por Unidad (Cloud Sync)</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.chartData} margin={{ bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--text-muted)" 
                  fontSize={9} 
                  axisLine={false} 
                  tickLine={false}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                />
                <YAxis stroke="var(--text-muted)" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'rgba(230,0,0,0.05)'}} contentStyle={{backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-subtle)'}} />
                <Bar dataKey="total" fill="var(--primary)" barSize={35}>
                  {stats?.chartData?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'var(--primary)' : '#800000'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART: DISTRIBUCIÓN DE CLIENTES */}
        <div className="bg-[var(--card-bg)] border border-theme p-10 shadow-xl flex flex-col items-center">
          <h3 className="text-[10px] font-black uppercase tracking-widest mb-8 self-start opacity-50">Distribución de Clientes Real-Time</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={[
                    { name: 'Empresas', value: stats?.enterprises || 0 },
                    { name: 'Naturales', value: ((stats?.total || 0) - (stats?.enterprises || 0)) }
                  ]} 
                  innerRadius={70} 
                  outerRadius={95} 
                  paddingAngle={8} 
                  dataKey="value"
                >
                  <Cell fill="var(--primary)" />
                  <Cell fill={theme === 'dark' ? '#1a1a1a' : '#ddd'} />
                </Pie>
                <Tooltip contentStyle={{backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-subtle)'}} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-8 mt-4">
               <div className="flex items-center gap-2 text-[10px] font-bold uppercase"><div className="w-3 h-3 bg-red-600"></div> Empresas</div>
               <div className="flex items-center gap-2 text-[10px] font-bold uppercase"><div className="w-3 h-3 bg-gray-500"></div> Personas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}