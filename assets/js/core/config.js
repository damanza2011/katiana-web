/**
 * KATIANA Droguería Online · Configuración Global
 */

export const CONFIG = {
  appName: 'KATIANA',
  legalName: 'Droguerías KATIANA S.A.S.',
  nit: '901.845.210-4',
  slogan: 'Tu Droguería de Confianza, Salud a Domicilio 24/7',
  
  // Canales de Contacto Directo
  whatsapp: '573105559090',
  whatsappDisplay: '+57 310 555 9090',
  phone: '6017459000',
  phoneDisplay: '(601) 745-9000',
  email: 'contacto@katiana.com.co',
  regentPharmacist: 'Dra. María Elena Gómez · Regente Certificada Univ. Nacional #R-4892',

  // Reglas Comerciales y Logísticas
  currency: 'COP',
  freeShippingThreshold: 50000, // Envíos gratis a partir de $50.000 COP
  shippingCostStandard: 5500,   // Costo de domicilio express
  expressDeliveryMinutes: 45,   // Promesa de entrega en menos de 45 minutos

  // Ciudades con Cobertura Express
  cities: [
    { id: 'bogota', name: 'Bogotá D.C.', express: true },
    { id: 'medellin', name: 'Medellín & Valle de Aburrá', express: true },
    { id: 'cali', name: 'Cali', express: true },
    { id: 'barranquilla', name: 'Barranquilla', express: true },
    { id: 'bucaramanga', name: 'Bucaramanga', express: true },
    { id: 'pereira', name: 'Pereira & Eje Cafetero', express: true },
    { id: 'cartagena', name: 'Cartagena', express: true }
  ],

  // Categorías Principales de Farmacia
  categories: [
    { id: 'todos', label: 'Todos los Productos', icon: 'pill' },
    { id: 'medicamentos-rx', label: 'Fórmula Médica', icon: 'file-text' },
    { id: 'medicamentos-otc', label: 'Venta Libre (OTC)', icon: 'shield-check' },
    { id: 'dermocosmetica', label: 'Dermocosmética', icon: 'sparkles' },
    { id: 'nutricion', label: 'Vitaminas & Nutrición', icon: 'heart-pulse' },
    { id: 'bebes', label: 'Bebé & Maternidad', icon: 'baby' },
    { id: 'cuidado-personal', label: 'Cuidado Personal', icon: 'smile' },
    { id: 'botiquin', label: 'Botiquín & Primeros Auxilios', icon: 'plus-square' }
  ],

  // Descuento Exclusivo Club Katiana
  clubDiscountPercent: 15,

  // Endpoint IA
  apiChatEndpoint: '/api/chat'
};
