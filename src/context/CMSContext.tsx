import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tipos base
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  isVeggie?: boolean;
  isSinTacc?: boolean;
  featuredImage?: string;
  isFeatured?: boolean;
}

export interface MenuCategory {
  id: string;
  title: string;
  items: MenuItem[];
}

export interface Evento {
  id: string;
  title: string;
  date: string;
  time: string;
  format: 'música en vivo' | 'DJ' | 'temático' | 'gastronómico' | 'sin evento';
  acousticLevel: 'tranquilo' | 'moderado' | 'alto';
  price: number | 'entrada libre' | string;
  description: string;
  image: string;
}

export interface Reserva {
  id: string;
  nombre: string;
  whatsapp: string;
  email: string;
  fecha: string;
  hora: string;
  personas: number;
  sector: string;
  ocasion: string;
  comentarios: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada';
}

export interface Horarios {
  lunes: string;
  martes: string;
  miercoles: string;
  jueves: string;
  viernes: string;
  sabado: string;
  domingo: string;
}

export interface Contacto {
  direccion: string;
  textoGuia: string;
  whatsapp: string;
  pedix: string;
  instagram: string;
}

interface CMSContextProps {
  menu: MenuCategory[];
  setMenu: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
  eventos: Evento[];
  setEventos: React.Dispatch<React.SetStateAction<Evento[]>>;
  reservas: Reserva[];
  setReservas: React.Dispatch<React.SetStateAction<Reserva[]>>;
  horarios: Horarios;
  setHorarios: React.Dispatch<React.SetStateAction<Horarios>>;
  contacto: Contacto;
  setContacto: React.Dispatch<React.SetStateAction<Contacto>>;
  addReserva: (reserva: Omit<Reserva, 'id' | 'estado'>) => void;
}

const CMSContext = createContext<CMSContextProps | undefined>(undefined);

// InicialStates predeterminados traídos del código
const initialHorarios: Horarios = {
  lunes: '08:00 - 01:30',
  martes: '08:00 - 01:30',
  miercoles: '08:00 - 01:30',
  jueves: '08:00 - 04:00',
  viernes: '08:00 - 04:00',
  sabado: '08:00 - 04:00',
  domingo: '08:00 - 01:30'
};

const initialContacto: Contacto = {
  direccion: 'Mariano Fragueiro 2151, Córdoba',
  textoGuia: '',
  whatsapp: '+54 9 351 123-4567',
  pedix: 'https://pedix.app/hub-bar-coffee',
  instagram: 'https://www.instagram.com/hub.cordoba/'
};

// ... initialMenu y initialEventos los podemos obviar o copiar de los respectivos archivos.
// Acá pondremos una importacion o hardcodeos breves.

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();
const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;

const defaultEventos: Evento[] = [
  {
    id: 'e1',
    title: 'Noche Astral',
    date: new Date(currentYear, currentMonth, 12).toISOString(),
    time: '21:00',
    acousticLevel: 'moderado',
    format: 'temático',
    price: 'entrada libre',
    description: 'Cartas natales, tarot y tragos ahumados. Una noche para mirar las estrellas.',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819'
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
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c'
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
    image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f'
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
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721'
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
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea'
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
    image: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e'
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
    image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0'
  },
  {
    id: 'e8',
    title: 'Fiesta de la Primavera',
    date: new Date(nextYear, nextMonth, 5).toISOString(),
    time: '22:00',
    acousticLevel: 'alto',
    format: 'temático',
    price: 6000,
    description: 'Celebramos la nueva estación como sabemos. Dress code: floral.',
    image: 'https://images.unsplash.com/photo-1533174000273-0d331908dbdb'
  }
];

import { INITIAL_MENU_DATA } from '../initialData';

export const CMSProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [menu, setMenu] = useState<MenuCategory[]>(() => {
    const saved = localStorage.getItem('hub_menu_v5');
    return saved ? JSON.parse(saved) : INITIAL_MENU_DATA;
  });
  
  const [eventos, setEventos] = useState<Evento[]>(() => {
    const saved = localStorage.getItem('hub_eventos_v5');
    return saved ? JSON.parse(saved) : defaultEventos;
  });

  const [reservas, setReservas] = useState<Reserva[]>(() => {
    const saved = localStorage.getItem('hub_reservas_v5');
    return saved ? JSON.parse(saved) : [
      { id: '1', nombre: 'Valentina Rossi', email: 'vale@example.com', whatsapp: '+5493512345678', fecha: '2025-05-14', hora: '21:00', personas: 4, sector: 'Patio Principal', ocasion: 'Cumpleaños', comentarios: 'Traemos torta', estado: 'confirmada' },
      { id: '2', nombre: 'Matias Gimenez', email: 'matias@example.com', whatsapp: '+5493518765432', fecha: '2025-05-14', hora: '22:30', personas: 2, sector: 'Hall', ocasion: 'Sin ocasión especial', comentarios: '', estado: 'pendiente' }
    ];
  });

  const [horarios, setHorarios] = useState<Horarios>(() => {
    // If we have saved data, we use it, but if it says "Cerrado" for Mon/Tue we might want to override?
    // Actually, following user instructions we should update the initial state.
    // The user will probably want the app to reflect these hours immediately.
    const saved = localStorage.getItem('hub_horarios_v5');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Forzar actualizacion si detectamos que estan desactualizados o simplemente usar los nuevos por defecto si el usuario lo pide.
      // Pero mejor solo cambio el initialHorarios y si el usuario quiere resetear puede hacerlo desde el admin (si tuviera reset).
      // Sin embargo, para mayor impacto inmediato en esta sesion, los actualizaré aqui si son los viejos conocidos.
      if (parsed.lunes === 'Cerrado') {
        return initialHorarios; // Reset to new ones if they are clearly old
      }
      return parsed;
    }
    return initialHorarios;
  });

  const [contacto, setContacto] = useState<Contacto>(() => {
    const saved = localStorage.getItem('hub_contacto_v5');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.textoGuia === 'La casona con la puerta roja. No hay cartel.') {
        return { ...parsed, textoGuia: '' };
      }
      return parsed;
    }
    return initialContacto;
  });

  // Effect for saving
  useEffect(() => { localStorage.setItem('hub_menu_v5', JSON.stringify(menu)); }, [menu]);
  useEffect(() => { localStorage.setItem('hub_eventos_v5', JSON.stringify(eventos)); }, [eventos]);
  useEffect(() => { localStorage.setItem('hub_reservas_v5', JSON.stringify(reservas)); }, [reservas]);
  useEffect(() => { localStorage.setItem('hub_horarios_v5', JSON.stringify(horarios)); }, [horarios]);
  useEffect(() => { localStorage.setItem('hub_contacto_v5', JSON.stringify(contacto)); }, [contacto]);

  const addReserva = (resData: Omit<Reserva, 'id' | 'estado'>) => {
    const nuevaReserva: Reserva = {
      ...resData,
      id: Math.random().toString(36).substr(2, 9),
      estado: 'pendiente'
    };
    setReservas(prev => [...prev, nuevaReserva]);
  };

  return (
    <CMSContext.Provider value={{
      menu, setMenu,
      eventos, setEventos,
      reservas, setReservas,
      horarios, setHorarios,
      contacto, setContacto,
      addReserva
    }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const ctx = useContext(CMSContext);
  if (!ctx) throw new Error("useCMS must be used within CMSProvider");
  return ctx;
};
