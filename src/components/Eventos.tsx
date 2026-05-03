import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Music, Utensils, Zap, Users, Ticket, ArrowRight, CheckCircle2, Volume, Volume1, Volume2 } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

// Interfaces and Mock Data
interface Evento {
  id: string;
  title: string;
  date: string; // ISO format or similar to parse
  time: string;
  acousticLevel: 'tranquilo' | 'moderado' | 'alto';
  format: 'música en vivo' | 'DJ' | 'temático' | 'gastronómico' | 'sin evento';
  price: number | 'entrada libre';
  description: string;
  image: string;
}

const formatColors = {
  'música en vivo': 'bg-[#E2725B] text-[#02301E]',
  'DJ': 'bg-[#02301E] text-[#F5F5DC]',
  'temático': 'bg-[#E2725B] text-[#F5F5DC]',
  'gastronómico': 'bg-[#02301E] text-[#E2725B]',
  'sin evento': 'bg-[#F5F5DC] text-[#02301E]'
};

const formatIcons = {
  'música en vivo': <Music size={16} />,
  'DJ': <Zap size={16} />,
  'temático': <Users size={16} />,
  'gastronómico': <Utensils size={16} />,
  'sin evento': <Calendar size={16} />
};

const intensityLabels = {
  'tranquilo': { label: 'Volumen Bajo', icon: <Volume size={16} />, color: 'bg-[#F5F5DC] text-[#02301E] border-[#02301E]' },
  'moderado': { label: 'Volumen Medio', icon: <Volume1 size={16} />, color: 'bg-[#F5F5DC] text-[#02301E] border-[#02301E]' },
  'alto': { label: 'Fuerte / Ruidoso', icon: <Volume2 size={16} />, color: 'bg-[#E2725B] text-[#02301E] border-[#02301E]' }
};

// Generates dates relative to the current month to ensure we always see events
const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const _OLD_MOCK_EVENTS: Evento[] = [
  {
    id: 'e1',
    title: 'Noche Astral',
    date: new Date(currentYear, currentMonth, 12).toISOString(),
    time: '21:00',
    acousticLevel: 'moderado',
    format: 'temático',
    price: 'entrada libre',
    description: 'Cartas natales, tarot y tragos ahumados. Una noche para mirar las estrellas.',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'e2',
    title: 'Sushi Libre',
    date: new Date(currentYear, currentMonth, 15).toISOString(),
    time: '20:30',
    acousticLevel: 'tranquilo',
    format: 'gastronómico',
    price: 18000,
    description: 'Omakase libre y selección de sakes. Nuestra casona, pero en modo asiático.',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'e3',
    title: 'Cosmic Jazz Quartet',
    date: new Date(currentYear, currentMonth, 19).toISOString(),
    time: '22:00',
    acousticLevel: 'moderado',
    format: 'música en vivo',
    price: 5000,
    description: 'Jazz fusión en nuestro patio principal. Fermentados y buenas vibras.',
    image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'e4',
    title: 'Omakase & Vinyl Sessions',
    date: new Date(currentYear, currentMonth, 22).toISOString(),
    time: '21:00',
    acousticLevel: 'tranquilo',
    format: 'música en vivo',
    price: 25000,
    description: 'Lo mejor de nuestra cocina fusionada con vinilos de colección tocados en vivo.',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'e5',
    title: 'Heritage Live',
    date: new Date(currentYear, currentMonth, 26).toISOString(),
    time: '23:30',
    acousticLevel: 'alto',
    format: 'música en vivo',
    price: 4000,
    description: 'Banda indie local presentando nuevo material. Va a subir el volumen.',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'e6',
    title: 'After Hours',
    date: new Date(currentYear, currentMonth, 28).toISOString(),
    time: '01:00',
    acousticLevel: 'alto',
    format: 'DJ',
    price: 'entrada libre',
    description: 'DJs locales, house y mezcal. Cerramos las puertas cuando salga el sol.',
    image: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'e7',
    title: 'Cupping Session',
    date: new Date(currentYear, currentMonth, 10).toISOString(),
    time: '17:00',
    acousticLevel: 'tranquilo',
    format: 'gastronómico',
    price: 8000,
    description: 'Cata de nuestros granos de especialidad. Incluye pastelería de la casa.',
    image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=800&q=80'
  }
];

// Additional events for next month to show navigation
const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;

interface EventosProps {
  onBack: () => void;
  onReservar: (prefilledEventInfo: string) => void;
}

