# Arquitectura del Sistema · KATIANA Web

## 1. Principios de Diseño y Buenas Prácticas
1. **Zero-Dependency Core:** El frontend opera con estándares nativos de la web (HTML5 semántico, CSS3 con variables/tokens, JavaScript ES Modules). Esto garantiza cero vulnerabilidades en librerías de terceros, velocidad de carga instantánea (<1s) y compatibilidad universal.
2. **Arquitectura Desacoplada:**
   - `core/`: Configuración inmutable (`config.js`) y Store reactivo con patrón Pub/Sub y persistencia en `localStorage` (`store.js`).
   - `data/`: Catálogo farmacéutico tipificado con registros INVIMA (`products.js`).
   - `ui/`: Controladores de presentación aislados (`catalog.js`, `cart.js`, `prescription.js`, `modal.js`, `toast.js`).
   - `chat/`: Asistente virtual dual (`concierge.js`).
3. **Resiliencia Dual-Mode (Online/Offline):**
   - Si se ejecuta en **Vercel** o Node.js con variable `GEMINI_API_KEY`, el chat aprovecha la inteligencia de Google Gemini.
   - Si se aloja en **GitHub Pages** (entorno estático puro) o falla la red, el motor activa un **fallback farmacéutico local**, asegurando que ningún usuario quede sin respuesta.
4. **Accesibilidad (a11y) y SEO Clínico:**
   - Esquema JSON-LD oficial Schema.org `Pharmacy`.
   - Etiquetas ARIA (`aria-modal`, `aria-live`, `role="tablist"`).
   - Metadatos OpenGraph y etiquetas móviles optimizadas.
