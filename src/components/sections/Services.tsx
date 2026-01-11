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
    <section id="servicios" className="py-32 bg-[#0a0a0a] text-white">
      <div className="max-w-[1400px] mx-auto px-8">
        
        {/* Cabecera */}
        <div className="mb-24 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-bold tracking-[0.5em] uppercase text-[10px] mb-4 block">
              Beyond the Drive
            </span>
            <h2 className="text-4xl md:text-6xl font-light uppercase tracking-tighter">
              SERVICIOS DE <span className="font-black italic text-primary">POSVENTA</span>
            </h2>
          </motion.div>
        </div>

        {/* Grid de Servicios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-black p-12 hover:bg-[#111] transition-colors duration-500 group"
            >
              <service.icon 
                size={32} 
                strokeWidth={1} 
                className="text-primary mb-8 group-hover:scale-110 transition-transform duration-500" 
              />
              <h4 className="text-lg font-light uppercase tracking-widest mb-6 group-hover:text-primary transition-colors">
                {service.title}
              </h4>
              <p className="text-white/40 text-xs font-light leading-relaxed tracking-wide">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Link Sutil inferior */}
        <div className="mt-16 text-center">
          <p className="text-white/20 text-[10px] font-bold tracking-[0.3em] uppercase">
            Excelencia certificada por ingenieros de INOMAC
          </p>
        </div>
      </div>
    </section>
  );
};