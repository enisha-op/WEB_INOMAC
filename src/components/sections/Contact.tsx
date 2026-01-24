'use client'
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";

export const Contact = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'), // <--- CAPTURA DEL TELÉFONO
      ruc: formData.get('ruc'),
      model: formData.get('model'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('http://localhost:5000/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus('success');
        (e.target as HTMLFormElement).reset();
      } else {
        setErrorMessage(result.error || "Error al enviar");
        setStatus('error');
      }
    } catch (error) {
      setErrorMessage("No se pudo conectar con el servidor");
      setStatus('error');
    }
  };

  return (
    <section id="contacto" className="py-32 bg-white text-black transition-colors duration-500">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-24 items-start">
          
          {/* Lado Izquierdo: Texto Editorial */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-red-600 font-bold tracking-[0.5em] uppercase text-[12px] mb-6 block">
              Personal Concierge
            </span>
            <h2 className="text-5xl md:text-7xl font-light uppercase tracking-tighter mb-10 leading-none">
              SOLUCITE UNA <br />
              <span className="font-black italic text-red-600">ASESORÍA</span>
            </h2>
            
            <p className="text-gray-700 font-medium leading-relaxed max-w-md mb-12 italic text-xl">
              Permítanos ayudarle a configurar la solución de transporte perfecta para su negocio. Un consultor especializado de INOMAC se pondrá en contacto con usted en las próximas 24 horas.
            </p>
            
            <div className="space-y-6">
              <p className="text-[12px] font-bold tracking-[0.3em] uppercase text-gray-400">Línea Directa</p>
              <p className="text-4xl font-bold tracking-tighter text-black">+51 949 119 350</p>
              <div className="h-[2px] w-16 bg-red-600" />
            </div>
          </motion.div>

          {/* Lado Derecho: Formulario */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="pt-4"
          >
            {/* <form onSubmit={handleSubmit} className="space-y-12">
              {/* Fila 1: Nombre y RUC */}
              <div className="grid md:grid-cols-2 gap-12">
                <div className="relative group">
                  <input 
                    name="name"
                    type="text" 
                    id="name" 
                    required 
                    className="w-full bg-transparent border-b-2 border-gray-100 py-4 outline-none focus:border-red-600 transition-colors peer text-xl font-semibold text-black" 
                    placeholder=" " 
                  />
                  <label htmlFor="name" className="absolute left-0 top-4 text-gray-400 font-bold uppercase text-xs tracking-widest pointer-events-none transition-all peer-focus:-top-8 peer-focus:text-red-600 peer-focus:text-[11px] peer-[:not(:placeholder-shown)]:-top-8 peer-[:not(:placeholder-shown)]:text-[11px]">
                    Nombre Completo
                  </label>
                </div>
                <div className="relative group">
                  <input 
                    name="ruc"
                    type="text" 
                    id="ruc" 
                    maxLength={11}
                    className="w-full bg-transparent border-b-2 border-gray-100 py-4 outline-none focus:border-red-600 transition-colors peer text-xl font-semibold text-black" 
                    placeholder=" " 
                  />
                  <label htmlFor="ruc" className="absolute left-0 top-4 text-gray-400 font-bold uppercase text-xs tracking-widest pointer-events-none transition-all peer-focus:-top-8 peer-focus:text-red-600 peer-focus:text-[11px] peer-[:not(:placeholder-shown)]:-top-8 peer-[:not(:placeholder-shown)]:text-[11px]">
                    RUC (Empresas)
                  </label>
                </div>
              </div>

              {/* Fila 2: Email y Teléfono */}
              <div className="grid md:grid-cols-2 gap-12">
                <div className="relative group">
                  <input 
                    name="email"
                    type="email" 
                    id="email" 
                    required 
                    className="w-full bg-transparent border-b-2 border-gray-100 py-4 outline-none focus:border-red-600 transition-colors peer text-xl font-semibold text-black" 
                    placeholder=" " 
                  />
                  <label htmlFor="email" className="absolute left-0 top-4 text-gray-400 font-bold uppercase text-xs tracking-widest pointer-events-none transition-all peer-focus:-top-8 peer-focus:text-red-600 peer-focus:text-[11px] peer-[:not(:placeholder-shown)]:-top-8 peer-[:not(:placeholder-shown)]:text-[11px]">
                    Email Corporativo
                  </label>
                </div>
                <div className="relative group">
                  <input 
                    name="phone"
                    type="tel" 
                    id="phone" 
                    required 
                    className="w-full bg-transparent border-b-2 border-gray-100 py-4 outline-none focus:border-red-600 transition-colors peer text-xl font-semibold text-black" 
                    placeholder=" " 
                  />
                  <label htmlFor="phone" className="absolute left-0 top-4 text-gray-400 font-bold uppercase text-xs tracking-widest pointer-events-none transition-all peer-focus:-top-8 peer-focus:text-red-600 peer-focus:text-[11px] peer-[:not(:placeholder-shown)]:-top-8 peer-[:not(:placeholder-shown)]:text-[11px]">
                    Teléfono / WhatsApp
                  </label>
                </div>
              </div>

              {/* Fila 3: Modelo */}
              <div className="relative group">
                <input 
                  name="model"
                  type="text" 
                  id="model" 
                  required
                  className="w-full bg-transparent border-b-2 border-gray-100 py-4 outline-none focus:border-red-600 transition-colors peer text-xl font-semibold text-black" 
                  placeholder=" " 
                />
                <label htmlFor="model" className="absolute left-0 top-4 text-gray-400 font-bold uppercase text-xs tracking-widest pointer-events-none transition-all peer-focus:-top-8 peer-focus:text-red-600 peer-focus:text-[11px] peer-[:not(:placeholder-shown)]:-top-8 peer-[:not(:placeholder-shown)]:text-[11px]">
                  Modelo de Interés
                </label>
              </div>

              {/* Fila 4: Mensaje */}
              <div className="relative group">
                <textarea 
                  name="message"
                  id="message" 
                  rows={1} 
                  className="w-full bg-transparent border-b-2 border-gray-100 py-4 outline-none focus:border-red-600 transition-colors peer resize-none text-xl font-semibold text-black" 
                  placeholder=" "
                ></textarea>
                <label htmlFor="message" className="absolute left-0 top-4 text-gray-400 font-bold uppercase text-xs tracking-widest pointer-events-none transition-all peer-focus:-top-8 peer-focus:text-red-600 peer-focus:text-[11px] peer-[:not(:placeholder-shown)]:-top-8 peer-[:not(:placeholder-shown)]:text-[11px]">
                  Mensaje
                </label>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  disabled={status === 'loading'}
                  type="submit" 
                  className="group flex items-center gap-8 text-[13px] font-black uppercase tracking-[0.5em] text-black hover:text-red-600 transition-all disabled:opacity-50"
                >
                  {status === 'loading' ? 'Enviando...' : 'Enviar Solicitud'}
                  <div className="w-20 h-20 rounded-full border-2 border-black flex items-center justify-center group-hover:border-red-600 group-hover:bg-red-600 transition-all duration-500 shadow-xl">
                    {status === 'loading' ? (
                      <Loader2 className="animate-spin text-red-600 group-hover:text-white" size={32} />
                    ) : (
                      <ArrowRight size={32} strokeWidth={2} className="text-black group-hover:text-white transition-colors" />
                    )}
                  </div>
                </button>

                {status === 'success' && (
                  <p className="text-green-600 font-bold uppercase text-xs tracking-widest animate-pulse">
                    ¡Cotización enviada con éxito!
                  </p>
                )}
                {status === 'error' && (
                  <p className="text-red-600 font-bold uppercase text-xs tracking-widest">
                    {errorMessage}
                  </p>
                )}
              </div>
            </form> */}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
