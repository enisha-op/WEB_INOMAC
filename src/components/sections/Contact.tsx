'use client'
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const Contact = () => {
  return (
    <section id="contacto" className="py-32 bg-black text-white">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-24">
          
          {/* Lado Izquierdo: Texto Editorial */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-bold tracking-[0.5em] uppercase text-[10px] mb-4 block">
              Personal Concierge
            </span>
            <h2 className="text-4xl md:text-6xl font-light uppercase tracking-tighter mb-8">
              SOLICITE UNA <br />
              <span className="font-black italic text-primary">ASESORÍA</span>
            </h2>
            <p className="text-white/50 font-light leading-relaxed max-w-md mb-12">
              Permítanos ayudarle a configurar la solución de transporte perfecta para su negocio. Un consultor especializado de INOMAC se pondrá en contacto con usted en las próximas 24 horas.
            </p>
            
            <div className="space-y-4">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30">Línea Directa</p>
              <p className="text-2xl font-light">+51 900 000 000</p>
              <div className="h-[1px] w-12 bg-primary" />
            </div>
          </motion.div>

          {/* Lado Derecho: Formulario Minimalista */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <form className="space-y-12">
              <div className="grid md:grid-cols-2 gap-12">
                <div className="relative group">
                  <input type="text" id="name" required className="w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-primary transition-colors peer" placeholder=" " />
                  <label htmlFor="name" className="absolute left-0 top-3 text-white/30 uppercase text-[10px] tracking-widest pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-4">Nombre Completo</label>
                </div>
                <div className="relative group">
                  <input type="email" id="email" required className="w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-primary transition-colors peer" placeholder=" " />
                  <label htmlFor="email" className="absolute left-0 top-3 text-white/30 uppercase text-[10px] tracking-widest pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-4">Email Corporativo</label>
                </div>
              </div>

              <div className="relative group">
                <input type="text" id="model" className="w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-primary transition-colors peer" placeholder=" " />
                <label htmlFor="model" className="absolute left-0 top-3 text-white/30 uppercase text-[10px] tracking-widest pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-4">Modelo de Interés</label>
              </div>

              <div className="relative group">
                <textarea id="message" rows={1} className="w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-primary transition-colors peer resize-none" placeholder=" "></textarea>
                <label htmlFor="message" className="absolute left-0 top-3 text-white/30 uppercase text-[10px] tracking-widest pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-4">Mensaje</label>
              </div>

              <button className="group flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-white hover:text-primary transition-colors">
                Enviar Solicitud
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-primary group-hover:bg-primary transition-all duration-500">
                  <ArrowRight size={16} className="group-hover:text-white" />
                </div>
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};