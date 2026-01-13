'use client'
import { motion } from "framer-motion";
import { Wrench, ShieldCheck, Zap, Globe } from "lucide-react";

const services = [
  {
    icon: Wrench,
    title: "Mantenimiento Preventivo",
    desc: "Programas de servicio técnico especializado con repuestos originales para maximizar la vida útil de su flota."
  },
  {
    icon: ShieldCheck,
    title: "Garantía Extendida",
    desc: "Protección integral que cubre componentes críticos del tren motriz, brindando seguridad en cada kilómetro."
  },
  {
    icon: Zap,
    title: "Asistencia en Ruta",
    desc: "Soporte técnico de emergencia las 24 horas, los 7 días de la semana, en cualquier punto del territorio nacional."
  },
  {
    icon: Globe,
    title: "Telemetría Avanzada",
    desc: "Sistemas de monitoreo en tiempo real para optimizar el consumo de combustible y la eficiencia operativa."
  }
];

export const Services = () => {
  return (
    <section id="servicios" className="py-24 bg-theme text-theme transition-colors duration-500">
      <div className="max-w-[1400px] mx-auto px-8">
        
        {/* Cabecera Editorial */}
        <div className="mb-24 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-bold tracking-[0.5em] uppercase text-[12px] mb-4 block">
              Beyond the Drive
            </span>
            <h2 className="text-5xl md:text-7xl font-light uppercase tracking-tighter">
              SERVICIOS DE <span className="font-black italic text-primary">POSVENTA</span>
            </h2>
          </motion.div>
        </div>

        {/* Grid Técnico */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-theme border border-theme group/grid shadow-2xl">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-theme p-12 hover:bg-primary/[0.04] dark:hover:bg-primary/[0.08] transition-all duration-500 group/card min-h-[400px] flex flex-col"
            >
              {/* Icono más grande y grueso */}
              <service.icon 
                size={48} 
                strokeWidth={1.5} 
                className="text-primary mb-10 group-hover/card:scale-110 group-hover/card:rotate-3 transition-transform duration-500" 
              />
              
              {/* Título más grande y bold */}
              <h4 className="text-2xl font-bold uppercase tracking-tight mb-6 group-hover/card:text-primary transition-colors leading-tight">
                {service.title}
              </h4>
              
              {/* Descripción con texto base (16px) y más grueso */}
              <p className="text-theme/90 dark:text-theme/80 text-base font-medium leading-relaxed">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Marcado de Certificación */}
        <div className="mt-20 text-center">
          {/* <p className="text-theme font-bold text-[12px] tracking-[0.4em] uppercase opacity-60">
            Excelencia certificada por ingenieros de INOMAC PERÚ
          </p> */}
          <div className="h-1 w-24 bg-primary mx-auto mt-4" />
        </div>
      </div>
    </section>
  );
};