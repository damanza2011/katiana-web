# Documentación Técnica Completa · KATIANA Droguería Online

## 1. Visión General
**KATIANA** es una plataforma de comercio electrónico farmacéutico de última generación diseñada para el mercado colombiano, concebida a partir de las mejores prácticas y fortalezas operativas de las 5 droguerías más importantes del país:
- **Farmatodo:** Velocidad y UX de entrega express en 45 minutos ("Katiana Ya") y barra de envío gratis progresivo.
- **Cruz Verde:** Módulo de formulación médica con validación de recetas, diferenciación estricta OTC vs RX y programa Club de lealtad.
- **Droguerías La Rebaja:** Vía directa con el regente farmacéutico por WhatsApp y accesibilidad en medicamentos genéricos de calidad bioequivalente.
- **Farmacias Pasteur:** Ficha técnica con Registro Sanitario INVIMA y alta especialidad en dermocosmética y reparación cutánea.
- **Cafam / Farmalisto:** Protocolo estricto de cadena de frío entre 2°C y 8°C, checkout multicanal (contra entrega, datáfono, transferencias electrónicas).

---

## 2. Estructura de Directorios

```
katiana-web/
├── .github/
│   └── workflows/
│       └── deploy.yml              # Automatización CI/CD para GitHub Pages
├── api/
│   └── chat.js                     # Serverless function con Gemini AI
├── assets/
│   ├── css/
│   │   ├── tokens.css              # Variables de diseño, colores y tipografía
│   │   ├── base.css                # Reset, utilidades, badges y botones
│   │   ├── layout.css              # Cabecera, promo top, hero y pie de página
│   │   ├── commerce.css            # Cuadrícula, tarjetas de medicamentos y carrito
│   │   ├── components.css          # Modales, formulario de fórmula, FAQs y toasts
│   │   └── chat.css                # Widget flotante y mensajes de la Dra. Katiana
│   ├── js/
│   │   ├── core/
│   │   │   ├── config.js           # Parámetros globales y umbrales de envío
│   │   │   └── store.js            # Estado reactivo y persistente en LocalStorage
│   │   ├── data/
│   │   │   └── products.js         # Catálogo clínico con códigos INVIMA reales
│   │   ├── ui/
│   │   │   ├── catalog.js          # Filtrado, ordenamiento y renderizado
│   │   │   ├── cart.js             # Carrito lateral, totales y checkout WhatsApp
│   │   │   ├── prescription.js     # Carga y validación de fórmulas médicas
│   │   │   ├── modal.js            # Controlador accesible de ventanas modales
│   │   │   └── toast.js            # Notificaciones emergentes
│   │   ├── chat/
│   │   │   └── concierge.js        # Asistente virtual con modo dual (API / Fallback)
│   │   └── main.js                 # Inicialización y cableado de eventos
│   └── img/
│       └── favicon.svg             # Emblema vectorial farmacéutico
├── docs/
│   ├── ARCHITECTURE.md             # Especificación técnica de software
│   └── BENCHMARK-TOP5.md           # Análisis comparativo con las 5 mejores droguerías
├── .env.example                    # Plantilla de variables para Vercel
├── .gitignore                      # Exclusiones de control de versiones
├── .nojekyll                       # Compatibilidad nativa de rutas en GitHub Pages
├── .vercelignore                   # Exclusiones para build en Vercel
├── DEPLOY-GITHUB-VERCEL.md         # Instrucciones paso a paso para producción
├── DOCUMENTACION.md                # Este documento técnico
├── package.json                    # Manifiesto Node.js
├── README.md                       # Resumen del proyecto
├── robots.txt                      # Directivas de rastreo para buscadores
├── site.webmanifest                # Manifiesto PWA para instalación móvil
├── sitemap.xml                     # Mapa del sitio para indexación SEO
├── start-demo.cmd                  # Ejecutable rápido para Windows
└── vercel.json                     # Configuración de cabeceras, rutas y redirecciones
```

---

## 3. Guía de Uso de Componentes

### 3.1 Catálogo y Búsqueda Predictiva
La barra de búsqueda en `header-search-input` busca de forma reactiva en tiempo real sobre cuatro dimensiones:
1. Nombre comercial (ej. *Dolex*, *Anthelios*, *Ensure*).
2. Principio activo (ej. *Paracetamol*, *Ibuprofeno*, *Loratadina*).
3. Marca o Laboratorio (ej. *MK*, *La Roche-Posay*, *Bayer*).
4. Síntomas asociados (ej. *dolor de cabeza*, *fiebre*, *alergia*, *reflujo*, *piel seca*).

### 3.2 Subir Fórmula Médica (Módulo RX)
Cumple con la reglamentación colombiana para la dispensación de medicamentos controlados. Permite:
- Arrastrar y soltar fotos o PDFs de la prescripción.
- Registro del nombre y cédula del paciente.
- Notificación y enlace automático con el equipo de regentes vía WhatsApp con los datos empaquetados.

### 3.3 Carrito y Checkout Inteligente
- Cálculo en tiempo real de subtotal, descuento del Club Katiana y envío express.
- Barra de progreso que incentiva alcanzar los $50.000 COP para el envío gratuito.
- Dos modalidades de compra: Checkout web asistido o Generador de pedido estructurado para WhatsApp.
