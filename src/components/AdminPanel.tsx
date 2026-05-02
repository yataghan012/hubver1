import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CalendarDays, 
  Coffee, 
  Clock, 
  Settings, 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  AlertTriangle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';

interface AdminPanelProps {
  onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('reservas');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const tabs = [
    { id: 'reservas', label: 'Reservas', icon: Users },
    { id: 'eventos', label: 'Eventos', icon: CalendarDays },
    { id: 'menu', label: 'Menú', icon: Coffee },
    { id: 'horarios', label: 'Horarios', icon: Clock },
    { id: 'contacto', label: 'Contacto', icon: Settings },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'hubadmin') {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-24 min-h-screen bg-[#1c1a18] text-[#F5F5DC] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E2725B] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#02301E] rounded-full blur-[150px] opacity-20 pointer-events-none"></div>

        <button 
          onClick={onBack}
          className="absolute top-28 left-6 md:left-12 flex items-center gap-2 font-label-mono font-bold text-[#F5F5DC] uppercase tracking-widest hover:-translate-x-2 transition-transform z-10"
        >
          <ArrowLeft size={16} />
          Volver a la Web
        </button>

        <div className="bg-[#100f0e] border border-[#F5F5DC]/10 p-8 md:p-12 shadow-2xl relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-500 rounded-sm">
          <div className="text-center mb-8">
            <h1 className="font-display-xl text-5xl font-black uppercase tracking-tighter drop-shadow-[2px_2px_0px_#E2725B] text-[#F5F5DC]">HUB!</h1>
            <p className="font-label-mono mt-2 text-[#F5F5DC]/50 uppercase tracking-widest text-[12px]">Panel de Control</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block font-label-mono text-[12px] font-bold uppercase mb-2 text-[#F5F5DC]/80">
                Usuario
              </label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#1c1a18] border border-[#F5F5DC]/20 px-4 py-3 font-body-md text-[16px] text-[#F5F5DC] focus:outline-none focus:border-[#E2725B] transition-colors placeholder:opacity-30"
                placeholder="admin"
              />
            </div>
            
            <div>
              <label className="block font-label-mono text-[12px] font-bold uppercase mb-2 text-[#F5F5DC]/80">
                Contraseña
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1c1a18] border border-[#F5F5DC]/20 px-4 py-3 font-body-md text-[16px] text-[#F5F5DC] focus:outline-none focus:border-[#E2725B] transition-colors placeholder:opacity-30"
                placeholder="hubadmin"
              />
            </div>

            {loginError && (
              <p className="text-red-400 font-label-mono text-[12px] uppercase font-bold text-center">
                Credenciales incorrectas
              </p>
            )}

            <button 
              type="submit"
              className="w-full bg-[#E2725B] text-[#F5F5DC] px-6 py-4 font-label-mono text-[14px] font-bold uppercase hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_#02301E]"
            >
              Ingresar
            </button>
          </form>

          <p className="mt-8 font-label-mono text-[10px] text-center text-[#F5F5DC]/40 uppercase">
            Demo credentials: admin / hubadmin
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-[#1c1a18] text-[#F5F5DC] flex flex-col items-center">
      <div className="w-full max-w-7xl px-6 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <button 
            onClick={onBack}
            className="mb-8 flex items-center gap-2 font-label-mono font-bold text-[#F5F5DC] uppercase tracking-widest hover:-translate-x-2 transition-transform"
          >
            <ArrowLeft size={16} />
            Volver a la Web
          </button>

          <h1 className="font-display-xl text-3xl font-black uppercase text-[#E2725B] mb-8">
            HUB! Admin
          </h1>

          <nav className="flex flex-col gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 font-label-mono uppercase font-bold text-[14px] transition-colors border-l-4 ${
                  activeTab === tab.id 
                    ? 'bg-[#02301E] border-[#E2725B] text-[#F5F5DC]' 
                    : 'border-transparent text-[#F5F5DC]/60 hover:bg-[#F5F5DC]/5 hover:text-[#F5F5DC]'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-[#100f0e] border border-[#F5F5DC]/10 p-6 md:p-8 min-h-[600px] shadow-2xl relative overflow-hidden">
          
          {/* Decorative Corner */}
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#E2725B] rotate-45 opacity-20 pointer-events-none"></div>

          {activeTab === 'reservas' && <ReservasMod />}
          {activeTab === 'eventos' && <EventosMod />}
          {activeTab === 'menu' && <MenuMod />}
          {activeTab === 'horarios' && <HorariosMod />}
          {activeTab === 'contacto' && <ContactoMod />}

        </main>
      </div>
    </div>
  );
};

// --- Mock Subcomponents ---

const ReservasMod = () => {
  const { reservas, setReservas } = useCMS();
  const reservasMock = reservas;

  const handleStatus = (id: string, newStatus: 'confirmada' | 'cancelada') => {
    setReservas(prev => prev.map(r => r.id === id ? { ...r, estado: newStatus } : r));
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-[#F5F5DC]/10 pb-4 gap-4">
        <div>
          <h2 className="font-display-xl text-3xl font-black uppercase text-[#F5F5DC] tracking-tight">Registro de Reservas</h2>
          <p className="font-body-md text-[#F5F5DC]/70 mt-1">Gestioná los datos detallados de cada cliente y sus mesas.</p>
        </div>
        <button className="bg-[#E2725B] text-[#F5F5DC] px-4 py-2 font-label-mono text-[12px] font-bold uppercase transition-transform hover:-translate-y-1 shadow-[4px_4px_0px_#02301E]">
          Exportar CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b-2 border-[#02301E] font-label-mono text-[12px] uppercase tracking-widest text-[#F5F5DC]/50 bg-[#F5F5DC]/5">
              <th className="p-3">Cliente</th>
              <th className="p-3">Fecha & Hora</th>
              <th className="p-3">Detalles</th>
              <th className="p-3">Comentarios</th>
              <th className="p-3">Estado</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservasMock.map(res => (
              <tr key={res.id} className="border-b border-[#F5F5DC]/10 hover:bg-[#F5F5DC]/5 transition-colors font-body-md align-top">
                <td className="p-3">
                  <div className="font-bold text-[#E2725B]">{res.nombre}</div>
                  <div className="text-[12px] text-[#F5F5DC]/60">{res.whatsapp}</div>
                  <div className="text-[12px] text-[#F5F5DC]/60">{res.email}</div>
                </td>
                <td className="p-3">
                  <div className="font-bold">{res.fecha}</div>
                  <div className="text-[14px]">{res.hora}</div>
                </td>
                <td className="p-3">
                  <div className="text-[14px]"><strong>Pax:</strong> {res.personas}</div>
                  <div className="text-[14px]"><strong>Sector:</strong> {res.sector}</div>
                  <div className="text-[14px]"><strong>Ocasión:</strong> {res.ocasion}</div>
                </td>
                <td className="p-3 max-w-[200px]">
                  <p className="text-[14px] text-[#F5F5DC]/80 truncate" title={res.comentarios || 'Ninguno'}>{res.comentarios || '-'}</p>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-[10px] uppercase font-bold font-label-mono ${
                    res.estado === 'confirmada' ? 'bg-[#02301E] text-green-400' :
                    res.estado === 'cancelada' ? 'bg-red-900/30 text-red-400' : 'bg-yellow-900/30 text-yellow-400'
                  }`}>
                    {res.estado}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-2 justify-end mt-2">
                    {res.estado !== 'confirmada' && (
                      <button onClick={() => handleStatus(res.id, 'confirmada')} className="text-green-400 hover:scale-110 transition-transform" title="Aprobar"><CheckCircle2 size={18} /></button>
                    )}
                    {res.estado !== 'cancelada' && (
                      <button onClick={() => handleStatus(res.id, 'cancelada')} className="text-red-400 hover:scale-110 transition-transform" title="Rechazar"><XCircle size={18} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const EventosMod = () => {
  const { eventos, setEventos } = useCMS();

  const handleDelete = (id: string) => {
    if (window.confirm("¿Seguro que deseas eliminar este evento?")) {
      setEventos(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleEdit = (evt: any) => {
    const title = window.prompt("Nuevo título:", evt.title);
    if (title === null) return;
    const price = window.prompt("Nuevo precio:", evt.price);
    if (price === null) return;
    const description = window.prompt("Nueva descripción:", evt.description);
    if (description === null) return;

    setEventos(prev => prev.map(e => e.id === evt.id ? { ...e, title, price, description } : e));
  };

  const handeAddEvent = () => {
    const title = window.prompt("Título del nuevo evento:");
    if (!title) return;
    const date = window.prompt("Fecha (YYYY-MM-DD):", new Date().toISOString().split('T')[0]) || new Date().toISOString();
    const time = window.prompt("Hora (HH:MM):", "21:00") || "21:00";
    const price = window.prompt("Precio:", "entrada libre") || "entrada libre";
    const newEvent = {
        id: 'evt-' + Date.now().toString(),
        title,
        date,
        time,
        format: 'música en vivo' as const,
        acousticLevel: 'moderado' as const,
        price,
        description: 'Nuevo evento añadido desde admin.',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819'
    };
    setEventos(prev => [...prev, newEvent]);
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-[#F5F5DC]/10 pb-4 gap-4">
        <div>
          <h2 className="font-display-xl text-3xl font-black uppercase text-[#F5F5DC] tracking-tight">Eventos & Gigs</h2>
          <p className="font-body-md text-[#F5F5DC]/70 mt-1">Configurá la información detallada de cada evento.</p>
        </div>
        <button onClick={handeAddEvent} className="flex items-center gap-2 bg-[#02301E] text-[#F5F5DC] px-4 py-2 font-label-mono text-[12px] font-bold uppercase transition-transform border border-[#02301E] hover:border-[#E2725B] shadow-[4px_4px_0px_#E2725B]">
          <Plus size={16} /> Nuevo Evento
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {eventos.map((evt) => (
          <div key={evt.id} className="flex flex-col lg:flex-row p-4 border border-[#F5F5DC]/10 bg-[#F5F5DC]/5 gap-6 hover:bg-[#F5F5DC]/10 transition-colors">
            <div className="w-full lg:w-48 h-32 bg-gray-800 overflow-hidden flex-shrink-0 relative">
              <img src={`${evt.image}?auto=format&fit=crop&w=300&q=80`} alt={evt.title} className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <button className="bg-[#E2725B] text-[#F5F5DC] px-2 py-1 text-[10px] font-bold uppercase">Cambiar Imagen</button>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-headline-md font-bold uppercase text-[20px] text-[#E2725B] leading-tight">{evt.title}</h3>
                  <div className="font-label-mono text-[12px] text-[#F5F5DC]/70 mt-1 flex gap-3">
                    <span>{new Date(evt.date).toLocaleDateString()} - {evt.time}</span>
                    <span>•</span>
                    <span className="uppercase text-[#F5F5DC]">{evt.format}</span>
                    <span>•</span>
                    <span className="uppercase text-[#F5F5DC]">{evt.acousticLevel}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 border border-[#F5F5DC]/20 hover:bg-[#F5F5DC]/20 transition-colors" title="Editar Evento" onClick={() => handleEdit(evt)}><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(evt.id)} className="p-2 border border-red-900/50 hover:bg-red-900/30 text-red-400 transition-colors" title="Eliminar"><Trash2 size={16} /></button>
                </div>
              </div>
              <div className="mt-4 flex gap-4 text-[14px]">
                <div><strong>Precio:</strong> {evt.price}</div>
                <div><strong>Desc:</strong> <span className="opacity-70 truncate line-clamp-1 max-w-[250px]">{evt.description}</span></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MenuMod = () => {
  const { menu, setMenu } = useCMS();

  const handleEditCategory = (cat: any) => {
    const title = window.prompt("Nuevo nombre de categoría:", cat.title);
    if (title === null) return;
    setMenu(prev => prev.map(c => c.id === cat.id ? { ...c, title } : c));
  };

  const handleEditItem = (catId: string, item: any) => {
    const name = window.prompt("Nuevo nombre del plato:", item.name);
    if (name === null) return;
    const price = window.prompt("Nuevo precio:", typeof item.price === 'string' ? item.price : `$${item.price}`);
    if (price === null) return;
    const description = window.prompt("Nueva descripción:", item.description);
    if (description === null) return;

    setMenu(prev => prev.map(cat => {
      if (cat.id === catId) {
        return {
          ...cat,
          items: cat.items.map(i => i.id === item.id ? { ...i, name, price, description } : i)
        };
      }
      return cat;
    }));
  };

  const handleDeleteItem = (catId: string, itemId: string) => {
    if (window.confirm("¿Seguro que deseas eliminar este ítem?")) {
      setMenu(prev => prev.map(cat => {
        if (cat.id === catId) {
          return { ...cat, items: cat.items.filter(item => item.id !== itemId) };
        }
        return cat;
      }));
    }
  };

  const handleAddCategory = () => {
    const title = window.prompt("Nombre de la nueva categoría:");
    if (!title) return;
    setMenu(prev => [...prev, {
      id: 'cat-' + Date.now().toString(),
      title,
      items: []
    }]);
  };

  const handleAddItem = () => {
    if (menu.length === 0) {
      alert("Primero crea una categoría.");
      return;
    }
    const catTitles = menu.map((c, i) => `${i}: ${c.title}`).join('\n');
    const catIndexStr = window.prompt(`¿A qué categoría agregar el plato?\n${catTitles}\n\nEscribe el número:`);
    if (!catIndexStr) return;
    const catIndex = parseInt(catIndexStr, 10);
    if (isNaN(catIndex) || catIndex < 0 || catIndex >= menu.length) return;
    
    const name = window.prompt("Nombre del plato:");
    if (!name) return;
    const price = window.prompt("Precio:", "$5.000") || "$5.000";

    setMenu(prev => {
      const copy = [...prev];
      copy[catIndex].items.push({
        id: 'item-' + Date.now().toString(),
        name,
        description: 'Nuevo plato del menú',
        price,
      });
      return copy;
    });
  };

  const handleEditAlert = () => alert("Edición completa en desarrollo. Usa el lapiz para funciones futuras.");

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-[#F5F5DC]/10 pb-4 gap-4">
        <div>
          <h2 className="font-display-xl text-3xl font-black uppercase text-[#F5F5DC] tracking-tight">Catálogo de Menú</h2>
          <p className="font-body-md text-[#F5F5DC]/70 mt-1">Configurá categorías, descripciones, ítems destacados e imágenes.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleAddCategory} className="flex items-center gap-2 bg-[#1c1a18] border border-[#F5F5DC]/20 text-[#F5F5DC] px-4 py-2 font-label-mono text-[12px] font-bold uppercase transition-transform hover:bg-[#F5F5DC]/10">
            <Plus size={16} /> Agregar Categoría
          </button>
          <button onClick={handleAddItem} className="flex items-center gap-2 bg-[#02301E] border border-[#02301E] text-[#F5F5DC] px-4 py-2 font-label-mono text-[12px] font-bold uppercase transition-transform hover:border-[#E2725B] shadow-[4px_4px_0px_#E2725B]">
            <Plus size={16} /> Añadir Plato
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {menu.map(cat => (
          <div key={cat.id} className="border border-[#F5F5DC]/20 bg-[#1c1a18]">
            <div className="bg-[#E2725B]/10 p-4 font-label-mono text-[16px] font-bold uppercase flex justify-between items-center border-b border-[#E2725B]/20">
              <div className="flex items-center gap-2 text-[#E2725B]">
                <span>{cat.title}</span>
                <button onClick={() => handleEditCategory(cat)} className="p-1 opacity-50 hover:opacity-100"><Edit2 size={14} /></button>
              </div>
              <span className="text-[12px] text-[#F5F5DC]/50">{cat.items.length} Ítems</span>
            </div>
            <div className="p-4 space-y-4">
              {cat.items.map(item => (
                <div key={item.id} className={`flex justify-between items-start p-4 border ${item.featuredImage ? 'bg-[#02301E]/30 border-[#02301E]' : 'bg-[#100f0e] border-[#F5F5DC]/10'}`}>
                  <div className="flex gap-4">
                    {item.featuredImage ? (
                      <div className="w-16 h-16 bg-gray-600 rounded-sm overflow-hidden border border-[#E2725B] flex-shrink-0">
                        <img src={`${item.featuredImage}?auto=format&fit=crop&w=150&q=80`} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div onClick={() => handleEditItem(cat.id, item)} className="w-16 h-16 bg-gray-800 rounded-sm border border-dashed border-[#F5F5DC]/20 flex flex-shrink-0 items-center justify-center text-[#F5F5DC]/30 text-[10px] text-center p-1 cursor-pointer hover:bg-[#F5F5DC]/5 transition-colors">Cambiar Imagen / Editar</div>
                    )}
                    <div>
                      <div className="font-bold uppercase text-[#F5F5DC] flex gap-2 items-center flex-wrap">
                        {item.name} 
                        {item.featuredImage && <span className="bg-[#E2725B] text-[#02301E] px-1 text-[9px] tracking-widest font-black">DESTACADO</span>}
                      </div>
                      <div className="text-[13px] text-[#F5F5DC]/70 max-w-md mt-1">{item.description}</div>
                      <div className="font-label-mono text-[14px] text-[#E2725B] mt-2 font-bold whitespace-nowrap">
                        {typeof item.price === 'string' ? item.price : `$${item.price}`}
                        {item.isVeggie && <span className="bg-[#F5F5DC]/20 px-1 ml-2 text-[#F5F5DC] text-[10px] uppercase align-middle">Veggie</span>}
                        {item.isSinTacc && <span className="bg-[#F5F5DC]/20 px-1 ml-2 text-[#F5F5DC] text-[10px] uppercase align-middle">Sin TACC</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-2 ml-4">
                    <button onClick={() => handleEditItem(cat.id, item)} className="text-[#F5F5DC]/70 hover:text-[#F5F5DC] bg-[#100f0e] p-2 border border-[#F5F5DC]/10 hover:border-[#F5F5DC]/30"><Edit2 size={16} /></button>
                    {!item.featuredImage && <button onClick={() => handleDeleteItem(cat.id, item.id)} className="text-red-400 p-2 opacity-50 hover:opacity-100"><Trash2 size={16} /></button>}
                    {item.featuredImage && <button onClick={() => handleDeleteItem(cat.id, item.id)} className="text-red-400 p-2 border border-red-900/50 hover:bg-red-900/30 transition-colors"><Trash2 size={16} /></button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const HorariosMod = () => {
  const { horarios, setHorarios } = useCMS();
  const [localHorarios, setLocalHorarios] = useState(horarios);
  const [saved, setSaved] = useState(false);

  const handleSubmit = () => {
    setHorarios(localHorarios);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-end mb-8 border-b border-[#F5F5DC]/10 pb-4">
        <div>
          <h2 className="font-display-xl text-3xl font-black uppercase text-[#F5F5DC] tracking-tight">Horarios</h2>
          <p className="font-body-md text-[#F5F5DC]/70 mt-1">Configuración de apertura y cierre por día de la semana.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#F5F5DC]/5 p-6 border border-[#F5F5DC]/10">
        {['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'].map(dia => (
          <label key={dia} className="flex flex-col gap-2 font-label-mono text-[12px] font-bold uppercase">
            {dia}
            <input 
              type="text" 
              value={(localHorarios as any)[dia]} 
              onChange={e => setLocalHorarios({ ...localHorarios, [dia]: e.target.value })}
              className="bg-[#1c1a18] border border-[#F5F5DC]/20 px-3 py-3 font-body-md text-[16px] normal-case text-[#F5F5DC] focus:outline-none focus:border-[#E2725B]" 
            />
          </label>
        ))}
      </div>
      <div className="mt-8 flex gap-4 items-center">
        <button onClick={handleSubmit} className="bg-[#E2725B] text-[#F5F5DC] px-8 py-4 font-label-mono text-[14px] font-bold uppercase hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_#02301E]">
          Guardar Horarios
        </button>
        {saved && <span className="text-green-400 font-label-mono text-sm uppercase">¡Guardado!</span>}
      </div>
    </div>
  );
};

const ContactoMod = () => {
  const { contacto, setContacto } = useCMS();
  const [localContacto, setLocalContacto] = useState(contacto);
  const [saved, setSaved] = useState(false);

  const handleSubmit = () => {
    setContacto(localContacto);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-end mb-8 border-b border-[#F5F5DC]/10 pb-4">
        <div>
          <h2 className="font-display-xl text-3xl font-black uppercase text-[#F5F5DC] tracking-tight">Datos de Contacto</h2>
          <p className="font-body-md text-[#F5F5DC]/70 mt-1">Configurá la dirección, links sociales y textos del footer.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6 bg-[#F5F5DC]/5 p-6 border border-[#F5F5DC]/10">
          <h3 className="font-label-mono uppercase text-[#E2725B] font-bold text-[14px] border-b border-[#F5F5DC]/10 pb-2">Información Principal</h3>
          <label className="flex flex-col gap-2 font-label-mono text-[12px] font-bold uppercase w-full">
            Dirección Física
            <input type="text" value={localContacto.direccion} onChange={e => setLocalContacto({...localContacto, direccion: e.target.value})} className="bg-[#1c1a18] border border-[#F5F5DC]/20 px-3 py-3 font-body-md text-[16px] normal-case text-[#F5F5DC] focus:outline-none focus:border-[#E2725B]" />
          </label>
          <label className="flex flex-col gap-2 font-label-mono text-[12px] font-bold uppercase w-full">
            Texto Guía (Ej: La casona con la puerta roja)
            <input type="text" value={localContacto.textoGuia} onChange={e => setLocalContacto({...localContacto, textoGuia: e.target.value})} className="bg-[#1c1a18] border border-[#F5F5DC]/20 px-3 py-3 font-body-md text-[16px] normal-case text-[#F5F5DC] focus:outline-none focus:border-[#E2725B]" />
          </label>
        </div>

        <div className="space-y-6 bg-[#F5F5DC]/5 p-6 border border-[#F5F5DC]/10">
          <h3 className="font-label-mono uppercase text-[#E2725B] font-bold text-[14px] border-b border-[#F5F5DC]/10 pb-2">Redes & Links Externos</h3>
          <label className="flex flex-col gap-2 font-label-mono text-[12px] font-bold uppercase w-full">
            WhatsApp General / Reservas
            <input type="text" value={localContacto.whatsapp} onChange={e => setLocalContacto({...localContacto, whatsapp: e.target.value})} className="bg-[#1c1a18] border border-[#F5F5DC]/20 px-3 py-3 font-body-md text-[16px] normal-case text-[#F5F5DC] focus:outline-none focus:border-[#E2725B]" />
          </label>
          <label className="flex flex-col gap-2 font-label-mono text-[12px] font-bold uppercase w-full">
            Link de Pedix (Pedidos)
            <input type="text" value={localContacto.pedix} onChange={e => setLocalContacto({...localContacto, pedix: e.target.value})} className="bg-[#1c1a18] border border-[#F5F5DC]/20 px-3 py-3 font-body-md text-[16px] normal-case text-[#F5F5DC] focus:outline-none focus:border-[#E2725B]" />
          </label>
          <label className="flex flex-col gap-2 font-label-mono text-[12px] font-bold uppercase w-full">
            Link Instagram
            <input type="text" value={localContacto.instagram} onChange={e => setLocalContacto({...localContacto, instagram: e.target.value})} className="bg-[#1c1a18] border border-[#F5F5DC]/20 px-3 py-3 font-body-md text-[16px] normal-case text-[#F5F5DC] focus:outline-none focus:border-[#E2725B]" />
          </label>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button onClick={handleSubmit} className="bg-[#E2725B] text-[#F5F5DC] px-8 py-4 font-label-mono text-[14px] font-bold uppercase hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_#02301E]">
          Actualizar Contactos
        </button>
        {saved && <span className="text-green-400 font-label-mono text-sm uppercase">¡Guardado!</span>}
      </div>
    </div>
  );
};
