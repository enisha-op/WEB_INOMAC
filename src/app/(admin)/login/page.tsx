'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Llamada real a tu API en Railway
      const response = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: "admin", // Usamos el username que definimos en app.py
          password: password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardamos el estado de sesión (puedes usar localStorage por ahora)
        localStorage.setItem("isLoggedIn", "true");
        router.push("/dashboard");
      } else {
        setError(data.error || "Credenciales incorrectas");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
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
          <p className="mt-4 text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">Security Access</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 p-4 flex items-center gap-3 text-red-500 text-[10px] font-bold uppercase italic">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-10">
          {/* Email Input */}
          <div className="relative group">
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b-2 border-white/10 py-4 outline-none focus:border-[#E60000] transition-colors peer text-lg"
              placeholder=" "
            />
            <label className="absolute left-0 top-4 text-white/30 uppercase text-[10px] font-black tracking-widest pointer-events-none transition-all peer-focus:-top-6 peer-focus:text-[#E60000] peer-[:not(:placeholder-shown)]:-top-6">
              Email Corporativo
            </label>
          </div>

          {/* Password Input */}
          <div className="relative group">
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b-2 border-white/10 py-4 outline-none focus:border-[#E60000] transition-colors peer text-lg"
              placeholder=" "
            />
            <label className="absolute left-0 top-4 text-white/30 uppercase text-[10px] font-black tracking-widest pointer-events-none transition-all peer-focus:-top-6 peer-focus:text-[#E60000] peer-[:not(:placeholder-shown)]:-top-6">
              Contraseña
            </label>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-[#E60000] text-white py-6 font-black uppercase text-[12px] tracking-[0.4em] hover:brightness-110 transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-4"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Entrar al Panel"}
          </button>
        </form>
      </div>
    </main>
  );
}