export function Eventos({ onBack, onReservar }: EventosProps) {
  const { eventos } = useCMS();
  // alias for backward compatibility locally
  const MOCK_EVENTS = eventos;
  const [viewDate, setViewDate] = useState(new Date(currentYear, currentMonth, 1));
  const [activeFilter, setActiveFilter] = useState<'todos' | 'música' | 'gastronomía' | 'temáticos'>('todos');
  const [subName, setSubName] = useState('');
  const [subContact, setSubContact] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const goToPrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  // Filter logic
  let filteredEvents = MOCK_EVENTS.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === viewDate.getMonth() && eventDate.getFullYear() === viewDate.getFullYear();
  });

  if (activeFilter !== 'todos') {
    filteredEvents = filteredEvents.filter(event => {
      if (activeFilter === 'música') return event.format === 'música en vivo' || event.format === 'DJ';
      if (activeFilter === 'gastronomía') return event.format === 'gastronómico';
      if (activeFilter === 'temáticos') return event.format === 'temático';
      return true;
    });
  }

  // Sort by date
  filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName || !subContact) return;
    
    setSubStatus('submitting');
    setTimeout(() => {
      setSubStatus('success');
      setSubName('');
      setSubContact('');
      setTimeout(() => setSubStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <div className="bg-[#F5F5DC] min-h-screen text-[#02301E]">
      {/* Header */}
      <div className="bg-[#02301E] pt-8 lg:pt-16 px-6 lg:pl-20 xl:pl-28 lg:pr-12 pb-12 border-b-8 border-[#E2725B]">
        <div className="max-w-5xl mx-auto">
          <button 
            onClick={onBack}
            className="mb-8 font-label-mono font-bold text-[#E2725B] uppercase tracking-widest hover:-translate-x-2 transition-transform flex items-center gap-2"
          >
            <ChevronLeft size={20} /> Volver al inicio
          </button>
          
          <h1 className="font-display-xl text-5xl md:text-7xl lg:text-[84px] text-[#F5F5DC] font-black uppercase leading-none drop-shadow-[6px_6px_0px_#E2725B] tracking-tight mb-4 break-words">
            GIGS & <br/>EVENTOS
          </h1>
          <p className="font-body-lg text-[#F5F5DC] text-[18px] md:text-[22px] max-w-2xl opacity-90 border-l-4 border-[#E2725B] pl-4">
            Noches temáticas, bandas en vivo y experiencias gastronómicas en Alta Córdoba.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:pl-20 xl:pl-28 lg:pr-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            
            {/* Calendar & Filters Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b-4 border-[#02301E]">
              
              {/* Month Navigation */}
              <div className="flex items-center gap-4 bg-[#02301E] p-2 text-[#F5F5DC]">
                <button onClick={goToPrevMonth} className="p-2 hover:bg-[#E2725B] hover:text-[#02301E] transition-colors">
                  <ChevronLeft size={24} />
                </button>
                <div className="font-headline-lg font-black uppercase tracking-tighter text-xl min-w-[140px] text-center">
                  {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                </div>
                <button onClick={goToNextMonth} className="p-2 hover:bg-[#E2725B] hover:text-[#02301E] transition-colors">
                  <ChevronRight size={24} />
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'música', label: 'Música' },
                  { id: 'gastronomía', label: 'Gastro' },
                  { id: 'temáticos', label: 'Temáticos' }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id as any)}
                    className={`px-4 py-2 font-label-mono font-bold uppercase text-[12px] tracking-widest border-2 border-[#02301E] transition-all hover:-translate-y-1 hover:translate-x-1 ${
                      activeFilter === filter.id 
                      ? 'bg-[#E2725B] text-[#F5F5DC] shadow-[2px_2px_0px_#02301E]' 
                      : 'bg-transparent text-[#02301E]'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Events List for Current Month */}
            <div className="space-y-8">
              {filteredEvents.length === 0 ? (
                <div className="bg-[#02301E]/5 border-2 border-dashed border-[#02301E]/30 p-12 text-center">
                  <Calendar className="mx-auto text-[#02301E]/40 mb-4" size={48} />
                  <h3 className="font-headline-md font-extrabold text-[24px] uppercase mb-2">No hay eventos activos</h3>
                  <p className="font-body-md opacity-80">Estamos preparando la agenda para este mes. Chequeá pronto o suscribite al newsletter.</p>
                </div>
              ) : (
                filteredEvents.map((event) => {
                  const evtDate = new Date(event.date);
                  const formatStyle = formatColors[event.format];
                  const intensityStyle = intensityLabels[event.acousticLevel];

                  return (
                    <div key={event.id} className="group border-4 border-[#02301E] bg-[#F5F5DC] hover:bg-white transition-colors brutalist-shadow overflow-hidden flex flex-col md:flex-row">
                      
                      {/* Date Badge */}
                      <div className="bg-[#02301E] text-[#F5F5DC] md:w-32 flex flex-row md:flex-col items-center justify-center p-4 border-b-4 md:border-b-0 md:border-r-4 border-[#02301E] gap-2 md:gap-0">
                        <span className="font-label-mono uppercase tracking-widest text-[14px]">
                          {evtDate.toLocaleDateString('es-AR', { weekday: 'short' })}
                        </span>
                        <span className="font-headline-lg font-black text-4xl md:text-5xl tracking-tighter">
                          {evtDate.getDate()}
                        </span>
                        <span className="font-label-mono uppercase tracking-widest text-[14px] opacity-80 mt-1">
                          {event.time}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-6 md:p-8 flex-1 flex flex-col">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <span className={`px-3 py-1 font-label-mono uppercase font-bold text-[10px] tracking-widest flex items-center gap-1 border-2 border-[#02301E] ${formatStyle}`}>
                            {formatIcons[event.format]} {event.format}
                          </span>
                          <span className={`px-3 py-1 font-label-mono uppercase font-bold text-[10px] tracking-widest flex items-center gap-1 border-2 ${intensityStyle.color}`}>
                            {intensityStyle.icon} {intensityStyle.label}
                          </span>
                        </div>

                        <h3 className="font-headline-md font-extrabold text-3xl uppercase tracking-tighter mb-2 group-hover:text-[#E2725B] transition-colors">{event.title}</h3>
                        <p className="font-body-md text-[18px] opacity-90 mb-6 flex-1">{event.description}</p>
                        
                        <div className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-[#02301E]/10 pt-6 mt-auto">
                          <div className="font-label-mono font-bold uppercase tracking-widest flex items-center gap-2 text-[#02301E]">
                            <Ticket size={20} className="text-[#E2725B]" />
                            {typeof event.price === 'number' ? `$${event.price.toLocaleString('es-AR')}` : event.price}
                          </div>
                          <button 
                            onClick={() => onReservar(`${event.title} - ${evtDate.getDate()}/${evtDate.getMonth()+1} ${event.time}`)}
                            className="bg-[#E2725B] text-[#F5F5DC] font-label-bold uppercase font-bold px-6 py-3 border-2 border-[#02301E] shadow-[4px_4px_0px_#02301E] hover:translate-x-1 hover:-translate-y-1 transition-transform flex items-center gap-2"
                          >
                            Reservar <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Sidebar / Subscription Module */}
          <div className="lg:col-span-4">
            <div className="bg-[#E2725B] p-8 border-4 border-[#02301E] shadow-[8px_8px_0px_#02301E] sticky top-[120px]">
              <div className="mb-6">
                <Ticket className="text-[#02301E] mb-4" size={40} />
                <h3 className="font-headline-md font-extrabold text-[#02301E] text-3xl uppercase tracking-tighter mb-2">
                  No te quedes afuera
                </h3>
                <p className="font-body-md text-[#F5F5DC] font-medium leading-tight">
                  Suscribite a nuestra agenda mensual y enterate antes que nadie de nuestros acústicos, fiestas y noches gastro.
                </p>
              </div>

              {subStatus === 'success' ? (
                <div className="bg-[#02301E] text-[#F5F5DC] p-6 border-2 border-[#02301E] text-center transform rotate-1">
                  <CheckCircle2 size={48} className="mx-auto mb-4 text-[#E2725B]" />
                  <p className="font-label-bold font-bold uppercase tracking-widest text-[16px] mb-2">¡Adentro!</p>
                  <p className="font-body-sm opacity-90">Ya sos parte de la tribu. Te vamos a avisar cuando haya movida.</p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div>
                    <label className="font-label-mono text-[12px] font-bold uppercase tracking-widest text-[#02301E] block mb-2">Tu Nombre</label>
                    <input 
                      type="text" 
                      required
                      value={subName}
                      onChange={(e) => setSubName(e.target.value)}
                      placeholder="Ej. Martín"
                      className="w-full bg-[#F5F5DC] border-2 border-[#02301E] p-3 font-body-md text-[#02301E] placeholder:text-[#02301E]/40 focus:outline-none focus:ring-2 focus:ring-[#02301E]"
                    />
                  </div>
                  <div>
                    <label className="font-label-mono text-[12px] font-bold uppercase tracking-widest text-[#02301E] block mb-2">WhatsApp o Email</label>
                    <input 
                      type="text" 
                      required
                      value={subContact}
                      onChange={(e) => setSubContact(e.target.value)}
                      placeholder="Info de contacto"
                      className="w-full bg-[#F5F5DC] border-2 border-[#02301E] p-3 font-body-md text-[#02301E] placeholder:text-[#02301E]/40 focus:outline-none focus:ring-2 focus:ring-[#02301E]"
                    />
                  </div>
                  <button 
                    disabled={subStatus === 'submitting'}
                    type="submit" 
                    className="w-full bg-[#02301E] text-[#F5F5DC] font-label-bold font-bold uppercase tracking-widest p-4 border-2 border-[#02301E] hover:bg-[#F5F5DC] hover:text-[#02301E] transition-colors mt-2 disabled:opacity-70 flex justify-center items-center gap-2"
                  >
                    {subStatus === 'submitting' ? 'Suscribiendo...' : 'Avisame'} 
                    {subStatus !== 'submitting' && <ArrowRight size={16} />}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
