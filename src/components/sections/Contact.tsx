'use client'
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const Contact = () => {
  return (
    // bg-white puro para una estética limpia y editorial
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
              SOLICITE UNA <br />
              <span className="font-black italic text-red-600">ASESORÍA</span>
            </h2>
            
            <p className="text-gray-700 font-medium leading-relaxed max-w-md mb-12 italic text-xl">
              Permítanos ayudarle a configurar la solución de transporte perfecta para su negocio. Un consultor especializado de INOMAC se pondrá en contacto con usted en las próximas 24 horas.
            </p>
            
            <div className="space-y-6">
              <p className="text-[12px] font-bold tracking-[0.3em] uppercase text-gray-400">Línea Directa</p>
              <p className="text-4xl font-bold tracking-tighter text-black">+51 900 000 000</p>
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
            <form className="space-y-16">
              <div className="grid md:grid-cols-2 gap-16">
                <div className="relative group">
                  <input 
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
              </div>

              <div className="relative group">
                <input 
                  type="text" 
                  id="model" 
                  className="w-full bg-transparent border-b-2 border-gray-100 py-4 outline-none focus:border-red-600 transition-colors peer text-xl font-semibold text-black" 
                  placeholder=" " 
                />
                <label htmlFor="model" className="absolute left-0 top-4 text-gray-400 font-bold uppercase text-xs tracking-widest pointer-events-none transition-all peer-focus:-top-8 peer-focus:text-red-600 peer-focus:text-[11px] peer-[:not(:placeholder-shown)]:-top-8 peer-[:not(:placeholder-shown)]:text-[11px]">
                  Modelo de Interés
                </label>
              </div>

              <div className="relative group">
                <textarea 
                  id="message" 
                  rows={1} 
                  className="w-full bg-transparent border-b-2 border-gray-100 py-4 outline-none focus:border-red-600 transition-colors peer resize-none text-xl font-semibold text-black" 
                  placeholder=" "
                ></textarea>
                <label htmlFor="message" className="absolute left-0 top-4 text-gray-400 font-bold uppercase text-xs tracking-widest pointer-events-none transition-all peer-focus:-top-8 peer-focus:text-red-600 peer-focus:text-[11px] peer-[:not(:placeholder-shown)]:-top-8 peer-[:not(:placeholder-shown)]:text-[11px]">
                  Mensaje
                </label>
              </div>

              <button type="submit" className="group flex items-center gap-8 text-[13px] font-black uppercase tracking-[0.5em] text-black hover:text-red-600 transition-all">
                Enviar Solicitud
                <div className="w-20 h-20 rounded-full border-2 border-black flex items-center justify-center group-hover:border-red-600 group-hover:bg-red-600 transition-all duration-500 shadow-xl">
                  <ArrowRight size={32} strokeWidth={2} className="text-black group-hover:text-white transition-colors" />
                </div>
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};