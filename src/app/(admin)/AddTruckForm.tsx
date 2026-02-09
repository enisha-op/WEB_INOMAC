'use client'
import { useState } from "react";
import { Save, X, FileText, ImageIcon, Trash2, AlertCircle } from "lucide-react";

interface AddTruckFormProps {
  onSuccess: () => void;
  initialData?: any;
}

export default function AddTruckForm({ onSuccess, initialData }: AddTruckFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [previewImage, setPreviewImage] = useState<string | null>(
    initialData?.img || null
  );
  const [pdfName, setPdfName] = useState<string | null>(
    initialData?.pdf ? "Ficha Actual Guardada" : null
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("La imagen no debe superar los 2MB");
        return;
      }
      setPreviewImage(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPdfName(file.name);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const url = initialData 
      ? `${API_URL}/admin/trucks/${initialData.id}` 
      : `${API_URL}/admin/trucks`;
    
    try {
      const resp = await fetch(url, { 
        method: initialData ? 'PUT' : 'POST', 
        body: formData 
      });
      if (!resp.ok) throw new Error("Error en el servidor");
      onSuccess();
    } catch (err) {
      setError("No se pudo guardar la unidad. Verifica la conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[var(--card-bg)] p-6 md:p-10 border border-theme space-y-6 md:space-y-8 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar rounded-sm">
      
      {/* HEADER RESPONSIVE */}
      <div className="flex justify-between items-center sticky -top-6 md:-top-10 bg-[var(--card-bg)] z-10 pb-4 border-b border-theme mb-4">
        <h2 className="text-lg md:text-2xl font-black uppercase italic text-primary leading-tight">
          {initialData ? 'Actualizar Unidad' : 'Nuevo Camión'}
        </h2>
        <button type="button" onClick={onSuccess} className="text-muted-theme hover:text-primary transition-colors p-2">
          <X className="w-6 h-6 md:w-7 md:h-7" />
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 p-4 flex items-center gap-3 text-red-500 text-[10px] md:text-xs font-bold uppercase">
          <AlertCircle className="w-5 h-5 shrink-0" /> {error}
        </div>
      )}
      
      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        
        {/* COLUMNA TÉCNICA */}
        <div className="space-y-6">
          <div className="grid gap-4">
            <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary">Especificaciones Base</label>
            <input name="name" defaultValue={initialData?.name} placeholder="NOMBRE COMERCIAL" required className="w-full bg-theme border border-theme p-4 text-[11px] font-bold uppercase outline-none focus:border-primary transition-all" />
            <input name="price" defaultValue={initialData?.price} type="number" placeholder="PRECIO DE LISTA ($)" required className="w-full bg-theme border border-theme p-4 text-[11px] font-bold uppercase outline-none focus:border-primary transition-all" />
            <input name="short_specs" defaultValue={initialData?.specs} placeholder="RESUMEN (EJ: 530HP | 6X4)" className="w-full bg-theme border border-theme p-4 text-[11px] font-bold uppercase outline-none focus:border-primary transition-all" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="motor" defaultValue={initialData?.details?.motor} placeholder="MOTOR" className="bg-theme border border-theme p-4 text-[10px] font-bold uppercase w-full" />
            <input name="torque" defaultValue={initialData?.details?.torque} placeholder="TORQUE" className="bg-theme border border-theme p-4 text-[10px] font-bold uppercase w-full" />
            <input name="transmission" defaultValue={initialData?.details?.transmision} placeholder="TRANSMISIÓN" className="bg-theme border border-theme p-4 text-[10px] font-bold uppercase w-full" />
            <input name="traction" defaultValue={initialData?.details?.traccion} placeholder="TRACCIÓN" className="bg-theme border border-theme p-4 text-[10px] font-bold uppercase w-full" />
          </div>
        </div>
        
        {/* COLUMNA MULTIMEDIA */}
        <div className="space-y-6 md:space-y-8">
          <div className="space-y-4">
            <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary">Galería y Ficha</label>
            
            {/* DROPZONE IMAGEN */}
            <div className="relative group border-2 border-dashed border-theme p-6 flex flex-col items-center justify-center min-h-[160px] md:min-h-[200px] bg-black/30 hover:border-primary/50 transition-all cursor-pointer">
              {previewImage ? (
                <div className="w-full text-center">
                  <img src={previewImage} alt="Preview" className="max-h-24 md:max-h-32 mx-auto mb-4 object-contain shadow-2xl" />
                  <p className="text-[8px] md:text-[9px] font-bold text-primary italic">Tap para cambiar foto</p>
                </div>
              ) : (
                <div className="text-center opacity-30 group-hover:opacity-100 transition-opacity">
                  <ImageIcon className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-2" />
                  <p className="text-[9px] font-bold italic uppercase">Subir Foto Frontal</p>
                </div>
              )}
              <input type="file" name="image_front" onChange={handleImageChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>

            {/* SELECTOR PDF */}
            <div className="relative border border-theme p-4 md:p-5 bg-black/30 flex items-center gap-3 md:gap-4 group hover:border-primary/50 transition-all">
              <div className="bg-primary/10 p-2 md:p-3 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <FileText className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="flex-grow overflow-hidden">
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-tighter truncate">
                  {pdfName || "ADJUNTAR FICHA (PDF)"}
                </p>
                <p className="text-[7px] md:text-[8px] text-muted-theme">MÁXIMO 5MB</p>
              </div>
              <input type="file" name="pdf_file" onChange={handlePdfChange} accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

      {/* BOTÓN DE ACCIÓN */}
      <div className="pt-4 border-t border-theme">
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-4 md:py-6 font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-[10px] md:text-xs hover:bg-red-700 transition-all shadow-2xl flex items-center justify-center gap-3"
        >
          <Save className="w-4 h-4 md:w-5 md:h-5" />
          {loading ? "SINCRONIZANDO..." : "GUARDAR EN SISTEMA"}
        </button>
      </div>
    </form>
  );
}