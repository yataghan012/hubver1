import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Leaf, WheatOff, ShoppingBag } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

interface MenuCompletoProps {
  onBack: () => void;
  initialCategory?: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  isSinTacc?: boolean;
  isVeggie?: boolean;
  featuredImage?: string;
}

interface MenuCategory {
  id: string;
  title: string;
  items: MenuItem[];
}

const _OLD_MENU_DATA: MenuCategory[] = [
  {
    id: 'desayunos',
    title: 'Desayunos & Meriendas',
    items: [
      {
        id: 'desayuno-1',
        name: 'Avocado Toast',
        description: 'Tostada de pan de masa madre, palta pisada con lima, huevo escalfado y cherrys confitados.',
        price: '$8.000',
        isVeggie: true,
        featuredImage: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'desayuno-2',
        name: 'Tostado Clásico Hub',
        description: 'Pan de molde, jamón cocido natural y queso danbo fundido.',
        price: '$7.500'
      },
      {
        id: 'desayuno-3',
        name: 'Huevos Revueltos',
        description: 'Huevos de campo revueltos, panceta dorada y tostadas de campo.',
        price: '$9.000',
        isSinTacc: true
      },
      {
        id: 'desayuno-4',
        name: 'Bowl Fresh',
        description: 'Yogurt natural, granola casera, miel y frutas de estación.',
        price: '$7.500',
        isVeggie: true
      }
    ]
  },
  {
    id: 'burgers',
    title: 'Smash Burgers',
    items: [
      {
        id: 'burger-1',
        name: 'Double Cheese Onion',
        description: 'Doble medallón smash (100g c/u), doble cheddar, cebolla crispy y salsa especial.',
        price: '$12.000',
        featuredImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'burger-2',
        name: 'Oklahoma Smash',
        description: 'Doble carne smasheada sobre cebolla pluma, cheddar y panceta picada.',
        price: '$13.000'
      },
      {
        id: 'burger-3',
        name: 'Bacon Egg',
        description: 'Doble carne, cheddar, panceta ahumada, huevo a la plancha y salsa BBQ.',
        price: '$14.000'
      },
      {
        id: 'burger-4',
        name: 'Veggie NotBurger',
        description: 'Medallón NotCo, cheddar (opcional vegano), lechuga capuchina, tomate y mayo vegana.',
        price: '$12.500',
        isVeggie: true
      }
    ]
  },
  {
    id: 'tablas',
    title: 'Tablas para Compartir',
    items: [
      {
        id: 'tabla-1',
        name: 'Tabla Clásica Hub',
        description: 'Rabas provenzal, bastones de muzzarella, papas con cheddar y panceta, y empanaditas de carne.',
        price: '$25.000',
        featuredImage: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'tabla-2',
        name: 'Tabla Picada',
        description: 'Selección de quesos, salame de colonia, jamón crudo, aceitunas y hogaza de pan casero.',
        price: '$28.000'
      },
      {
        id: 'tabla-3',
        name: 'Nachos Chingones',
        description: 'Nachos de maíz bañados en queso fundido, guacamole fresco, pico de gallo y frijoles negros.',
        price: '$18.000',
        isVeggie: true,
        isSinTacc: true
      },
      {
        id: 'tabla-4',
        name: 'Papas Hub',
        description: 'Papas rústicas fritas, abundante pulled pork BBQ, queso fundido y verdeo fresco.',
        price: '$16.000',
        isSinTacc: true
      }
    ]
  },
  {
    id: 'principales',
    title: 'Principales',
    items: [
      {
        id: 'prin-1',
        name: 'Bondiola Braseada con Cremoso de Zapallo',
        description: 'Bondiola de cerdo en cocción lenta durante 8 horas, jugos de cocción y puré cremoso de zapallo cabutia.',
        price: '$20.000',
        isSinTacc: true,
        featuredImage: 'https://images.unsplash.com/photo-1621510427909-5a58b9f06cc2?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'prin-2',
        name: 'Bife de Chorizo Hub',
        description: 'Corte tradicional de 350g, papas rústicas, chimichurri serrano y ensaladita fresca.',
        price: '$25.000',
        isSinTacc: true
      },
      {
        id: 'prin-3',
        name: 'Salmón con Manteca de Hierbas',
        description: 'Lomo de salmón rosado sellado, manteca de hierbas y vegetales de estación asados.',
        price: '$30.000',
        isSinTacc: true
      },
      {
        id: 'prin-4',
        name: 'Risotto de Hongos',
        description: 'Arroz carnaroli mantecado, variedad de hongos de pino y portobellos, parmesano estacionado.',
        price: '$18.500',
        isVeggie: true,
        isSinTacc: true
      }
    ]
  },
  {
    id: 'postres',
    title: 'Postres',
    items: [
      {
        id: 'postre-1',
        name: 'Chocotorta Clásica',
        description: 'La receta de siempre, bien húmeda. Galletitas Chocolinas, dulce de leche y mendicrim.',
        price: '$7.000',
        featuredImage: 'https://images.unsplash.com/photo-1605807646983-377bc5a76493?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'postre-2',
        name: 'Panqueques de Dulce de Leche',
        description: 'Dos panqueques rellenos con extra dulce de leche, quemados con azúcar y bocha de helado de americana.',
        price: '$7.000',
        isVeggie: true
      },
      {
        id: 'postre-3',
        name: 'Flan con Dulce de Leche',
        description: 'Flan casero mixto con abundante dulce de leche y crema chantilly.',
        price: '$7.000',
        isVeggie: true,
        isSinTacc: true
      }
    ]
  },
  {
    id: 'cafe',
    title: 'Café de Especialidad',
    items: [
      {
        id: 'cafe-1',
        name: 'Flat White',
        description: 'Doble ristretto y leche sedosa. Perfecto balance.',
        price: '$3.500',
        isVeggie: true,
        isSinTacc: true,
        featuredImage: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'cafe-2',
        name: 'Espresso',
        description: 'Un shot intenso y aromático de nuestro blend especial.',
        price: '$2.500',
        isVeggie: true,
        isSinTacc: true
      },
      {
        id: 'cafe-3',
        name: 'Latte Macchiato',
        description: 'Leche texturizada coronada con un espresso.',
        price: '$3.800',
        isVeggie: true,
        isSinTacc: true
      },
      {
        id: 'cafe-4',
        name: 'Capuccino Italiano',
        description: 'Espresso, leche vaporizada y abundante espuma.',
        price: '$3.800',
        isVeggie: true,
        isSinTacc: true
      }
    ]
  },
  {
    id: 'tragos',
    title: 'Tragos & Botellas',
    items: [
      {
        id: 'trago-1',
        name: 'Fernet Branca + 2 Coca',
        description: 'El clásico cordobés: fernecito Branca con Coca-Cola para armar en mesa.',
        price: '$55.000',
        featuredImage: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'trago-2',
        name: 'Combo Vodka Sernova + 4 Speed',
        description: 'Ideal para la previa. Vodka de suavidad extrema con la energía de Speed.',
        price: '$32.000'
      },
      {
        id: 'trago-3',
        name: 'Combo Absolut + 4 Speed',
        description: 'Combo premium. Variedades Raspberry, Mango o Vainilla.',
        price: '$70.000'
      },
      {
        id: 'trago-4',
        name: 'Champán Salentein + 4 Speed',
        description: 'Un clásico sofisticado con burbujas que realzan cualquier momento.',
        price: '$30.000'
      },
      {
        id: 'trago-5',
        name: 'Jagger + 4 Speed (o Schweppes)',
        description: 'Pura energía: Jägermeister con Speed o jugo de pomelo.',
        price: '$70.000'
      },
      {
        id: 'trago-6',
        name: 'Spirito Blu Gin + 2 Tónicas',
        description: 'Gin nacional bien refrescante para compartir.',
        price: '$29.000'
      },
      {
        id: 'trago-7',
        name: 'Botella Patagonia 730ml',
        description: 'Cerveza artesanal perfecta para los amantes de sabores únicos (Amber Lager, Weisse).',
        price: '$11.500'
      },
      {
        id: 'trago-8',
        name: 'Vermú Carpano Rosso + Soda',
        description: 'La botella de Carpano lista para mezclar con soda y el cítrico que pidas.',
        price: '$23.500'
      }
    ]
  }
];

