import React, { useState, useEffect } from 'react';
import { AlertTriangle, Calendar as CalendarIcon, CheckCircle2, ChevronDown, Clock, MapPin, Users } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

interface ReservasProps {
  onBack: () => void;
  initialEventInfo?: string;
}

const SECTORS = [
  { id: 'terraza', label: 'TERRAZA', badge: 'ABIERTA', desc: 'Al aire libre. Ideal para noches frescas.' },
  { id: 'salon', label: 'SALÓN CLIMATIZADO', badge: 'CLIMATIZADO', desc: 'Interior con música y aire.' },
  { id: 'barra', label: 'BARRA', badge: 'CERCA DEL BARMAN', desc: 'Acción de cerca. Ideal para pocos.' }
];

const OCASIONES = [
  'Sin ocasión especial',
  'Cumpleaños',
  'Reunión'
];

export const Reservas: React.FC<ReservasProps> = ({ onBack, initialEventInfo }) => {
  const { addReserva } = useCMS();
  const [formData, setFormData] = useState({
    nombre: '',
    whatsapp: '',
    sector: '',
    fecha: '',
    hora: '',
    personas: 2,
    ocasion: 'Sin ocasión especial',
    comentarios: initialEventInfo ? `Reserva para el evento: ${initialEventInfo}` : ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  
  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // Determine slots based on sector
    if (formData.sector === 'terraza') {
      setAvailableSlots(['19:00', '20:00', '21:00', '22:00', '23:00', '00:00']);
    } else if (formData.sector === 'salon') {
      setAvailableSlots(['19:00', '20:00', '21:00', '22:00', '23:00']);
    } else if (formData.sector === 'barra') {
      setAvailableSlots(['21:00', '22:00', '23:00', '00:00', '01:00', '02:00']);
    } else {
      setAvailableSlots([]);
    }
    // Deselect time if it's not available in new sector
    if (formData.hora && !availableSlots.includes(formData.hora)) {
      setFormData(prev => ({ ...prev, hora: '' }));
    }
  }, [formData.sector]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'Che, necesitamos tu nombre para la reserva.';
    if (!formData.whatsapp.trim()) newErrors.whatsapp = 'Falta tu número de WhatsApp.';
    else if (!/^[0-9+ ]{8,15}$/.test(formData.whatsapp.trim())) newErrors.whatsapp = 'Tirame un número válido (ej: +5493512345678).';
    if (!formData.sector) newErrors.sector = 'Elegí un sector.';
    if (!formData.fecha) newErrors.fecha = 'Dinos qué día venís.';
    if (!formData.hora) newErrors.hora = 'Elegí a qué hora llegás.';
    if (formData.personas < 1 || formData.personas > 12) newErrors.personas = 'Aceptamos reservas de 1 a 12 personas.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user changes field
    if (errors[field]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      addReserva({
        nombre: formData.nombre,
        email: '', // Podríamos agregar el campo pero no es necesario por ahora, dejamos empty o mock
        whatsapp: formData.whatsapp,
        fecha: formData.fecha,
        hora: formData.hora,
        personas: formData.personas,
        sector: formData.sector,
        ocasion: formData.ocasion,
        comentarios: formData.comentarios
      });
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isSubmitted) {
    return (
      <section className="min-h-[85vh] bg-[#F5F5DC] flex items-center justify-center py-24 px-6 lg:pl-20 xl:pl-28 lg:pr-12 border-b-8 border-[#02301E]">
        <div className="max-w-2xl w-full bg-[#E2725B] p-8 md:p-12 border-heavy brutalist-shadow-terracotta text-center transform -rotate-1 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 opacity-10">
            <CheckCircle2 size={200} className="text-[#02301E]" />
          </div>
          <CheckCircle2 size={80} className="text-[#02301E] mx-auto mb-6" />
          <h2 className="font-display-xl text-5xl md:text-6xl font-black uppercase text-[#F5F5DC] mb-6 tracking-tight leading-none">¡Lugar Asegurado!</h2>
          <p className="font-body-lg text-[#F5F5DC] text-[20px] mb-8 font-semibold opacity-90 border-b-2 border-[#02301E]/20 pb-8">
            Ya recibimos tu pedido de reserva, {formData.nombre.split(' ')[0]}.
          </p>
          
          <div className="bg-[#02301E] p-6 text-left border-2 border-[#02301E] mb-8 text-[#F5F5DC]">
            <h3 className="font-label-mono text-[14px] uppercase tracking-widest text-[#E2725B] font-bold mb-4">Resumen</h3>
            <ul className="space-y-3 font-label-bold font-bold uppercase">
              <li className="flex justify-between border-b border-[#F5F5DC]/20 pb-2">
                <span>Cuándo:</span>
                <span className="text-[#E2725B]">{new Date(formData.fecha).toLocaleDateString('es-AR')} a las {formData.hora} hs</span>
              </li>
              <li className="flex justify-between border-b border-[#F5F5DC]/20 pb-2">
                <span>Dónde:</span>
                <span className="text-[#E2725B]">{SECTORS.find(s => s.id === formData.sector)?.label}</span>
              </li>
              <li className="flex justify-between border-b border-[#F5F5DC]/20 pb-2">
                <span>Mesa para:</span>
                <span className="text-[#E2725B]">{formData.personas} {formData.personas === 1 ? 'persona' : 'personas'}</span>
              </li>
              {formData.ocasion !== 'Sin ocasión especial' && (
                <li className="flex justify-between border-b border-[#F5F5DC]/20 pb-2">
                  <span>Motivo:</span>
                  <span className="text-[#E2725B]">{formData.ocasion}</span>
                </li>
              )}
              {formData.comentarios && (
                <li className="flex flex-col gap-1 pb-2">
                  <span className="text-[12px] opacity-70">COMENTARIOS:</span>
                  <span className="text-[#E2725B] normal-case font-body-md italic">"{formData.comentarios}"</span>
                </li>
              )}
            </ul>
          </div>
          
          <div className="bg-[#F5F5DC] p-4 border-2 border-[#02301E] flex gap-3 text-left mb-8 shadow-[4px_4px_0px_#02301E]">
            <Users className="text-[#E2725B] shrink-0 mt-1" size={24} />
            <p className="font-body-md text-[#02301E] font-semibold">Te vamos a mandar un mensajito por WhatsApp en menos de 24 horas para confirmarte la mesa puntualmente.</p>
          </div>
          
          <button 
            onClick={onBack}
            className="w-full bg-[#02301E] text-[#F5F5DC] border-2 border-[#02301E] px-8 py-4 font-headline-md font-extrabold text-[20px] uppercase hover:-translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_#F5F5DC] transition-all"
          >
            VOLVER AL INICIO
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[85vh] bg-[#F5F5DC] py-16 md:py-24 px-6 lg:pl-20 xl:pl-28 lg:pr-12 border-b-8 border-[#02301E]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 cursor-pointer inline-flex items-center gap-2 font-label-mono font-bold text-[#E2725B] uppercase tracking-widest hover:-translate-x-2 transition-transform" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Volver
        </div>
        
        <h1 className="font-display-xl text-5xl md:text-7xl font-black uppercase text-[#02301E] mb-4 tracking-tight leading-[0.85]">
          RESERVÁ<br /><span className="text-[#E2725B]">TU LUGAR</span>
        </h1>
        <p className="font-body-lg text-[20px] font-semibold text-[#02301E] opacity-80 mb-12 max-w-2xl leading-relaxed">
          Completá tus datos y armamos la mesa. Nos manejamos por WhatsApp para confirmaciones, cero vueltas.
        </p>

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* Datos Personales */}
          <div className="bg-[#02301E] p-8 border-heavy brutalist-shadow">
            <h3 className="font-display-xl text-4xl text-[#F5F5DC] uppercase tracking-tight mb-8">QUIÉN SOS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block font-label-mono font-bold text-[#F5F5DC] uppercase mb-2">Nombre y Apellido *</label>
                <input 
                  type="text" 
                  value={formData.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  className={`w-full bg-[#F5F5DC] border-2 ${errors.nombre ? 'border-[#E2725B]' : 'border-[#02301E] focus:border-[#E2725B]'} outline-none px-4 py-3 font-body-md text-[#02301E] font-semibold`}
                  placeholder="Ej. Cheto Román"
                />
                {errors.nombre && <p className="text-[#E2725B] font-label-bold font-bold text-[12px] mt-2 uppercase">{errors.nombre}</p>}
              </div>
              <div>
                <label className="block font-label-mono font-bold text-[#F5F5DC] uppercase mb-2">Número de WhatsApp *</label>
                <input 
                  type="tel" 
                  value={formData.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  className={`w-full bg-[#F5F5DC] border-2 ${errors.whatsapp ? 'border-[#E2725B]' : 'border-[#02301E] focus:border-[#E2725B]'} outline-none px-4 py-3 font-body-md text-[#02301E] font-semibold`}
                  placeholder="+54 9 351 ..."
                />
                {errors.whatsapp && <p className="text-[#E2725B] font-label-bold font-bold text-[12px] mt-2 uppercase">{errors.whatsapp}</p>}
              </div>
            </div>
          </div>

          {/* Dónde */}
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <h3 className="font-display-xl text-5xl text-[#02301E] uppercase tracking-tight">DÓNDE</h3>
              <div className="h-1 flex-grow bg-[#E2725B]"></div>
            </div>
            {errors.sector && <p className="text-[#E2725B] font-label-bold font-bold text-[14px] uppercase bg-[#02301E] text-white inline-block px-3 py-1">{errors.sector}</p>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SECTORS.map(sec => (
                <div 
                  key={sec.id}
                  onClick={() => handleChange('sector', sec.id)}
                  className={`border-heavy p-6 cursor-pointer transition-all ${
                    formData.sector === sec.id 
                      ? 'bg-[#E2725B] border-[#02301E] -rotate-1 brutalist-shadow-terracotta relative z-10' 
                      : 'bg-[#F5F5DC] border-[#02301E] hover:bg-[#02301E] hover:text-[#F5F5DC] group'
                  }`}
                >
                  <div className="mb-4">
                    <span className={`text-[10px] font-label-mono font-black border-2 px-2 py-1 uppercase
                      ${formData.sector === sec.id ? 'bg-[#02301E] text-[#F5F5DC] border-[#02301E]' : 'border-[#02301E] bg-[#F5F5DC] text-[#02301E] group-hover:bg-[#E2725B] group-hover:border-[#E2725B] group-hover:text-[#F5F5DC]'}
                    `}>{sec.badge}</span>
                  </div>
                  <h4 className={`font-headline-md font-extrabold text-2xl uppercase leading-none mb-2 
                    ${formData.sector === sec.id ? 'text-[#F5F5DC]' : 'text-[#02301E] group-hover:text-[#F5F5DC]'}
                  `}>{sec.label}</h4>
                  <p className={`font-body-md text-[14px] font-semibold leading-snug
                    ${formData.sector === sec.id ? 'text-[#F5F5DC] opacity-90' : 'text-[#02301E] opacity-70 group-hover:text-[#F5F5DC] group-hover:opacity-80'}
                  `}>{sec.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cuándo / Cuántos */}
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <h3 className="font-display-xl text-5xl text-[#02301E] uppercase tracking-tight">CUÁNDO Y CÓMO</h3>
              <div className="h-1 flex-grow bg-[#E2725B]"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 bg-white border-2 border-[#02301E] p-8 shadow-[8px_8px_0px_#02301E]">
              {/* Fecha */}
              <div>
                <label className="flex items-center gap-2 font-label-mono font-bold text-[#02301E] uppercase mb-2">
                  <CalendarIcon size={18} /> Fecha *
                </label>
                <div className="relative">
                  <input 
                    type="date" 
                    min={today}
                    value={formData.fecha}
                    onChange={(e) => handleChange('fecha', e.target.value)}
                    className={`w-full bg-[#F5F5DC] border-2 ${errors.fecha ? 'border-[#E2725B]' : 'border-[#02301E]'} outline-none px-4 py-3 font-body-md text-[#02301E] font-bold uppercase appearance-none`}
                  />
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#02301E]" size={20} />
                </div>
                {errors.fecha && <p className="text-[#E2725B] font-label-bold font-bold text-[12px] mt-2 uppercase">{errors.fecha}</p>}
              </div>

              {/* Hora */}
              <div>
                <label className="flex items-center gap-2 font-label-mono font-bold text-[#02301E] uppercase mb-2">
                  <Clock size={18} /> Hora *
                </label>
                <div className="relative">
                  <select 
                    value={formData.hora}
                    onChange={(e) => handleChange('hora', e.target.value)}
                    disabled={!formData.sector}
                    className={`w-full bg-[#F5F5DC] border-2 ${errors.hora ? 'border-[#E2725B]' : 'border-[#02301E]'} ${!formData.sector && 'opacity-50'} outline-none px-4 py-3 font-body-md text-[#02301E] font-bold uppercase appearance-none`}
                  >
                    <option value="" disabled>Seleccioná horario</option>
                    {availableSlots.map(slot => (
                      <option key={slot} value={slot}>{slot} HS</option>
                    ))}
                  </select>
                  <ChevronDown className={`absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none ${!formData.sector ? 'text-[#02301E]/50' : 'text-[#02301E]'}`} size={20} />
                </div>
                {!formData.sector && <p className="text-[#E2725B] font-label-bold font-bold text-[12px] mt-2 uppercase">Elegí un sector primero.</p>}
                {errors.hora && <p className="text-[#E2725B] font-label-bold font-bold text-[12px] mt-2 uppercase">{errors.hora}</p>}
              </div>

              {/* Personas */}
              <div>
                <label className="flex items-center gap-2 font-label-mono font-bold text-[#02301E] uppercase mb-2">
                  <Users size={18} /> Personas *
                </label>
                <div className="flex bg-[#F5F5DC] border-2 border-[#02301E] w-full">
                  <button 
                    type="button" 
                    onClick={() => handleChange('personas', Math.max(1, formData.personas - 1))}
                    className="px-4 py-3 border-r-2 border-[#02301E] hover:bg-[#E2725B] hover:text-[#F5F5DC] transition-colors font-black"
                  >-</button>
                  <input 
                    type="number" 
                    min="1" max="12"
                    value={formData.personas}
                    onChange={(e) => handleChange('personas', parseInt(e.target.value) || 1)}
                    className="w-full text-center bg-transparent outline-none font-body-md text-[#02301E] font-bold uppercase"
                  />
                  <button 
                    type="button" 
                    onClick={() => handleChange('personas', Math.min(12, formData.personas + 1))}
                    className="px-4 py-3 border-l-2 border-[#02301E] hover:bg-[#E2725B] hover:text-[#F5F5DC] transition-colors font-black"
                  >+</button>
                </div>
                {errors.personas && <p className="text-[#E2725B] font-label-bold font-bold text-[12px] mt-2 uppercase">{errors.personas}</p>}
              </div>

              {/* Ocasión (Opcional) */}
              <div>
                <label className="flex items-center gap-2 font-label-mono font-bold text-[#02301E] uppercase mb-2">
                   Ocasión (Opcional)
                </label>
                <div className="relative">
                  <select 
                    value={formData.ocasion}
                    onChange={(e) => handleChange('ocasion', e.target.value)}
                    className="w-full bg-[#F5F5DC] border-2 border-[#02301E] outline-none px-4 py-3 font-body-md text-[#02301E] font-bold uppercase appearance-none"
                  >
                    {OCASIONES.map(oc => (
                      <option key={oc} value={oc}>{oc}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#02301E]" size={20} />
                </div>
              </div>

              {/* Comentarios Adicionales */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 font-label-mono font-bold text-[#02301E] uppercase mb-2">
                   Comentarios adicionales (Opcional)
                </label>
                <textarea 
                  value={formData.comentarios}
                  onChange={(e) => handleChange('comentarios', e.target.value)}
                  rows={3}
                  className="w-full bg-[#F5F5DC] border-2 border-[#02301E] outline-none px-4 py-3 font-body-md text-[#02301E] font-semibold placeholder:opacity-50"
                  placeholder="¿Alguna alergia? ¿Mesa cerca de los parlantes? Contanos..."
                />
              </div>

            </div>
          </div>

          {/* Submit */}
          <div className="pt-8 flex flex-col items-center">
             <button 
                type="submit" 
                className="bg-[#E2725B] text-[#F5F5DC] px-12 py-6 font-headline-md font-extrabold text-[24px] uppercase border-heavy brutalist-shadow hover:translate-y-2 hover:translate-x-2 hover:shadow-none transition-all"
              >
                CONFIRMAR Y ENVIAR
              </button>
              <p className="mt-6 font-label-mono text-[#02301E] font-bold text-[12px] uppercase flex items-center gap-2 bg-white px-4 py-2 border-2 border-[#02301E]">
                 <AlertTriangle size={16} className="text-[#E2725B]" /> Hasta 15 minutos de tolerancia el día de la reserva.
              </p>
          </div>

        </form>
      </div>
    </section>
  );
};
