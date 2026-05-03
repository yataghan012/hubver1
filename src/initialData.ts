import { MenuCategory } from './context/CMSContext';

export const INITIAL_MENU_DATA: MenuCategory[] = [
  {
    id: 'desayunos',
    title: 'Desayunos & Meriendas',
    items: [
      { id: 'desayuno-1', name: 'Avocado Toast', description: 'Tostada de pan de masa madre, palta pisada con lima, huevo escalfado y cherrys confitados.', price: '$8.000', isVeggie: true, featuredImage: 'https://images.unsplash.com/photo-1525351484163-7529414344d8' },
      { id: 'desayuno-2', name: 'Tostado Clásico Hub', description: 'Pan de molde, jamón cocido natural y queso danbo fundido.', price: '$7.500', featuredImage: 'https://images.unsplash.com/photo-1475090169767-40ed8d18f67d' },
      { id: 'desayuno-3', name: 'Huevos Revueltos', description: 'Huevos de campo revueltos, panceta dorada y tostadas de campo.', price: '$9.000', isSinTacc: true, featuredImage: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543' },
      { id: 'desayuno-4', name: 'Bowl Fresh', description: 'Yogurt natural, granola casera, miel y frutas de estación.', price: '$7.500', isVeggie: true, featuredImage: 'https://images.unsplash.com/photo-1488477181946-6428a0291777' }
    ]
  },
  {
    id: 'burgers',
    title: 'Smash Burgers',
    items: [
      { id: 'burger-1', name: 'Double Cheese Onion', description: 'Doble medallón smash (100g c/u), doble cheddar, cebolla crispy y salsa especial.', price: '$12.000', featuredImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd' },
      { id: 'burger-2', name: 'Oklahoma Smash', description: 'Doble carne smasheada sobre cebolla pluma, cheddar y panceta picada.', price: '$13.000', featuredImage: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5' },
      { id: 'burger-3', name: 'Bacon Egg', description: 'Doble carne, cheddar, panceta ahumada, huevo a la plancha y salsa BBQ.', price: '$14.000', featuredImage: 'https://images.unsplash.com/photo-1553979459-d2229ba7443b' },
      { id: 'burger-4', name: 'Veggie NotBurger', description: 'Medallón NotCo, cheddar (opcional vegano), lechuga capuchina, tomate y mayo vegana.', price: '$12.500', isVeggie: true, featuredImage: 'https://images.unsplash.com/photo-1520072959219-c595dc870360' }
    ]
  },
  {
    id: 'tablas',
    title: 'Tablas para Compartir',
    items: [
      { id: 'tabla-1', name: 'Tabla Clásica Hub', description: 'Rabas provenzal, bastones de muzzarella, papas con cheddar y panceta, y empanaditas de carne.', price: '$25.000', featuredImage: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586' },
      { id: 'tabla-2', name: 'Tabla Picada', description: 'Selección de quesos, salame de colonia, jamón crudo, aceitunas y hogaza de pan casero.', price: '$28.000', featuredImage: 'https://images.unsplash.com/photo-1631515243349-e1cb75fffa1b' },
      { id: 'tabla-3', name: 'Nachos Chingones', description: 'Nachos de maíz bañados en queso fundido, guacamole fresco, pico de gallo y frijoles negros.', price: '$18.000', isVeggie: true, isSinTacc: true, featuredImage: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d' },
      { id: 'tabla-4', name: 'Papas Hub', description: 'Papas rústicas fritas, abundante pulled pork BBQ, queso fundido y verdeo fresco.', price: '$16.000', isSinTacc: true, featuredImage: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877' }
    ]
  },
  {
    id: 'tragos',
    title: 'Tragos',
    items: [
      { id: 'drink-1', name: 'Hub! Signature', description: 'Gin artesanal, almíbar de pomelo, jugo de lima fresco, bitter de lavanda y tónica premium.', price: '$7.500', featuredImage: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80' },
      { id: 'drink-2', name: 'Smoked Negroni', description: 'Campari, Gin London Dry, Vermouth Rosso y un toque de humo de romero en mesa.', price: '$8.500', featuredImage: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87' },
      { id: 'drink-3', name: 'Tropical Spritz', description: 'Aperol, maracuyá fresco, espumante extra brut, golpe de soda y naranja.', price: '$7.500', featuredImage: 'https://images.unsplash.com/photo-1560512823-829485b8bf24' },
      { id: 'drink-4', name: 'Gin Tonic Royale', description: 'Gin de autor, tónica premium, pepino fresco y pimienta rosa macerada.', price: '$7.200', featuredImage: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a' }
    ]
  },
  {
    id: 'principales',
    title: 'Principales',
    items: [
      { id: 'prin-1', name: 'Bondiola Braseada con Cremoso de Zapallo', description: 'Bondiola de cerdo en cocción lenta durante 8 horas, jugos de cocción y puré cremoso de zapallo cabutia.', price: '$20.000', isSinTacc: true, featuredImage: 'https://images.unsplash.com/photo-1544025162-d76694265947' },
      { id: 'prin-2', name: 'Bife de Chorizo Hub', description: 'Corte tradicional de 350g, papas rústicas, chimichurri serrano y ensaladita fresca.', price: '$22.000', isSinTacc: true, featuredImage: 'https://images.unsplash.com/photo-1546241072-48010ad2862c' },
      { id: 'prin-3', name: 'Sorrentinos de Calabaza y Queso Azul', description: 'Masa casera suave, rellenos de calabaza asada y queso azul, con crema de salvia.', price: '$18.500', isVeggie: true, featuredImage: 'https://images.unsplash.com/photo-1551462147-ff49076bb548' }
    ]
  },
  {
    id: 'pizzas',
    title: 'Pizzas (Masa Madre)',
    items: [
      { id: 'pizza-1', name: 'Pizza Margherita', description: 'Salsa de tomates italianos, fior di latte, albahaca fresca y aceite de oliva.', price: '$15.000', isVeggie: true, featuredImage: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002' },
      { id: 'pizza-2', name: 'Pizza Pepperoni', description: 'Salsa de tomates, fior di latte y rodajas finas de pepperoni de primera calidad.', price: '$17.000', featuredImage: 'https://images.unsplash.com/photo-1628840042765-356cda07504e' },
      { id: 'pizza-3', name: 'Pizza Cuatro Quesos', description: 'Blend de quesos: provolone, roquefort, fior di latte y parmesano estacionado.', price: '$18.000', isVeggie: true, featuredImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591' }
    ]
  },
  {
    id: 'cervezas',
    title: 'Cerveza Tirada',
    items: [
      { id: 'cerveza-1', name: 'Pinta APA', description: 'Cerveza artesanal American Pale Ale, refrescante con notas cítricas y amargor medio.', price: '$4.500', featuredImage: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13' },
      { id: 'cerveza-2', name: 'Pinta IPA', description: 'Cerveza artesanal India Pale Ale, fuerte presencia de lúpulo, notas a frutas tropicales.', price: '$4.500', featuredImage: 'https://images.unsplash.com/photo-1584225065152-4a1454aa3d4e' },
      { id: 'cerveza-3', name: 'Pinta Honey', description: 'Cerveza suave con agregado de miel de la zona, final dulce y agradable.', price: '$4.500', featuredImage: 'https://images.unsplash.com/photo-1571767454098-246b94fbcf70' }
    ]
  },
  {
    id: 'sin-alcohol',
    title: 'Bebidas Sin Alcohol',
    items: [
      { id: 'na-1', name: 'Limonada Hub!', description: 'Jugo de limón sutil exprimido, menta fresca, almíbar simple y hielo picado.', price: '$4.000', featuredImage: 'https://images.unsplash.com/photo-1523472721958-978152f4d69b' },
      { id: 'na-2', name: 'Pomelada Rosada', description: 'Jugo de pomelo rosado, romero ahumado, soda y hielo.', price: '$4.000', featuredImage: 'https://images.unsplash.com/photo-1560512823-829485b8bf24' },
      { id: 'na-3', name: 'Café Espresso', description: 'Blend especial de granos brasileros y colombianos tostados en Origen.', price: '$2.500', featuredImage: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04' }
    ]
  }
];
