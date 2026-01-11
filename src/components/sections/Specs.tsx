'use client'
import { motion } from "framer-motion";

const technicalSpecs = [
  { label: "Potencia Máxima", value: "800 HP (597 kW)" },
  { label: "Torque", value: "3,500 Nm @ 1,000-1,400 rpm" },
  { label: "Transmisión", value: "Automatizada de 12 velocidades" },
  { label: "Configuración de Ejes", value: "8x4 Heavy Duty" },
  { label: "Capacidad de Carga", value: "45,000 kg" },
  { label: "Emisiones", value: "Euro VI con tecnología SCR" },
];

export const Specs = () => {
  return (
    <section className="py-32 bg-black text-white">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          
          {/* Lado Izquierdo: Título e Imagen */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-bold tracking-[0.5em] uppercase text-[10px] mb-4 block">
              Ingeniería Superior
            </span>
            <h2 className="text-4xl md:text-6xl font-light uppercase tracking-tighter mb-10">
              DATOS <span className="font-black italic text-primary">TÉCNICOS</span>
            </h2>
            <div className="aspect-video overflow-hidden bg-[#111]">
              <img 
                src="https://images.unsplash.com/photo-1592838064575-70ed626d3a44?auto=format&fit=crop&q=80&w=1200" 
                alt="Motor Detail" 
                className="w-full h-full object-cover opacity-60 hover:scale-105 transition-transform duration-1000"
              />
            </div>
            <p className="mt-8 text-white/40 text-sm font-light max-w-md leading-relaxed">
              Cada componente de un INOMAC ha sido diseñado para resistir las condiciones más extremas, garantizando una eficiencia de combustible inigualable en el sector.
            </p>
          </motion.div>

          {/* Lado Derecho: La Tabla "Luxury" */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col"
          >
            <div className="border-t border-white/20">
              {technicalSpecs.map((spec, index) => (
                <div 
                  key={index}
                  className="flex justify-between items-center py-6 border-b border-white/10 group hover:bg-white/[0.02] transition-colors px-4"
                >
                  <span className="text-white/50 text-[11px] font-bold uppercase tracking-[0.2em]">
                    {spec.label}
                  </span>
                  <span className="text-xl font-light tracking-tight group-hover:text-primary transition-colors">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Botón de Descarga Ficha Técnica */}
            <button className="mt-12 self-start text-[10px] font-bold uppercase tracking-[0.3em] bg-white text-black px-10 py-5 hover:bg-primary hover:text-white transition-all duration-500">
              Descargar Ficha Técnica (PDF)
            </button>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};