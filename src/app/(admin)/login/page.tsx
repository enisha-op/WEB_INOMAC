'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  
  // Extraemos la URL de la API desde las variables de entorno
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Verificación de configuración en consola (solo visible para ti en desarrollo)
  useEffect(() => {
    if (!API_URL) {
      console.error("⚠️ NEXT_PUBLIC_API_URL no está configurada en Vercel/Local.");
    }
  }, [API_URL]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!API_URL) {
      setError("Error de configuración del sistema (API URL)");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Forzamos el uso de la URL absoluta para evitar que se anexe al dominio de Vercel
      const response = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ 
          username: "admin", // Credencial definida en tu app.py
          password: password 
        }),
      });

      // Manejo específico del error 405 (URL mal formada o método bloqueado)
      if (response.status === 405) {
        throw new Error("El servidor rechazó la conexión (405). Verifica el protocolo HTTPS.");
      }

      const data = await response.json();

      if (response.ok) {
        // Almacenamos la sesión localmente
        localStorage.setItem("isLoggedIn", "true");
        router.push("/dashboard");
      } else {
        setError(data.error || "Credenciales no autorizadas");
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.message || "No se pudo establecer conexión con Railway");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen w-full flex items-center justify-center bg-black text-white px-6">
      <div className="w-full max-w-md space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-light tracking-[0.4em] uppercase text-white">
            INO<span className="font-black italic text-[#E60000]">MAC</span>
          </h2>
          <p className="mt-4 text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">Security Access Control</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 p-4 flex items-center gap-3 text-red-500 text-[10px] font-bold uppercase italic shadow-lg animate-shake">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-10">
          <div className="relative group">
            <input 
              type="email" 
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b-2 border-white/10 py-4 outline-none focus:border-[#E60000] transition-colors peer text-lg font-medium"
              placeholder=" "
            />
            <label className="absolute left-0 top-4 text-white/30 uppercase text-[10px] font-black tracking-widest pointer-events-none transition-all peer-focus:-top-6 peer-focus:text-[#E60000] peer-[:not(:placeholder-shown)]:-top-6">
              Usuario / Email Corporativo
            </label>
          </div>

          <div className="relative group">
            <input 
              type="password" 
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b-2 border-white/10 py-4 outline-none focus:border-[#E60000] transition-colors peer text-lg"
              placeholder=" "
            />
            <label className="absolute left-0 top-4 text-white/30 uppercase text-[10px] font-black tracking-widest pointer-events-none transition-all peer-focus:-top-6 peer-focus:text-[#E60000] peer-[:not(:placeholder-shown)]:-top-6">
              Contraseña del Sistema
            </label>
          </div>

          <button 
            disabled={loading}
            type="submit"
            className="w-full bg-[#E60000] text-white py-6 font-black uppercase text-[12px] tracking-[0.4em] hover:bg-red-700 transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-4 disabled:opacity-50 disabled:grayscale"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Verificando...
              </>
            ) : "Entrar al Panel"}
          </button>
        </form>
      </div>
    </main>
  );
}