export const MenuCompleto: React.FC<MenuCompletoProps> = ({ onBack, initialCategory }) => {
  const { menu: MENU_DATA, contacto } = useCMS();
  const [activeToggleSinTacc, setActiveToggleSinTacc] = useState(false);
  const [activeToggleVeggie, setActiveToggleVeggie] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(initialCategory || (MENU_DATA.length > 0 ? MENU_DATA[0].id : ''));

  useEffect(() => {
    if (initialCategory) {
      setActiveSection(initialCategory);
    } else if (MENU_DATA.length > 0 && !MENU_DATA.find(c => c.id === activeSection)) {
      setActiveSection(MENU_DATA[0].id);
    }
  }, [initialCategory, MENU_DATA, activeSection]);

  const observerRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    // Scroll to top when mounted
    window.scrollTo(0, 0);
  }, []);

  const handleNavClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveSection(id);
  };

  return (
    <div className="bg-[#1c1a18] min-h-screen font-body-md text-[#F5F5DC]">
      
      {/* Header */}
      <div className="bg-[#02301E] pt-8 lg:pt-16 px-6 lg:pl-20 xl:pl-28 lg:pr-12 pb-8 border-b-8 border-[#E2725B] sticky top-0 md:relative z-[70] md:z-10">
        <div className="max-w-5xl mx-auto">
          <button 
            onClick={onBack}
            className="mb-8 inline-flex items-center gap-2 font-label-mono font-bold text-[#F5F5DC] uppercase tracking-widest hover:-translate-x-2 transition-transform"
          >
            <ArrowLeft size={20} />
            Volver
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="font-display-xl text-5xl md:text-7xl font-black uppercase text-[#E2725B] tracking-tight leading-none mb-2">LA CARTA</h1>
              <p className="font-body-md text-lg opacity-80 uppercase tracking-widest font-bold">Auténtico. Real. Cordobés.</p>
            </div>
            
            {/* Toggles */}
            <div className="flex flex-wrap items-center gap-4">
              <a 
                href={contacto.pedix} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-3 px-8 py-4 border-2 border-[#E2725B] bg-[#E2725B] text-[#F5F5DC] uppercase font-label-mono text-[16px] font-black transition-all hover:-translate-y-1 hover:translate-x-1 shadow-[6px_6px_0px_0px_#02301E] active:shadow-none active:translate-x-0 active:translate-y-0"
              >
                <ShoppingBag size={20} /> Pedir Online
              </a>
              <button 
                onClick={() => setActiveToggleSinTacc(!activeToggleSinTacc)}
                className={`flex items-center gap-2 px-4 py-2 border-2 uppercase font-label-mono text-[12px] font-bold transition-colors ${
                  activeToggleSinTacc ? 'bg-[#E2725B] border-[#E2725B] text-[#F5F5DC]' : 'border-[#F5F5DC]/30 text-[#F5F5DC]/70 hover:border-[#F5F5DC]'
                }`}
              >
                <WheatOff size={16} /> Sin TACC
              </button>
              <button 
                onClick={() => setActiveToggleVeggie(!activeToggleVeggie)}
                className={`flex items-center gap-2 px-4 py-2 border-2 uppercase font-label-mono text-[12px] font-bold transition-colors ${
                  activeToggleVeggie ? 'bg-[#02301E] border-[#F5F5DC] text-[#F5F5DC] shadow-[2px_2px_0px_0px_#F5F5DC]' : 'border-[#F5F5DC]/30 text-[#F5F5DC]/70 hover:border-[#F5F5DC]'
                }`}
              >
                <Leaf size={16} /> Veggie
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Categories Navigation */}
      <div className="sticky top-[92px] z-[50] bg-[#1c1a18] border-b border-[#F5F5DC]/20 shadow-xl overflow-x-auto scroolbar-hide">
        <ul className="flex max-w-5xl mx-auto px-6 lg:pl-20 xl:pl-28 lg:pr-12 py-4 gap-6 min-w-max overflow-x-auto">

          {MENU_DATA.map(cat => {
            return (
              <li key={cat.id}>
                <a 
                  href={`#${cat.id}`}
                  onClick={(e) => handleNavClick(cat.id, e)}
                  className={`font-label-mono text-[14px] uppercase font-bold tracking-wider px-2 py-1 border-b-2 transition-colors cursor-pointer ${
                    activeSection === cat.id ? 'border-[#E2725B] text-[#E2725B]' : 'border-transparent text-[#F5F5DC]/70 hover:text-[#F5F5DC]'
                  }`}
                >
                  {cat.title}
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Menu Content */}
      <div className="max-w-5xl mx-auto px-6 lg:pl-20 xl:pl-28 lg:pr-12 py-12 space-y-24 min-h-[50vh]">
        {MENU_DATA.filter(category => category.id === activeSection).map((category) => {
          // Filter items based on active toggles
          let filteredItems = category.items;
          if (activeToggleSinTacc) filteredItems = filteredItems.filter(item => item.isSinTacc);
          if (activeToggleVeggie) filteredItems = filteredItems.filter(item => item.isVeggie);

          if (filteredItems.length === 0) {
            return (
              <div key={category.id} className="text-center py-24 animate-in fade-in zoom-in-95 duration-500">
                <p className="font-headline-md text-2xl uppercase text-[#F5F5DC]/50 font-bold mb-4">No hay platos en esta categoría que coincidan con los filtros.</p>
                <button 
                  onClick={() => { setActiveToggleSinTacc(false); setActiveToggleVeggie(false); }}
                  className="text-[#E2725B] underline decoration-2 underline-offset-4 font-label-mono font-bold uppercase transition-colors hover:text-[#F5F5DC]"
                >
                  Limpiar filtros
                </button>
              </div>
            );
          }

          const anchorItem = filteredItems.find(i => i.featuredImage) || filteredItems[0];
          const otherItems = filteredItems.filter(i => i.id !== anchorItem.id);

          return (
            <section 
              key={category.id} 
              id={category.id} 
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <h2 className="font-display-xl text-4xl md:text-5xl uppercase text-[#E2725B] border-b-4 border-[#02301E] pb-4 mb-12 tracking-tight">
                {category.title}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
                
                {/* Featured / Anchor Item */}
                <div className="md:col-span-5 bg-[#02301E] border-2 border-[#02301E] shadow-[8px_8px_0px_0px_#E2725B] overflow-hidden group">
                  {anchorItem.featuredImage ? (
                    <div className="h-64 sm:h-80 w-full overflow-hidden border-b-2 border-[#02301E]">
                      <img 
                        src={anchorItem.featuredImage} 
                        alt={anchorItem.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                    </div>
                  ) : (
                    <div className="h-4 w-full bg-[#E2725B]"></div>
                  )}
                  <div className="p-6 md:p-8">
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <h3 className="font-headline-md font-extrabold text-2xl uppercase leading-none text-[#F5F5DC]">
                        {anchorItem.name}
                      </h3>
                    </div>
                    <p className="font-body-md text-[16px] text-[#F5F5DC]/80 mb-6 leading-snug">
                      {anchorItem.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex gap-2">
                        {anchorItem.isVeggie && <span className="bg-[#F5F5DC] text-[#02301E] px-2 py-1 font-label-mono text-[10px] uppercase font-black">Veggie</span>}
                        {anchorItem.isSinTacc && <span className="bg-[#E2725B] text-[#F5F5DC] px-2 py-1 font-label-mono text-[10px] uppercase font-black">Sin TACC</span>}
                      </div>
                      <span className="font-headline-md font-black text-2xl text-[#E2725B]">{anchorItem.price}</span>
                    </div>
                  </div>
                </div>

                {/* Other Items */}
                <div className="md:col-span-7 grid grid-cols-1 gap-6">
                  {otherItems.map(item => (
                    <div key={item.id} className="border-b border-[#F5F5DC]/20 pb-6 flex flex-col justify-center hover:bg-[#F5F5DC]/5 p-4 -mx-4 rounded-sm transition-colors">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <h4 className="font-headline-md font-bold text-xl uppercase text-[#F5F5DC]">
                          {item.name}
                        </h4>
                        <span className="font-headline-md font-black text-xl text-[#E2725B] whitespace-nowrap">
                          {item.price}
                        </span>
                      </div>
                      <p className="font-body-md text-[15px] text-[#F5F5DC]/70 mb-3 max-w-[85%]">
                        {item.description}
                      </p>
                      <div className="flex gap-2">
                        {item.isVeggie && <span className="border border-[#F5F5DC]/40 text-[#F5F5DC]/80 px-2 py-0.5 font-label-mono text-[10px] uppercase font-bold">Veggie</span>}
                        {item.isSinTacc && <span className="border border-[#E2725B]/60 text-[#E2725B] px-2 py-0.5 font-label-mono text-[10px] uppercase font-bold">Sin TACC</span>}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
