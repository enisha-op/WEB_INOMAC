'use client'
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, Check, Trash2, AlertCircle } from "lucide-react";
import 'react-phone-number-input/style.css'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'

export const Contact = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");
  const [availableTrucks, setAvailableTrucks] = useState<any[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();

  // URL base desde las variables de entorno (.env)
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        // Petición al backend en Railway
        const response = await fetch(`${API_URL}/admin/trucks`);
        const data = await response.json();
        setAvailableTrucks(data);
      } catch (error) {
        console.error("Error cargando modelos desde el servidor remoto:", error);
      }
    };
    if (API_URL) fetchTrucks();
  }, [API_URL]);

  const toggleModel = (modelName: string) => {
    setSelectedModels(prev => 
      prev.includes(modelName) ? prev.filter(m => m !== modelName) : [...prev, modelName]
    );
  };

  const clearSelection = () => setSelectedModels([]);

  const isFormValid = phoneNumber && isValidPhoneNumber(phoneNumber) && selectedModels.length > 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;

    setStatus('loading');
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: phoneNumber, 
      ruc: formData.get('ruc'),
      model: selectedModels.join(", "),
      message: formData.get('message'),
    };

    try {
      // Envío de la cotización a la API de Railway
      const response = await fetch(`${API_URL}/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus('success');
        setSelectedModels([]);
        setPhoneNumber(undefined);
        (e.target as HTMLFormElement).reset();
        // Opcional: Ocultar mensaje de éxito tras unos segundos
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        const errorData = await response.json();
        setStatus('error');
        setErrorMessage(errorData.error || "Error al procesar la solicitud en el servidor");
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage("No se pudo conectar con el servidor de INOMAC");
    }
  };

  return (
    <section id="contacto" className="py-32 bg-white text-black">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-24 items-start">
          
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}>
            <span className="text-red-600 font-bold tracking-[0.5em] uppercase text-[12px] mb-6 block">Personal Concierge</span>
            <h2 className="text-5xl md:text-7xl font-light uppercase tracking-tighter mb-10 leading-none">
              SOLICITE UNA <br />
              <span className="font-black italic text-red-600">ASESORÍA</span>
            </h2>
            <p className="text-gray-700 font-medium leading-relaxed max-w-md mb-12 italic text-xl">
              Complete los datos de su empresa para configurar una propuesta personalizada.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-10">
              
              <div className="grid md:grid-cols-2 gap-10">
                <div className="relative group">
                  <input name="name" type="text" required className="w-full bg-transparent border-b-2 border-gray-100 py-4 outline-none focus:border-red-600 transition-colors peer text-lg font-bold uppercase" placeholder=" " />
                  <label className="absolute left-0 top-4 text-gray-400 font-bold uppercase text-[10px] tracking-widest transition-all peer-focus:-top-6 peer-focus:text-red-600 peer-[:not(:placeholder-shown)]:-top-6">Razón Social / Nombre</label>
                </div>
                <div className="relative group">
                  <input name="ruc" type="text" className="w-full bg-transparent border-b-2 border-gray-100 py-4 outline-none focus:border-red-600 transition-colors peer text-lg font-bold uppercase" placeholder=" " />
                  <label className="absolute left-0 top-4 text-gray-400 font-bold uppercase text-[10px] tracking-widest transition-all peer-focus:-top-6 peer-focus:text-red-600 peer-[:not(:placeholder-shown)]:-top-6">RUC / DNI</label>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="relative group">
                  <input name="email" type="email" required className="w-full bg-transparent border-b-2 border-gray-100 py-4 outline-none focus:border-red-600 transition-colors peer text-lg font-bold uppercase" placeholder=" " />
                  <label className="absolute left-0 top-4 text-gray-400 font-bold uppercase text-[10px] tracking-widest transition-all peer-focus:-top-6 peer-focus:text-red-600 peer-[:not(:placeholder-shown)]:-top-6">Correo Electrónico</label>
                </div>
                
                <div className="relative border-b-2 border-gray-100 focus-within:border-red-600 transition-colors">
                  <label className="absolute -top-6 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                    WhatsApp {phoneNumber && !isValidPhoneNumber(phoneNumber) && <span className="text-red-600 font-black italic ml-2">Inválido</span>}
                  </label>
                  <PhoneInput
                    international
                    defaultCountry="PE"
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    className="custom-phone-input py-4 text-lg font-bold"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <label className="text-red-600 font-black uppercase text-[11px] tracking-[0.2em]">Modelos de Interés ({selectedModels.length})</label>
                  {selectedModels.length > 0 && (
                    <button type="button" onClick={clearSelection} className="text-[9px] font-bold uppercase text-gray-400 hover:text-red-600 flex items-center gap-2 transition-colors">
                      <Trash2 size={12} /> Limpiar Selección
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar border-y border-gray-50 py-4">
                  {availableTrucks.map((truck) => (
                    <div key={truck.id} onClick={() => toggleModel(truck.name)} className={`relative cursor-pointer border-2 transition-all p-4 rounded-sm flex flex-col items-center gap-3 group ${selectedModels.includes(truck.name) ? "border-red-600 bg-red-50/50" : "border-gray-100 hover:border-gray-200 bg-gray-50/30"}`}>
                      <AnimatePresence>
                        {selectedModels.includes(truck.name) && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 z-10 shadow-lg"><Check size={10} strokeWidth={4} /></motion.div>
                        )}
                      </AnimatePresence>
                      <div className="w-full aspect-video overflow-hidden">
                        {/* NOTA: No concatenamos localhost, usamos la URL de Cloudinary del backend */}
                        <img src={truck.img} className={`w-full h-full object-contain transition-transform duration-500 ${selectedModels.includes(truck.name) ? "scale-110" : "grayscale opacity-40 group-hover:opacity-100"}`} alt={truck.name} />
                      </div>
                      <span className={`text-[9px] font-black uppercase text-center leading-tight ${selectedModels.includes(truck.name) ? "text-red-600" : "text-gray-400"}`}>{truck.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative group">
                <textarea name="message" rows={1} className="w-full bg-transparent border-b-2 border-gray-100 py-4 outline-none focus:border-red-600 transition-colors peer resize-none text-lg font-bold" placeholder=" "></textarea>
                <label className="absolute left-0 top-4 text-gray-400 font-bold uppercase text-[10px] tracking-widest transition-all peer-focus:-top-6 peer-focus:text-red-600 peer-[:not(:placeholder-shown)]:-top-6">Mensaje Adicional</label>
              </div>

              <div className="flex flex-col gap-6">
                <button disabled={status === 'loading' || !isFormValid} type="submit" className={`group flex items-center gap-8 text-[14px] font-black uppercase tracking-[0.5em] transition-all ${isFormValid ? "text-black hover:text-red-600" : "text-gray-300 cursor-not-allowed"}`}>
                  {status === 'loading' ? 'Enviando...' : 'Enviar Solicitud'}
                  <div className={`w-20 h-20 rounded-full border-2 flex items-center justify-center transition-all duration-500 shadow-2xl ${isFormValid ? "border-black group-hover:border-red-600 group-hover:bg-red-600 shadow-red-900/10" : "border-gray-200 grayscale shadow-none"}`}>
                    {status === 'loading' ? <Loader2 className="animate-spin text-red-600" size={32} /> : <ArrowRight size={32} className={isFormValid ? "group-hover:text-white" : ""} />}
                  </div>
                </button>
                {status === 'success' && <div className="bg-green-50 text-green-600 p-4 border-l-4 border-green-600 font-bold uppercase text-[10px] tracking-widest text-center">Solicitud recibida correctamente. Nos contactaremos pronto.</div>}
                {status === 'error' && <div className="bg-red-50 text-red-600 p-4 border-l-4 border-red-600 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2"><AlertCircle size={14}/> {errorMessage}</div>}
              </div>
            </form>    */}
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        .custom-phone-input { display: flex; align-items: center; }
        .custom-phone-input .PhoneInputInput { background: transparent; border: none; outline: none; font-weight: 900; font-size: 1.125rem; color: black; text-transform: uppercase; width: 100%; padding-left: 10px; }
        .custom-phone-input .PhoneInputCountry { margin-right: 10px; }
        .custom-phone-input .PhoneInputCountrySelectArrow { color: #e60000; opacity: 1; }
      `}</style>
    </section>
  );
};
