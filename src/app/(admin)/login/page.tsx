'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulación de login - Luego conectarás con Flask
    if (email === "admin@inomac.pe" && password === "admin123") {
      router.push("/dashboard");
    } else {
      alert("Credenciales incorrectas");
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

        <form onSubmit={handleLogin} className="space-y-10">
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

          <button className="w-full bg-[#E60000] text-white py-6 font-black uppercase text-[12px] tracking-[0.4em] hover:brightness-110 transition-all shadow-2xl active:scale-[0.98]">
            Entrar al Panel
          </button>
        </form>
      </div>
    </main>
  );
}