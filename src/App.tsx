import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Ticket,
  User,
  Wine,
  Users,
  PlusSquare,
  AlertTriangle,
  Snowflake,
  PartyPopper,
  MessageCircle,
  Star,
  MapPin,
  Clock,
  Smartphone,
  Instagram,
  ShoppingBag,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Menu as MenuIcon,
  X
} from 'lucide-react';
import { Reservas } from './components/Reservas';
import { MenuCompleto } from './components/MenuCompleto';
import { AdminPanel } from './components/AdminPanel';
import { Eventos } from './components/Eventos';
import { useCMS } from './context/CMSContext';

const MENU_ITEMS_STATIC = [];
const MENU_CATEGORIES = ["TODO"]; // We will generate this from useCMS

export default function App() {
  const { horarios, contacto, menu, eventos } = useCMS();
  
  // Flatten menu for quick view
  const allMenuItems = menu.flatMap(cat => cat.items.map(item => ({
    id: item.id,
    title: item.name,
    price: typeof item.price === 'string' ? item.price : `$${item.price}`,
    description: item.description,
    image: item.featuredImage || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    tags: [
      item.isVeggie ? "VEGGIE" : null,
      item.isSinTacc ? "SIN TACC" : null
    ].filter(Boolean) as string[],
    categories: ["TODO", cat.title.toUpperCase()],
  })));

  const dynamicCategories = ["TODO", ...Array.from(new Set(menu.map(c => c.title.toUpperCase())))].slice(0, 5);

  const [activeCategory, setActiveCategory] = useState("TODO");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeSidebarLink, setActiveSidebarLink] = useState("#eventos");
  const [activeTopNav, setActiveTopNav] = useState("inicio");
  const [statusText, setStatusText] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState(() => {
    return window.location.pathname === '/admin' ? 'admin' : 'home';
  });
  const [menuInitialCategory, setMenuInitialCategory] = useState<string | undefined>(undefined);
  const [prefilledEvent, setPrefilledEvent] = useState<string | undefined>(undefined);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(window.location.pathname === '/admin' ? 'admin' : 'home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const updateStatus = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();
      const minutes = now.getMinutes();
      
      const isEarlyMorning = hour < 6;
      const sessionDay = isEarlyMorning ? (day === 0 ? 6 : day - 1) : day;
      
      let closingTime = "1:30 AM";
      let closingHourDecimal = 1.5;
      
      // Jueves (4), Viernes (5), Sábado (6) -> 4:00 AM
      if (sessionDay >= 4 && sessionDay <= 6) {
        closingTime = "4:00 AM";
        closingHourDecimal = 4.0;
      }

      const openingHour = 8;
      const currentTotalHours = hour + minutes / 60;
      
      let isOpen = false;
      // Is it after 8 AM today OR is it before the closing time of the session that started yesterday?
      if (currentTotalHours >= openingHour || (isEarlyMorning && currentTotalHours < closingHourDecimal)) {
        isOpen = true;
      }

      setStatusText(`Alta Córdoba · ${isOpen ? 'Abierto' : 'Cerrado'} · ${isOpen ? `Hasta las ${closingTime}` : 'Abre a las 8:00 AM'}`);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const playVideo = () => {
      if (videoRef.current) {
        videoRef.current.play().catch((e) => {
          console.warn("Autoplay still prevented:", e.message);
        });
      }
    };

    if (videoRef.current) {
      // Ensure the video is explicitly muted to increase the chance of autoplay working
      videoRef.current.muted = true;
      videoRef.current.play().catch((error) => {
        if (error.name === "NotAllowedError" || error.message.includes("user gesture")) {
          console.warn("Autoplay prevented. Waiting for user interaction to start video...");
          document.addEventListener("click", playVideo, { once: true });
          document.addEventListener("touchstart", playVideo, { once: true });
          document.addEventListener("scroll", playVideo, { once: true });
        }
      });
    }

    return () => {
      document.removeEventListener("click", playVideo);
      document.removeEventListener("touchstart", playVideo);
      document.removeEventListener("scroll", playVideo);
    };
  }, []);

  const filteredItems = allMenuItems.filter(item => item.categories.includes(activeCategory)).slice(0, 6);
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });

  useEffect(() => {
    if (sliderRef.current && containerRef.current) {
      setConstraints({
        left: -(sliderRef.current.scrollWidth - containerRef.current.offsetWidth),
        right: 0
      });
    }
  }, [activeCategory]);

  const nextMenuPage = () => {
    const visibleItems = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
    setCurrentIndex((prev) => Math.min(prev + 1, filteredItems.length - visibleItems));
  };

  const prevMenuPage = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const getSidebarClasses = (href: string) => {
    if (activeSidebarLink === href) {
      return "bg-[#02301E] text-[#F5F5DC] translate-x-4 skew-y-2 p-4 block border-y-2 border-[#F5F5DC] flex items-center shadow-[4px_4px_0px_#F5F5DC]";
    }
    return "text-[#F5F5DC] p-4 hover:translate-x-2 transition-transform hover:bg-[#F5F5DC] hover:text-[#02301E] flex items-center font-bold";
  };

  return (
    <div className="bg-[#F5F5DC] text-[#02301E] font-body-md selection:bg-[#E2725B] selection:text-[#F5F5DC]">
      {/* TopNavBar */}
      <nav className="flex justify-between items-center w-full px-6 lg:px-12 py-4 fixed top-0 z-[60] bg-[#F5F5DC] border-b-4 border-[#02301E] shadow-[8px_8px_0px_0px_#02301E]">
        <div className="flex items-center gap-8">
          <a href="#inicio" onClick={() => { setCurrentView("home"); setActiveTopNav("inicio"); }} className="cursor-pointer">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="HUB!" className="h-10 md:h-14 object-contain" />
          </a>
          <div className="hidden md:flex gap-6 font-headline-lg font-black uppercase tracking-tighter">
            <a className={`hover:-rotate-2 hover:scale-110 transition-transform duration-100 text-[16px] ${activeTopNav === "inicio" && currentView === "home" ? "text-[#E2725B] underline decoration-4 underline-offset-4" : "text-[#02301E] opacity-90"}`} href="#inicio" onClick={() => { setCurrentView("home"); setActiveTopNav("inicio"); }}>INICIO</a>
            <button className={`hover:-rotate-2 hover:scale-110 transition-transform duration-100 text-[16px] uppercase font-black tracking-tighter ${currentView === "menuCompleto" ? "text-[#E2725B] underline decoration-4 underline-offset-4" : "text-[#02301E] opacity-90"}`} onClick={() => { setMenuInitialCategory(undefined); setCurrentView("menuCompleto"); setActiveTopNav("menu"); }}>MENÚ</button>
            <button className={`hover:-rotate-2 hover:scale-110 transition-transform duration-100 text-[16px] uppercase font-black tracking-tighter ${currentView === "eventos" ? "text-[#E2725B] underline decoration-4 underline-offset-4" : "text-[#02301E] opacity-90"}`} onClick={() => { setCurrentView("eventos"); setActiveTopNav("eventos"); }}>EVENTOS</button>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={() => { setPrefilledEvent(undefined); setCurrentView("reservas"); }} className="hidden md:block px-6 py-2 border-2 border-[#02301E] bg-[#E2725B] text-[#F5F5DC] font-label-bold font-bold uppercase transition-transform hover:-translate-y-1 hover:translate-x-1 shadow-[4px_4px_0px_#02301E]">Reservar</button>
          
          <motion.a 
            href={contacto.pedix}
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center cursor-pointer overflow-hidden px-2 py-2 border-2 border-[#02301E] bg-[#E2725B] text-[#F5F5DC] transition-all hover:bg-[#F5F5DC] hover:text-[#02301E] shadow-[4px_4px_0px_#02301E] group"
            initial="initial"
            whileHover="hover"
          >
            <ShoppingCart size={24} />
            <motion.span 
              variants={{
                initial: { width: 0, opacity: 0, marginLeft: 0 },
                hover: { width: "auto", opacity: 1, marginLeft: 8 }
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="font-label-bold font-bold uppercase whitespace-nowrap text-[14px]"
            >
              Pedir
            </motion.span>
          </motion.a>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 border-2 border-[#02301E] bg-[#E2725B] text-[#F5F5DC] shadow-[4px_4px_0px_#02301E] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all">
            {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[55] bg-[#E2725B] pt-[84px] md:hidden overflow-y-auto">
          <div className="flex flex-col p-6 font-headline-lg font-black uppercase text-3xl text-[#F5F5DC] space-y-6">
            <a href="#inicio" onClick={() => { setCurrentView("home"); setActiveTopNav("inicio"); setIsMobileMenuOpen(false); }} className="hover:text-[#02301E] transition-colors">Inicio</a>
            <button onClick={() => { setMenuInitialCategory(undefined); setCurrentView("menuCompleto"); setActiveTopNav("menu"); setIsMobileMenuOpen(false); }} className="text-left hover:text-[#02301E] transition-colors">Menú General</button>
            <button onClick={() => { setCurrentView("eventos"); setActiveTopNav("eventos"); setIsMobileMenuOpen(false); }} className="text-left hover:text-[#02301E] transition-colors">Gigs & Eventos</button>
            <button onClick={() => { 
                setActiveCategory("DRINKS"); 
                setActiveSidebarLink("#menu");
                setCurrentIndex(0);
                setMenuInitialCategory("tragos");
                setCurrentView("menuCompleto");
                setActiveTopNav("menu");
                setIsMobileMenuOpen(false);
              }} className="text-left hover:text-[#02301E] transition-colors">
              Tragos
            </button>
            <a href="#origen" onClick={() => { setCurrentView("home"); setActiveTopNav("inicio"); setIsMobileMenuOpen(false); }} className="hover:text-[#02301E] transition-colors">Tribu & Origen</a>
            <a href="#contacto" onClick={() => { setCurrentView("home"); setActiveTopNav("inicio"); setIsMobileMenuOpen(false); }} className="hover:text-[#02301E] transition-colors">Encuéntranos / Unirse</a>
            <div className="pt-6 border-t border-[#F5F5DC]/30 flex flex-col gap-4">
              <button onClick={() => { setPrefilledEvent(undefined); setCurrentView("reservas"); setIsMobileMenuOpen(false); }} className="w-full py-4 border-2 border-[#02301E] bg-[#02301E] text-[#F5F5DC] text-2xl">Reservar una Mesa</button>
            </div>
          </div>
        </div>
      )}

      {/* SideNavBar */}
      <aside className={`hidden ${currentView === 'home' ? 'lg:flex' : 'lg:hidden'} fixed left-0 top-0 h-screen z-40 flex-col pt-32 w-64 border-r-4 border-[#02301E] bg-[#E2725B] shadow-[12px_0px_0px_0px_#02301E]`}>
        <div className="px-6 mb-8">
          <h2 className="text-[24px] font-black text-[#F5F5DC] font-label-mono">STAY LOUD</h2>
          <p className="font-label-mono text-[14px] uppercase text-[#F5F5DC] opacity-80">Vibe Check: High</p>
        </div>
        <nav className="flex flex-col font-label-mono font-bold text-[20px] uppercase">
          <a className={getSidebarClasses("#eventos")} href="#eventos" onClick={() => { setActiveSidebarLink("#eventos"); setCurrentView("home"); setActiveTopNav("inicio"); }}>
            <Ticket className="mr-2" size={24} /> GIGS
          </a>
          <a className={getSidebarClasses("#menu")} href="#menu" onClick={() => { setActiveSidebarLink("#menu"); setCurrentView("home"); setActiveTopNav("inicio"); }}>
            <Wine className="mr-2" size={24} /> TRAGOS
          </a>
          <a className={getSidebarClasses("#origen")} href="#origen" onClick={() => { setActiveSidebarLink("#origen"); setCurrentView("home"); setActiveTopNav("inicio"); }}>
            <Users className="mr-2" size={24} /> TRIBU
          </a>
          <a className={getSidebarClasses("#contacto")} href="#contacto" onClick={() => { setActiveSidebarLink("#contacto"); setCurrentView("home"); setActiveTopNav("inicio"); }}>
            <PlusSquare className="mr-2" size={24} /> UNIRSE
          </a>
        </nav>
      </aside>

      <main className={`${currentView === 'home' ? 'lg:ml-64' : ''} min-h-screen pt-[92px]`}>
        {currentView === "home" ? (
          <>
        {/* HERO */}
        <section id="inicio" className="relative min-h-[85vh] overflow-hidden flex items-center border-b-8 border-[#02301E] py-16">
          <video ref={videoRef} autoPlay className="absolute inset-0 w-full h-full object-cover grayscale brightness-40" loop muted playsInline>
            <source src={`${import.meta.env.BASE_URL}hero.mp4`} type="video/mp4" />
          </video>
          {/* Overlay to ensure readability */}
          <div className="absolute inset-0 bg-[#02301E]/40 md:bg-transparent md:bg-gradient-to-r md:from-[#02301E]/60 md:to-transparent z-[5]"></div>
          <div className="relative z-10 px-6 lg:px-12 max-w-5xl mx-auto text-center md:text-left pt-20 pb-20">
            <span className="font-label-mono text-[12px] md:text-[14px] bg-[#02301E] text-[#F5F5DC] px-4 py-2 mb-6 inline-block uppercase tracking-widest -rotate-2 font-medium">{statusText}</span>
            <h1 className="font-display-xl text-5xl md:text-7xl lg:text-[84px] text-[#F5F5DC] font-black uppercase leading-none drop-shadow-[6px_6px_0px_#E2725B] mb-6 tracking-tight">
              EL LUGAR QUE FUNCIONA <span className="bg-[#E2725B] text-[#F5F5DC] px-4 -rotate-2 inline-block">PARA TODO.</span>
            </h1>
            <p className="font-body-lg text-[#F5F5DC] text-[18px] md:text-[22px] max-w-2xl mb-10 opacity-90 drop-shadow-md">Desayuno, almuerzo, tragos, y noches que no terminan. Hub! es la casona donde siempre hay un lugar para vos.</p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <button onClick={() => { setPrefilledEvent(undefined); setCurrentView("reservas"); }} className="w-full sm:w-auto inline-block text-center bg-[#E2725B] text-[#F5F5DC] border-heavy px-8 md:px-12 py-4 md:py-6 font-headline-md font-extrabold text-[20px] md:text-[24px] uppercase brutalist-shadow hover:translate-y-2 hover:translate-x-2 hover:shadow-none transition-all active:translate-y-4 active:translate-x-4">
                RESERVÁ TU MESA
              </button>
              <button onClick={() => { setMenuInitialCategory(undefined); setCurrentView("menuCompleto"); setActiveTopNav("menu"); }} className="w-full sm:w-auto inline-block text-center bg-[#02301E] text-[#F5F5DC] border-heavy px-8 md:px-12 py-4 md:py-6 font-headline-md font-extrabold text-[20px] md:text-[24px] uppercase brutalist-shadow hover:translate-y-2 hover:translate-x-2 hover:shadow-none transition-all active:translate-y-4 active:translate-x-4">
                VER MENÚ
              </button>
            </div>
          </div>
        </section>

        {/* Trust Strip */}
        <section className="bg-[#02301E] py-6 px-6 lg:pl-20 xl:pl-28 lg:pr-12 border-b-4 border-[#02301E]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 font-label-mono">
            <div className="flex items-center gap-4 text-[#F5F5DC]">
              <span className="text-4xl font-black">1,000+</span>
              <span className="text-xs uppercase tracking-widest leading-tight opacity-70">reseñas en<br />Google</span>
            </div>
            <div className="h-8 w-px bg-[#E2725B] hidden md:block"></div>
            <div className="flex items-center gap-4 text-[#F5F5DC]">
              <span className="text-4xl font-black">4.9</span>
              <span className="text-xs uppercase tracking-widest leading-tight opacity-70">calificación<br />promedio</span>
            </div>
            <div className="h-8 w-px bg-[#E2725B] hidden md:block"></div>
            <div className="flex items-center gap-4 text-[#F5F5DC]">
              <span className="text-4xl font-black">+3.000</span>
              <span className="text-xs uppercase tracking-widest leading-tight opacity-70">mesas<br />compartidas</span>
            </div>
          </div>
        </section>

        {/* EL CICLO HUB */}
        <section className="py-24 px-6 lg:pl-20 xl:pl-28 lg:pr-12 overflow-hidden bg-[#F5F5DC]">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display-xl text-4xl md:text-6xl font-black uppercase mb-16 text-center leading-none tracking-tight">EL CICLO <span className="text-[#E2725B]">HUB</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-heavy brutalist-shadow">
              {/* Morning */}
              <div className="group relative overflow-hidden bg-[#F5F5DC] border-r-4 border-[#02301E] last:border-r-0 p-8 min-h-[500px] flex flex-col justify-end">
                <img alt="Morning coffee" className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale group-hover:opacity-40 transition-opacity" src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80" />
                <div className="relative z-10">
                  <span className="font-label-mono text-[12px] font-bold bg-[#E2725B] text-[#F5F5DC] px-3 py-1 mb-4 inline-block">07:00 – 13:00</span>
                  <h3 className="font-display-xl font-black text-5xl uppercase mb-4 tracking-tight">MAÑANA</h3>
                  <p className="font-body-lg text-[18px] font-bold">CAFÉ + TRABAJO</p>
                  <p className="mt-4 opacity-80 text-[16px]">Doble espresso, WiFi de verdad, y la luz de la mañana entrando por la casona. El tercer lugar que necesitabas sin darte cuenta.</p>
                </div>
              </div>
              {/* Midday */}
              <div className="group relative overflow-hidden bg-[#E2725B] text-[#F5F5DC] border-r-4 border-[#02301E] last:border-r-0 p-8 min-h-[500px] flex flex-col justify-end">
                <img alt="Midday business" className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale brightness-200 group-hover:opacity-40 transition-opacity" src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80" />
                <div className="relative z-10">
                  <span className="font-label-mono text-[12px] font-bold bg-[#02301E] text-[#F5F5DC] px-3 py-1 mb-4 inline-block">13:00 – 18:00</span>
                  <h3 className="font-display-xl font-black text-5xl uppercase mb-4 tracking-tight">MEDIODÍA</h3>
                  <p className="font-body-lg text-[18px] font-bold">ALMUERZO + PAUSA</p>
                  <p className="mt-4 opacity-90 text-[16px]">Platos para compartir, menú ejecutivo de fin de semana, y el espacio para que una reunión de trabajo se sienta humana.</p>
                </div>
              </div>
              {/* Evening */}
              <div className="group relative overflow-hidden bg-[#02301E] text-[#F5F5DC] p-8 min-h-[500px] flex flex-col justify-end">
                <img alt="Evening music" className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale group-hover:opacity-50 transition-opacity" src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80" />
                <div className="relative z-10">
                  <span className="font-label-mono text-[12px] font-bold bg-[#E2725B] text-[#F5F5DC] px-3 py-1 mb-4 inline-block">18:00 – 04:30</span>
                  <h3 className="font-display-xl font-black text-5xl uppercase mb-4 tracking-tight">NOCHE</h3>
                  <p className="font-body-lg text-[18px] font-bold">TRAGOS + MÚSICA</p>
                  <p className="mt-4 opacity-80 text-[16px]">La transición. La hora en que la cafetería muta. Eventos, fernet, y la gente que hace que valga la pena quedarse.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LO QUE SERVIMOS (Menu) */}
        <section id="menu" className="py-24 bg-[#E2725B] px-6 lg:pl-20 xl:pl-28 lg:pr-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
              <h2 className="font-display-xl text-5xl md:text-7xl font-black uppercase text-[#F5F5DC] leading-[0.8] tracking-tight">LO QUE<br />SERVIMOS</h2>
              <div className="flex flex-col md:items-end gap-6">
                <div className="flex flex-wrap gap-2 justify-end">
                  {dynamicCategories.map(category => (
                    <button 
                      key={category}
                      onClick={() => { setActiveCategory(category); setCurrentIndex(0); }}
                      className={`${activeCategory === category ? 'bg-[#02301E] text-[#F5F5DC]' : 'bg-[#F5F5DC] hover:bg-[#02301E] hover:text-[#F5F5DC]'} px-6 py-2 border-2 border-[#02301E] font-label-bold text-[14px] font-bold uppercase tracking-tighter transition-colors`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                {filteredItems.length > (window.innerWidth >= 1024 ? 3 : 1) && (
                  <div className="flex gap-2 justify-end">
                    <button onClick={prevMenuPage} className="p-2 border-2 border-[#02301E] bg-[#F5F5DC] text-[#02301E] hover:bg-[#02301E] hover:text-[#F5F5DC] transition-colors">
                      <ChevronLeft size={24} />
                    </button>
                    <button onClick={nextMenuPage} className="p-2 border-2 border-[#02301E] bg-[#F5F5DC] text-[#02301E] hover:bg-[#02301E] hover:text-[#F5F5DC] transition-colors">
                      <ChevronRight size={24} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="relative overflow-hidden" ref={containerRef}>
              <motion.div 
                ref={sliderRef}
                drag="x"
                dragConstraints={constraints}
                className="flex gap-8 cursor-grab active:cursor-grabbing pb-12"
                animate={{ 
                  x: containerRef.current 
                    ? -currentIndex * ((containerRef.current.offsetWidth + 32) / (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1)) 
                    : 0 
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                key={activeCategory}
              >
                {filteredItems.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="min-w-[calc(100%-2rem)] md:min-w-[calc(50%-1.3rem)] lg:min-w-[calc(33.333%-1.35rem)] bg-[#F5F5DC] border-heavy brutalist-shadow overflow-hidden group flex flex-col"
                  >
                    <div className="h-64 overflow-hidden border-b-4 border-[#02301E]">
                      <img alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={item.image} />
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-4 gap-4">
                        <h3 className="font-headline-md font-extrabold text-2xl uppercase leading-tight">{item.title}</h3>
                        <span className="font-headline-md font-extrabold text-xl text-[#E2725B] shrink-0">{item.price}</span>
                      </div>
                      <p className="font-body-md opacity-80 mb-6 flex-grow text-[16px]">{item.description}</p>
                      <div className="flex gap-2 flex-wrap">
                        {item.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-label-mono font-bold border-2 border-[#02301E] px-2 py-1 uppercase">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
            
            <div className="mt-8 flex justify-center">
              <button 
                onClick={() => { setMenuInitialCategory(undefined); setCurrentView("menuCompleto"); }} 
                className="inline-block bg-[#02301E] text-[#F5F5DC] px-12 py-6 font-headline-md font-extrabold text-[20px] uppercase border-[#F5F5DC] border-2 hover:-translate-y-2 hover:translate-x-2 transition-all shadow-[6px_6px_0px_#02301E] hover:shadow-none"
              >
                VER CARTA COMPLETA
              </button>
            </div>
          </div>
        </section>

        {/* EVENTS */}
        <section id="eventos" className="bg-[#02301E] py-24 px-6 lg:pl-20 xl:pl-28 lg:pr-12 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="font-display-xl text-4xl md:text-6xl font-black uppercase text-[#F5F5DC] leading-none break-words tracking-tight">ESTA SEMANA · ESTE MES · SIEMPRE</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {/* Event Flyer 1 */}
              <div className="bg-[#F5F5DC] border-heavy brutalist-shadow -rotate-1 p-4 group cursor-pointer hover:rotate-0 transition-transform h-full flex flex-col">
                <div className="bg-[#02301E] text-[#F5F5DC] font-label-mono font-bold p-1 text-center mb-4 uppercase text-[12px]">LUN 27 ABR · 21:00</div>
                <h4 className="font-headline-md font-extrabold text-2xl mb-2">OPEN MIC: ROAR</h4>
                <p className="font-body-md text-[16px] mb-6 flex-grow">Ni acústico ni amateur. La playlist nos la traés vos. Fermentados originales, Córdoba al fondo.</p>
                <div className="h-48 overflow-hidden border-2 border-[#02301E]">
                  <img alt="vintage microphone" className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all" src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=80" />
                </div>
              </div>
              {/* Event Flyer 2 */}
              <div className="bg-[#E2725B] text-[#F5F5DC] border-heavy brutalist-shadow rotate-1 p-6 group cursor-pointer hover:rotate-0 transition-transform h-full flex flex-col">
                <span className="font-label-bold uppercase text-xs font-bold text-[#02301E] block mb-4">EL RUIDO QUE TE VA A GUSTAR</span>
                <div className="border-b-2 border-[#F5F5DC] pb-4 mb-4">
                  <h4 className="font-headline-md font-extrabold text-3xl">THE NOISE PROJECT</h4>
                  <p className="font-label-bold font-bold uppercase mt-2">VIE 28 ABR · 23:00</p>
                </div>
                <p className="font-body-md opacity-90 mb-8 flex-grow text-[16px]">Rock desde las entrañas. Formaciones rotativas, así que preguntá quién toca. Reservá antes — se llena.</p>
                <button onClick={() => { setPrefilledEvent(undefined); setCurrentView("reservas"); }} className="w-full py-2 border-2 border-[#F5F5DC] font-headline-md font-extrabold uppercase hover:bg-[#F5F5DC] hover:text-[#02301E] transition-all text-lg text-center block">RESERVAR LUGAR</button>
              </div>
              {/* Event Flyer 3 */}
              <div className="bg-[#F5F5DC] border-heavy brutalist-shadow -rotate-1 lg:rotate-1 p-4 group cursor-pointer hover:rotate-0 transition-transform h-full flex flex-col">
                <div className="flex justify-between font-label-mono font-bold mb-4 border-b border-[#02301E] pb-2 text-[12px]">
                  <span>CADA MARTES</span>
                  <span>20:00</span>
                </div>
                <h4 className="font-headline-md font-extrabold text-2xl uppercase border-b-2 border-[#02301E] py-2 mb-4">CHESS & TEQUILA</h4>
                <p className="font-body-md text-[16px] flex-grow">Partidas rápidas, liquid courage, y el ambiente que hace que pierdas con estilo. Mirá los rankings.</p>
                <div className="mt-8 bg-[#02301E] text-[#F5F5DC] p-2 text-center font-label-mono font-bold uppercase text-[12px]">Unite al tablero</div>
              </div>
            </div>
            {/* Agenda CTA */}
            <div className="mt-24 text-center">
              <div className="inline-block bg-[#E2725B] border-heavy p-8 md:p-12 brutalist-shadow-terracotta -rotate-1 max-w-2xl">
                <h3 className="font-headline-md font-extrabold text-[#F5F5DC] text-3xl mb-4 uppercase">SUMATE A LA AGENDA HUB</h3>
                <p className="font-body-md text-[#F5F5DC] opacity-90 mb-8 text-[18px]">Recibí los eventos del mes antes que nadie. Por WhatsApp, sin spam.</p>
                <a href="#contacto" className="inline-block text-center bg-[#02301E] text-[#F5F5DC] px-10 py-4 font-label-bold font-bold uppercase hover:scale-105 transition-transform text-[16px]">SUSCRIBIRSE</a>
              </div>
            </div>
          </div>
        </section>

        {/* LAS PERSONAS (Origin) */}
        <section id="origen" className="py-24 px-6 lg:pl-20 xl:pl-28 lg:pr-12 bg-[#F5F5DC] border-t-8 border-[#02301E] overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              <div className="lg:col-span-5">
                <span className="font-label-mono text-[#E2725B] text-[14px] font-bold uppercase tracking-widest mb-4 block">LAS PERSONAS</span>
                <h2 className="font-display-xl font-black text-4xl sm:text-5xl uppercase text-[#02301E] leading-tight mb-8 tracking-tight">HUB! NO NACIÓ EN UNA<br /><span className="text-[#E2725B]">SALA DE REUNIONES.</span></h2>
                <p className="font-body-lg text-[18px] md:text-xl mb-10 leading-relaxed">Somos seis amigos que nos cansamos de elegir entre 'café tranquilo' o 'bar de noche'. Quisimos que el lugar existiera a las 2 PM y a las 2 AM. No éramos gastronómicos. Éramos un dolor de cabeza que se convirtió en un hogar. Sin trajes corporativos, sin inversores, sin que nadie nos dijera exactamente cuánto importa el tueste perfecto o el bassline correcto. Solo seis personas que se cuidan demasiado el uno al otro para que esto sea mediocre.</p>
                <div className="flex flex-wrap gap-4">
                  <a href="#origen" className="inline-block text-center bg-[#02301E] text-[#F5F5DC] px-8 py-4 font-label-bold font-bold uppercase -rotate-2 hover:rotate-0 transition-transform">OUR STORY</a>
                  <a href="#contacto" className="inline-block text-center bg-[#E2725B] text-[#F5F5DC] px-8 py-4 font-label-bold font-bold uppercase rotate-1 hover:rotate-0 transition-transform">SEGUINOS</a>
                </div>
              </div>
              <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-6 relative">
                {/* Portrait 1 */}
                <div className="bg-white p-2 border-2 border-[#02301E] -rotate-2 shadow-[4px_4px_0px_#02301E] group hover:rotate-0 hover:scale-105 transition-all flex flex-col">
                  <div className="aspect-square overflow-hidden bg-gray-200 border border-[#02301E]">
                    <img alt="Franco" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" />
                  </div>
                  <div className="pt-3 pb-1 px-1">
                    <p className="font-label-bold font-bold text-[14px] uppercase text-[#02301E]">Franco</p>
                    <p className="text-[10px] uppercase opacity-60 font-bold font-label-mono">Gestión</p>
                  </div>
                </div>
                {/* Portrait 2 */}
                <div className="bg-white p-2 border-2 border-[#02301E] rotate-1 shadow-[4px_4px_0px_#02301E] group hover:rotate-0 hover:scale-105 transition-all md:translate-y-4 flex flex-col">
                  <div className="aspect-square overflow-hidden bg-gray-200 border border-[#02301E]">
                    <img alt="Luciano" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80" />
                  </div>
                  <div className="pt-3 pb-1 px-1">
                    <p className="font-label-bold font-bold text-[14px] uppercase text-[#02301E]">Luciano</p>
                    <p className="text-[10px] uppercase opacity-60 font-bold font-label-mono">Sistemas</p>
                  </div>
                </div>
                {/* Portrait 3 */}
                <div className="bg-white p-2 border-2 border-[#02301E] -rotate-3 shadow-[4px_4px_0px_#02301E] group hover:rotate-0 hover:scale-105 transition-all flex flex-col">
                  <div className="aspect-square overflow-hidden bg-gray-200 border border-[#02301E]">
                    <img alt="Nacho" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" src="https://images.unsplash.com/photo-1530268729831-4b0b9e170218?auto=format&fit=crop&w=400&q=80" />
                  </div>
                  <div className="pt-3 pb-1 px-1">
                    <p className="font-label-bold font-bold text-[14px] uppercase text-[#02301E]">Nacho</p>
                    <p className="text-[10px] uppercase opacity-60 font-bold font-label-mono">Marketing</p>
                  </div>
                </div>
                {/* Portrait 4 */}
                <div className="bg-white p-2 border-2 border-[#02301E] rotate-2 shadow-[4px_4px_0px_#02301E] group hover:rotate-0 hover:scale-105 transition-all flex flex-col">
                  <div className="aspect-square overflow-hidden bg-gray-200 border border-[#02301E]">
                    <img alt="Sofi" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" />
                  </div>
                  <div className="pt-3 pb-1 px-1">
                    <p className="font-label-bold font-bold text-[14px] uppercase text-[#02301E]">Sofi</p>
                    <p className="text-[10px] uppercase opacity-60 font-bold font-label-mono">Hospitalidad</p>
                  </div>
                </div>
                {/* Portrait 5 */}
                <div className="bg-white p-2 border-2 border-[#02301E] -rotate-1 shadow-[4px_4px_0px_#02301E] group hover:rotate-0 hover:scale-105 transition-all md:-translate-y-4 flex flex-col">
                  <div className="aspect-square overflow-hidden bg-gray-200 border border-[#02301E]">
                    <img alt="Mateo" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80" />
                  </div>
                  <div className="pt-3 pb-1 px-1">
                    <p className="font-label-bold font-bold text-[14px] uppercase text-[#02301E]">Mateo</p>
                    <p className="text-[10px] uppercase opacity-60 font-bold font-label-mono">Música & Vibe</p>
                  </div>
                </div>
                {/* Portrait 6 */}
                <div className="bg-white p-2 border-2 border-[#02301E] rotate-3 shadow-[4px_4px_0px_#02301E] group hover:rotate-0 hover:scale-105 transition-all flex flex-col">
                  <div className="aspect-square overflow-hidden bg-gray-200 border border-[#02301E]">
                    <img alt="Santi" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80" />
                  </div>
                  <div className="pt-3 pb-1 px-1">
                    <p className="font-label-bold font-bold text-[14px] uppercase text-[#02301E]">Santi</p>
                    <p className="text-[10px] uppercase opacity-60 font-bold font-label-mono">Operaciones</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LO QUE DICE LA GENTE (Social Proof) */}
        <section className="py-24 px-6 lg:pl-20 xl:pl-28 lg:pr-12 bg-[#02301E] overflow-hidden border-t-8 border-[#02301E]">
          <div className="max-w-7xl mx-auto">
            <span className="font-label-mono text-[#F5F5DC] font-bold text-[14px] uppercase tracking-widest text-center mb-4 block">LO QUE DICE LA GENTE</span>
            <h2 className="font-display-xl font-black text-5xl md:text-6xl uppercase text-[#F5F5DC] text-center mb-16 leading-none tracking-tight">VIBRAS DE <span className="text-[#E2725B]">VERDAD</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
              {/* Review 1 */}
              <div className="bg-[#F5F5DC] border-heavy p-8 rotate-1 hover:rotate-0 transition-transform cursor-default h-full flex flex-col justify-between shadow-[8px_8px_0px_0px_#E2725B]">
                <div>
                  <div className="flex text-[#E2725B] mb-6">
                    <Star fill="currentColor" size={20} className="mr-1" /><Star fill="currentColor" size={20} className="mr-1" /><Star fill="currentColor" size={20} className="mr-1" /><Star fill="currentColor" size={20} className="mr-1" /><Star fill="currentColor" size={20} className="mr-1" />
                  </div>
                  <p className="font-body-md mb-6 italic text-lg leading-relaxed font-semibold">"Pasé una hora trabajando en un rincón, pedí el café más rico del barrio, y sin querer me quedé cuatro. Estoy bastante seguro de que me adopté a mí mismo."</p>
                </div>
                <p className="font-label-bold font-bold text-sm text-[#02301E] border-t-2 border-[#02301E] pt-4">— María R. · Google Reseñas</p>
              </div>
              {/* Review 2 */}
              <div className="bg-[#E2725B] text-[#F5F5DC] border-heavy p-8 -rotate-1 hover:rotate-0 transition-transform cursor-default h-full flex flex-col justify-between shadow-[8px_8px_0px_0px_#02301E]">
                <div>
                  <div className="mb-6 flex items-center gap-3">
                    <span className="bg-[#02301E] p-1.5"><MessageCircle size={20} color="#F5F5DC" /></span>
                    <span className="font-label-bold font-bold text-sm tracking-widest">@GONZALO_F_CBA</span>
                  </div>
                  <p className="font-body-md mb-8 font-bold leading-relaxed text-[16px]">"Vine por el 'sushi libre' sin saber qué esperar. Esto va a sonar dramático pero: cambió mis planes para la noche. Sushi como es en su salsa. Pedí el Midnight Mezcal de yapa."</p>
                </div>
                <p className="font-label-bold font-bold text-[12px] uppercase tracking-tighter opacity-80 border-t border-[#F5F5DC] pt-4">— Gonzalo F. · Google Reseñas</p>
              </div>
              {/* Review 3 */}
              <div className="bg-[#F5F5DC] border-heavy p-8 rotate-2 hover:rotate-0 transition-transform cursor-default h-full flex flex-col justify-between shadow-[8px_8px_0px_0px_#E2725B]">
                <div>
                  <p className="font-headline-md font-extrabold text-[20px] mb-6 uppercase leading-tight text-[#02301E]">"EL RUIDO ES SUFICIENTE PARA DESORDENARTE LA CABEZA UN POCO."</p>
                  <p className="font-body-md text-[16px] mb-8 leading-relaxed font-semibold">El ambiente es exactamente para eso. Y el staff, buenísimo. No van a pretender que están bien cuando no.</p>
                </div>
                <p className="font-label-bold font-bold text-sm border-t-2 border-[#02301E] pt-4">— Lucas M. · Google Reseñas</p>
              </div>
              {/* Review Badge */}
              <div className="bg-[#E2725B] text-[#F5F5DC] border-heavy p-8 md:p-12 -rotate-1 hover:rotate-0 transition-transform cursor-default text-center lg:col-span-3 mt-4 shadow-[8px_8px_0px_0px_#02301E]">
                <span className="font-display-xl font-black text-6xl md:text-[84px] block mb-4 tracking-tighter">10/10</span>
                <p className="font-label-bold font-bold uppercase text-[12px] md:text-[14px] tracking-widest leading-loose max-w-2xl mx-auto">Puntaje perfecto en ambiente, atención y relación precio-calidad — tres veces seguidas.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ELEGÍ TU LUGAR (Sectors) */}
        <section className="py-24 px-6 lg:pl-20 xl:pl-28 lg:pr-12 bg-[#F5F5DC] border-t-8 border-[#02301E]">
          <div className="max-w-7xl mx-auto">
            <span className="font-label-mono font-bold text-[#E2725B] text-[14px] uppercase tracking-widest mb-4 block">ELEGÍ TU LUGAR</span>
            <h2 className="font-display-xl font-black text-5xl sm:text-6xl uppercase text-[#02301E] mb-16 leading-[0.85] tracking-tight">ENCUENTRA TU<br /><span className="text-[#E2725B]">SECTOR</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Sector 1: Terraza */}
              <div className="relative bg-[#E2725B] border-heavy p-8 brutalist-shadow-terracotta flex flex-col h-full rotate-1 hover:rotate-0 transition-transform group">
                <div className="flex justify-between items-start mb-8">
                  <h3 className="font-display-xl font-black text-4xl text-[#F5F5DC] leading-none tracking-tight">TERRAZA</h3>
                  <span className="bg-[#02301E] text-[#F5F5DC] text-[10px] font-label-mono font-black px-3 py-1 uppercase tracking-widest">ABIERTA</span>
                </div>
                <p className="text-[#F5F5DC] font-body-md text-[16px] mb-10 flex-grow opacity-90 leading-relaxed font-semibold">Al aire libre, arquitectura histórica. Ideal para grupos de 2 a 8. El ruido llega pero el cielo también. Nuestra recomendación para noches de semana.</p>
                <div className="mb-10 space-y-3">
                  <p className="text-[10px] font-label-mono font-black uppercase text-[#02301E] flex items-center gap-2 bg-[#F5F5DC] p-2 inline-block shadow-[2px_2px_0px_#02301E]"><AlertTriangle className="text-xs w-4 h-4" /> En noches de evento música fuerte desde las 22:00</p>
                </div>
                <button onClick={() => { setPrefilledEvent(undefined); setCurrentView("reservas"); }} className="w-full block text-center bg-[#02301E] text-[#F5F5DC] py-4 font-headline-md font-extrabold uppercase text-xl hover:translate-x-1 hover:-translate-y-1 transition-transform border-2 border-[#F5F5DC]">SELECCIONÁ EL SECTOR</button>
              </div>
              {/* Sector 2: Hall */}
              <div className="relative bg-[#02301E] border-heavy p-8 brutalist-shadow flex flex-col h-full -rotate-1 hover:rotate-0 transition-transform group">
                <div className="flex justify-between items-start mb-8">
                  <h3 className="font-display-xl font-black text-4xl text-[#F5F5DC] leading-none tracking-tight">HALL</h3>
                  <span className="bg-[#E2725B] text-[#F5F5DC] text-[10px] font-label-mono font-black px-3 py-1 uppercase tracking-widest">CLIMATIZADO</span>
                </div>
                <p className="text-[#F5F5DC] font-body-md text-[16px] mb-10 flex-grow opacity-90 leading-relaxed font-semibold">Ambiente interior, demencia acústica controlada & diseño. Para grupos medianos o reuniones de trabajo con algo de onda. Nuestra sala más versátil.</p>
                <div className="mb-10 space-y-3">
                  <p className="text-[10px] font-label-mono font-black uppercase text-[#E2725B] flex items-center gap-2 bg-[#1a1c1a] p-2 inline-block shadow-[2px_2px_0px_#E2725B]"><Snowflake className="text-xs w-4 h-4" /> Climatizado</p>
                </div>
                <button onClick={() => { setPrefilledEvent(undefined); setCurrentView("reservas"); }} className="w-full block text-center bg-[#E2725B] text-[#F5F5DC] py-4 font-headline-md font-extrabold uppercase text-xl hover:translate-x-1 hover:-translate-y-1 transition-transform border-2 border-[#02301E]">RESERVAR</button>
              </div>
              {/* Sector 3: Evento Privado */}
              <div className="relative bg-[#F5F5DC] border-heavy p-8 brutalist-shadow flex flex-col h-full rotate-2 hover:rotate-0 transition-transform group">
                <div className="flex justify-between items-start mb-8">
                  <h3 className="font-display-xl font-black text-4xl text-[#02301E] leading-none tracking-tight">PRIVATE</h3>
                  <span className="bg-[#E2725B] text-[#F5F5DC] text-[10px] font-label-mono font-black px-3 py-1 uppercase tracking-widest">EVENTOS</span>
                </div>
                <p className="text-[#02301E] font-body-md text-[16px] mb-10 flex-grow opacity-90 leading-relaxed font-semibold">Cumpleaños, corporativo, cierre de año. Menú armado a medida, iluminación personalizada, y el equipo que hace que no tengas que pensar en nada. Traé la gente.</p>
                <div className="mb-10 space-y-3">
                  <p className="text-[10px] font-label-mono font-black uppercase text-[#E2725B] flex items-center gap-2 border-2 border-[#E2725B] p-2 inline-block shadow-[2px_2px_0px_#E2725B]"><PartyPopper className="text-xs w-4 h-4" /> Full Takeover</p>
                </div>
                <button onClick={() => { setPrefilledEvent(undefined); setCurrentView("reservas"); }} className="w-full block text-center bg-[#02301E] text-[#F5F5DC] py-4 font-headline-md font-extrabold uppercase text-xl hover:translate-x-1 hover:-translate-y-1 transition-transform">CONSULTAR</button>
              </div>
            </div>
          </div>
        </section>

        {/* FIND US */}
        <section id="contacto" className="bg-[#E2725B] py-24 px-6 lg:pl-20 xl:pl-28 lg:pr-12 border-t-8 border-[#02301E]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-display-xl font-black text-[32px] sm:text-5xl lg:text-7xl uppercase text-[#02301E] mb-12 leading-[0.85] tracking-tight">ENCUÉNTRANOS</h2>
                
                <div className="space-y-8 font-body-md text-[#F5F5DC] text-[18px]">
                  <div className="flex items-start gap-4">
                    <MapPin className="text-[#02301E] mt-1" size={28} />
                    <div>
                      <p className="font-bold text-[#02301E] font-label-mono uppercase tracking-widest text-[14px] mb-1">Dirección</p>
                      <p className="font-semibold">Mariano Fragueiro 2151, Córdoba.</p>
                      <p className="opacity-80 text-[14px]">La casona con la puerta roja. No hay cartel.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 border-t border-[#F5F5DC]/30 pt-8">
                    <Clock className="text-[#02301E] mt-1" size={28} />
                    <div>
                      <p className="font-bold text-[#02301E] font-label-mono uppercase tracking-widest text-[14px] mb-2">Horarios</p>
                      <ul className="space-y-2 font-semibold">
                        <li className="flex justify-between w-64 border-b border-[#02301E]/20 pb-1"><span>Lun — Jue</span> <span>07:00 - 02:00</span></li>
                        <li className="flex justify-between w-64 border-b border-[#02301E]/20 pb-1 text-[#02301E] font-black"><span>Vie — Sáb</span> <span>07:00 - 04:30</span></li>
                        <li className="flex justify-between w-64 pt-1"><span>Domingo</span> <span>10:00 - 02:00</span></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex flex-wrap gap-4">
                  <a href={`https://wa.me/${contacto.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex-1 min-w-[200px] bg-[#02301E] text-[#F5F5DC] px-6 py-4 font-label-mono text-[14px] font-bold uppercase hover:-translate-y-1 hover:translate-x-1 transition-transform border-2 border-[#02301E] flex items-center justify-center gap-2 shadow-[4px_4px_0px_#F5F5DC]">
                    <Smartphone size={20} /> WHATSAPP
                  </a>
                  <a href={contacto.instagram} target="_blank" rel="noreferrer" className="flex-1 min-w-[200px] bg-[#F5F5DC] text-[#02301E] px-6 py-4 font-label-mono text-[14px] font-bold uppercase hover:-translate-y-1 hover:translate-x-1 transition-transform border-2 border-[#02301E] flex items-center justify-center gap-2 shadow-[4px_4px_0px_#02301E]">
                    <Instagram size={20} /> INSTAGRAM
                  </a>
                  <a href={contacto.pedix} target="_blank" rel="noreferrer" className="flex-[2] min-w-[200px] bg-[#E2725B] text-[#02301E] px-6 py-4 font-label-mono text-[14px] font-bold uppercase hover:bg-[#F5F5DC] hover:-translate-y-1 hover:translate-x-1 transition-all border-2 border-[#02301E] flex items-center justify-center gap-2 shadow-[4px_4px_0px_#02301E]">
                    <ShoppingBag size={20} /> PEDÍ ONLINE
                  </a>
                </div>
              </div>

              <div className="h-[400px] lg:h-[500px] bg-[#F5F5DC] border-heavy brutalist-shadow rotate-1 p-2">
                <iframe 
                  src="https://maps.google.com/maps?q=Mariano%20Fragueiro%202151%2C%20C%C3%B3rdoba&t=&z=16&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }}
                  allowFullScreen={false} 
                  loading="lazy"
                  title="Ubicación de HUB!"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
        </>
        ) : currentView === "reservas" ? (
          <Reservas onBack={() => { setCurrentView("home"); window.scrollTo(0,0); }} initialEventInfo={prefilledEvent} />
        ) : currentView === "admin" ? (
          <AdminPanel onBack={() => { setCurrentView("home"); window.history.pushState({}, '', '/'); window.scrollTo(0,0); }} />
        ) : currentView === "eventos" ? (
          <Eventos 
            onBack={() => { setCurrentView("home"); window.scrollTo(0,0); }} 
            onReservar={(prefilledInfo) => {
              setPrefilledEvent(prefilledInfo);
              setCurrentView("reservas");
              window.scrollTo(0,0);
            }} 
          />
        ) : (
          <MenuCompleto onBack={() => { setCurrentView("home"); window.scrollTo(0,0); }} initialCategory={menuInitialCategory} />
        )}
      </main>

      {/* FOOTER */}
      <footer className={`${currentView === 'home' ? 'lg:ml-64' : ''} bg-[#02301E] text-[#F5F5DC] pt-16 pb-8 border-t-8 border-[#02301E]`}>
        <div className="max-w-7xl mx-auto px-6 lg:pl-20 xl:pl-28 lg:pr-12 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand & Blurb */}
            <div className="lg:col-span-1">
              <h3 className="font-display-xl text-5xl font-black italic tracking-tighter drop-shadow-[4px_4px_0px_#E2725B] mb-6">HUB!</h3>
              <p className="font-body-md opacity-80 text-[16px] leading-relaxed">
                El tercer lugar que necesitabas. Café de especialidad de día, tragos de autor y música cuando cae el sol. No somos gastronómicos, somos tu tribu.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-label-mono font-bold text-[14px] uppercase tracking-widest text-[#E2725B] mb-6">Explorar</h4>
              <ul className="space-y-4 font-label-mono text-[16px] uppercase font-bold">
                <li><button onClick={() => { setCurrentView("eventos"); setActiveTopNav("eventos"); }} className="hover:text-[#E2725B] transition-colors flex items-center gap-2"><Ticket size={16} /> Gigs & Eventos</button></li>
                <li><button onClick={() => { setMenuInitialCategory(undefined); setCurrentView("menuCompleto"); setActiveTopNav("menu"); }} className="hover:text-[#E2725B] transition-colors flex items-center gap-2"><Wine size={16} /> Carta & Tragos</button></li>
                <li><a href="#origen" onClick={() => { setCurrentView("home"); setActiveTopNav("inicio"); }} className="hover:text-[#E2725B] transition-colors flex items-center gap-2"><Users size={16} /> Sobre HUB!</a></li>
                <li><a href="#contacto" onClick={() => { setCurrentView("home"); setActiveTopNav("inicio"); }} className="hover:text-[#E2725B] transition-colors flex items-center gap-2"><PlusSquare size={16} /> Trabaja aquí</a></li>
              </ul>
            </div>

            {/* Contact & Hours */}
            <div>
              <h4 className="font-label-mono font-bold text-[14px] uppercase tracking-widest text-[#E2725B] mb-6">Encuéntranos</h4>
              <ul className="space-y-4 font-body-md text-[16px]">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-1 shrink-0 text-[#E2725B]" size={20} />
                  <span className="opacity-90">{contacto.direccion}<br/>{contacto.textoGuia}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-1 shrink-0 text-[#E2725B]" size={20} />
                  <span className="opacity-90 text-[14px]">
                    Lun: {horarios.lunes}<br/>
                    Mar: {horarios.martes}<br/>
                    Mié: {horarios.miercoles}<br/>
                    Jue: {horarios.jueves}<br/>
                    Vie: {horarios.viernes}<br/>
                    Sáb: {horarios.sabado}<br/>
                    Dom: {horarios.domingo}
                  </span>
                </li>
              </ul>
            </div>

            {/* Socials */}
            <div>
              <h4 className="font-label-mono font-bold text-[14px] uppercase tracking-widest text-[#E2725B] mb-6">Conecta</h4>
              <div className="flex flex-col gap-4">
                <a href={contacto.instagram} target="_blank" rel="noreferrer" className="bg-[#E2725B] text-[#F5F5DC] border-2 border-[#02301E] px-4 py-3 font-label-mono font-bold text-[14px] uppercase flex items-center gap-3 w-fit hover:shadow-[4px_4px_0px_0px_#F5F5DC] hover:-translate-y-1 hover:translate-x-1 transition-all">
                  <Instagram size={20} /> @hub.cordoba
                </a>
                <a href={`https://wa.me/${contacto.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="bg-[#F5F5DC] text-[#02301E] border-2 border-[#02301E] px-4 py-3 font-label-mono font-bold text-[14px] uppercase flex items-center gap-3 w-fit hover:shadow-[4px_4px_0px_0px_#E2725B] hover:-translate-y-1 hover:translate-x-1 transition-all">
                  <Smartphone size={20} /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee effect */}
        <div className="w-full bg-[#E2725B] text-[#02301E] py-4 mb-16 whitespace-nowrap overflow-hidden border-y-4 border-[#02301E]">
          <div className="animate-marquee inline-block font-display-xl font-black text-2xl uppercase tracking-tighter">
            &nbsp;STAY LOUD · THE NOISE PROJECT · HIGHER VIBES · ALTA CÓRDOBA · STAY LOUD · THE NOISE PROJECT · HIGHER VIBES · ALTA CÓRDOBA · STAY LOUD · THE NOISE PROJECT · HIGHER VIBES · ALTA CÓRDOBA ·
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:pl-20 xl:pl-28 lg:pr-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-[#F5F5DC]/20 font-label-mono text-[12px] uppercase tracking-widest font-bold opacity-70">
            <p>© {new Date().getFullYear()} HUB! CÓRDOBA.</p>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#" className="hover:text-[#E2725B] transition-colors">Términos</a>
              <a href="#" className="hover:text-[#E2725B] transition-colors">Privacidad</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
