'use client'
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const financeOptions = [
  { 
    title: "Inomac Leasing", 
    desc: "Optimice su flujo de caja con beneficios fiscales significativos y cuotas adaptables al ciclo de su negocio." 
  },
  { 
    title: "Crédito Directo", 
    desc: "Financiamiento tradicional con tasas preferenciales y plazos de hasta 60 meses para la adquisición de su flota." 
  },
  { 
    title: "Seguro de Flota", 
    desc: "Protección integral diseñada específicamente para las exigencias del transporte de carga pesada nacional." 
  },
];

export const Finance = () => {
  return (
    <section id="financiamiento" className="py-32 bg-white text-black">
      <div className="max-w-[1400px] mx-auto px-8">
        
        {/* Encabezado Minimalista */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-bold tracking-[0.5em] uppercase text-[10px] mb-4 block">
              Servicios Financieros
            </span>
            <h2 className="text-4xl md:text-6xl font-light uppercase tracking-tighter">
              SOLUCIONES DE <span className="font-black italic">MOVILIDAD</span>
            </h2>
          </motion.div>
        </div>

        {/* Grid de Opciones Estilo Porsche Corregido */}
        {/* Añadimos -mx-8 al contenedor y px-8 a los hijos para un alineamiento perfecto */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-black/10">
          {financeOptions.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: i * 0.2 }}
              viewport={{ once: true }}
              /* CAMBIOS AQUÍ: Añadimos px-8 (padding lateral) y md:pl-0 en la primera columna */
              className={`group pt-12 pb-20 px-8 border-b md:border-b-0 md:border-r border-black/10 last:border-r-0 relative ${i === 0 ? 'md:pl-0' : ''}`}
            >
              <div className="flex justify-between items-start mb-12">
                <h4 className="text-2xl font-light uppercase tracking-tight group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h4>
                <Plus size={20} className="text-black/20 group-hover:text-primary group-hover:rotate-90 transition-all duration-500" />
              </div>
              
              <p className="text-black/60 text-sm font-light leading-relaxed mb-10 max-w-[280px]">
                {item.desc}
              </p>

              <button className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-primary hover:border-primary transition-all duration-300">
                Saber más
              </button>
            </motion.div>
          ))}
        </div>

        {/* Banner Inferior Sutil */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 p-12 bg-black text-white flex flex-col md:flex-row justify-between items-center gap-8"
        >
          <p className="text-xl font-light uppercase tracking-tight">
            ¿Necesita una <span className="font-bold italic">cotización personalizada</span> para su flota?
          </p>
          <button className="bg-primary text-white px-10 py-4 font-bold uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all duration-500">
            Contactar Asesor
          </button>
        </motion.div>
      </div>
    </section>
  );
};