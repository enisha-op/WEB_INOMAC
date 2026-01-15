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
    <section id="servicios" className="py-24 bg-white text-black transition-colors duration-500">
      <div className="max-w-[1400px] mx-auto px-8">
        
        {/* Cabecera Editorial */}
        <div className="mb-24 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-red-600 font-bold tracking-[0.5em] uppercase text-[12px] mb-4 block">
              Beyond the Drive
            </span>
            <h2 className="text-5xl md:text-7xl font-light uppercase tracking-tighter leading-tight">
              SERVICIOS DE <span className="font-black italic text-red-600">POSVENTA</span>
            </h2>
          </motion.div>
        </div>

        {/* Grid Técnico */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100 border border-gray-100 group/grid shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              viewport={{ once: true }}
              // CAMBIOS: Se añadió items-center y text-center para centrar iconos y textos
              className="bg-white p-12 hover:bg-gray-50 transition-all duration-500 group/card min-h-[400px] flex flex-col items-center text-center"
            >
              {/* Icono en Rojo centrado */}
              <service.icon 
                size={48} 
                strokeWidth={1.5} 
                className="text-red-600 mb-10 group-hover/card:scale-110 group-hover/card:rotate-3 transition-transform duration-500" 
              />
              
              {/* Título centrado */}
              <h4 className="text-2xl font-bold uppercase tracking-tight mb-6 group-hover/card:text-red-600 transition-colors leading-tight">
                {service.title}
              </h4>
              
              {/* Descripción centrada */}
              <p className="text-gray-600 text-base font-medium leading-relaxed">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Marcado de Certificación */}
        <div className="mt-20 text-center">
          <div className="h-1 w-24 bg-red-600 mx-auto mt-4 shadow-[0_0_15px_rgba(220,38,38,0.3)]" />
        </div>
      </div>
    </section>
  );
};