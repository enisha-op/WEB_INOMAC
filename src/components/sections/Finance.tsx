/*
'use client'
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const financeOptions = [
  { 
    title: "Inomac Leasing", 
    desc: "Optimice su flujo de caja con beneficios fiscales significativos. Ideal para flotas corporativas que buscan renovar equipos constantemente sin afectar su capital de trabajo.",
    link: "https://wa.me/5190000000?text=Hola, deseo información sobre Leasing"
  },
  { 
    title: "Crédito Directo", 
    desc: "Financiamiento tradicional con plazos de hasta 60 meses. Tasas competitivas y evaluación rápida para que su camión SinoTruk empiece a trabajar de inmediato.",
    link: "https://wa.me/51900000000?text=Hola, deseo información sobre Crédito Directo"
  },
  { 
    title: "Seguro de Flota", 
    desc: "Protección integral diseñada para carga pesada nacional. Cobertura contra accidentes, robo y asistencia especializada para transportistas en toda la red nacional.",
    link: "https://wa.me/51900000000?text=Hola, deseo información sobre Seguros"
  },
];

export const Finance = () => {
  return (
    <section id="financiamiento" className="py-24 bg-white text-black transition-colors duration-500">
      <div className="max-w-[1400px] mx-auto px-8">
        
        <div className="mb-24">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-red-600 font-bold tracking-[0.5em] uppercase text-[12px] mb-4 block">
              Opciones de Financiamiento
            </span>
            <h2 className="text-5xl md:text-7xl font-light uppercase tracking-tighter">
              PLANES DE <span className="font-black italic text-red-600">ADQUISICIÓN</span>
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-gray-100">
          {financeOptions.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`group pt-16 pb-20 px-8 border-b md:border-b-0 md:border-r border-gray-100 last:border-r-0 relative transition-all duration-500 hover:bg-gray-50 ${i === 0 ? 'md:pl-0' : ''}`}
            >
              <div className="flex justify-between items-start mb-10">
                <h4 className="text-3xl font-bold uppercase tracking-tight group-hover:text-red-600 transition-colors leading-none">
                  {item.title}
                </h4>
                <ArrowUpRight size={28} className="text-red-600 opacity-40 group-hover:opacity-100 transition-all" />
              </div>

              <p className="text-gray-600 text-lg font-medium leading-relaxed mb-12 min-h-[120px]">
                {item.desc}
              </p>

              <a 
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-[12px] font-black uppercase tracking-[0.3em] bg-red-600 text-white px-8 py-4 rounded-sm hover:bg-black transition-all shadow-lg"
              >
                Solicitar Asesoría
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-24 p-16 bg-gray-50 border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-10 transition-colors duration-500 rounded-sm shadow-xl"
        >
          <p className="text-2xl md:text-3xl font-light uppercase tracking-tight text-center md:text-left max-w-xl text-black">
            ¿Busca un plan a la <span className="font-bold italic text-red-600 text-3xl md:text-4xl">medida</span> de su flota comercial?
          </p>
          
          <a 
            href="#contacto"
            className="w-full md:w-auto bg-red-600 text-white px-12 py-6 font-black uppercase text-[12px] tracking-[0.4em] hover:bg-black hover:scale-105 transition-all shadow-xl text-center flex items-center justify-center"
          >
            Hablar con un experto
          </a>
        </motion.div>
      </div>
    </section>
  );
};
*/
