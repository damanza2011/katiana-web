/**
 * KATIANA Droguería Online · AI Concierge Chatbot (Dra. Katiana)
 * Funciona en modo dual: API Gemini en Vercel + Fallback Farmacéutico Local 100% offline
 */

import { CONFIG } from '../core/config.js';
import { PRODUCTS } from '../data/products.js';

export class ConciergeChat {
  constructor() {
    this.launcher = document.querySelector('#chat-launcher');
    this.box = document.querySelector('#chat-box');
    this.closeBtn = document.querySelector('#chat-close-btn');
    this.messagesContainer = document.querySelector('#chat-messages');
    this.input = document.querySelector('#chat-input');
    this.sendBtn = document.querySelector('#chat-send-btn');
    this.suggestions = document.querySelectorAll('.suggestion-pill');

    this.isOpen = false;
    this.history = [];

    this.bindEvents();
    this.addWelcomeMessage();
  }

  bindEvents() {
    if (this.launcher) {
      this.launcher.addEventListener('click', () => this.toggle());
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.sendBtn && this.input) {
      this.sendBtn.addEventListener('click', () => this.handleSend());
      this.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleSend();
        }
      });
    }

    this.suggestions.forEach(pill => {
      pill.addEventListener('click', () => {
        const query = pill.getAttribute('data-query');
        if (query) {
          if (!this.isOpen) this.open();
          this.sendMessage(query);
        }
      });
    });
  }

  open() {
    if (this.box) {
      this.box.classList.add('open');
      this.isOpen = true;
      if (this.input) this.input.focus();
    }
  }

  close() {
    if (this.box) {
      this.box.classList.remove('open');
      this.isOpen = false;
    }
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  addWelcomeMessage() {
    const welcome = `¡Hola! Soy la **Dra. Katiana**, farmacéutica orientadora digital de Droguerías KATIANA 🌿💊.

Puedo ayudarte a:
• Encontrar medicamentos de venta libre para aliviar síntomas comunes (dolor, fiebre, gripe, acidez).
• Conocer principios activos y dosis seguras de productos OTC.
• Guiarte sobre cómo subir tu fórmula médica o hacer pedidos con entrega en menos de 45 minutos.

*Recuerda: Esta orientación no reemplaza el diagnóstico médico profesional. ¿En qué te puedo colaborar hoy?*`;
    this.appendMessage('bot', welcome);
  }

  appendMessage(role, text) {
    if (!this.messagesContainer) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${role}`;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Conversión básica de markdown simple (*, **)
    let formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');

    msgDiv.innerHTML = `
      <div class="msg-bubble">${formattedText}</div>
      <span class="msg-time">${time}</span>
    `;

    this.messagesContainer.appendChild(msgDiv);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;

    this.history.push({ role, text });
  }

  async handleSend() {
    if (!this.input) return;
    const text = this.input.value.trim();
    if (!text) return;

    this.input.value = '';
    await this.sendMessage(text);
  }

  async sendMessage(userText) {
    this.appendMessage('user', userText);

    // Indicador temporal
    const typingId = 'typing-' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.id = typingId;
    typingDiv.className = 'chat-msg bot';
    typingDiv.innerHTML = `<div class="msg-bubble" style="color: #64748b;"><em>Consultando vademécum farmacéutico...</em></div>`;
    this.messagesContainer.appendChild(typingDiv);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;

    try {
      // Intentar primero endpoint API de Vercel (Gemini)
      const res = await fetch(CONFIG.apiChatEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, history: this.history })
      });

      if (res.ok) {
        const data = await res.json();
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.remove();
        this.appendMessage('bot', data.reply);
        return;
      }
    } catch (e) {
      // Si la API falla (ej. GitHub Pages estático), usar el motor farmacéutico local
    }

    // Fallback Inteligente Local
    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();

    const localReply = this.generateLocalPharmaceuticalReply(userText);
    this.appendMessage('bot', localReply);
  }

  generateLocalPharmaceuticalReply(query) {
    const q = query.toLowerCase();

    // Domicilios y Envíos
    if (q.includes('domicilio') || q.includes('envio') || q.includes('tiempo') || q.includes('cuanto demora') || q.includes('45')) {
      return `🚚 **Promesa de Entrega Express KATIANA:**
• Entregamos en menos de **45 minutos** en las principales ciudades (Bogotá, Medellín, Cali, Barranquilla, Bucaramanga, Pereira, Cartagena).
• El envío es **GRATIS** en pedidos desde **$50.000 COP**.
• Si tu pedido es menor, el valor del domicilio express es solo de **$5.500 COP**.
• Garantizamos **cadena de frío certificada** para medicamentos termolábiles e insulinas.`;
    }

    // Fórmula Médica
    if (q.includes('formula') || q.includes('receta') || q.includes('prescripcion') || q.includes('subir')) {
      return `📋 **Dispensación de Medicamentos con Fórmula Médica:**
1. Haz clic en el botón azul superior **"Subir Fórmula"**.
2. Adjunta una foto legible o PDF de tu receta (debe verse el sello médico, registro y fecha).
3. Uno de nuestros químicos regentes la verificará en 5 minutos y alistará tu pedido para despacho inmediato.
4. ¿Deseas que te contactemos por WhatsApp para coordinar tu fórmula? Puedes llamarnos al ${CONFIG.phoneDisplay}.`;
    }

    // Dolor de cabeza / Fiebre
    if (q.includes('cabeza') || q.includes('migraña') || q.includes('fiebre')) {
      return `💊 **Para Cefalea y Dolor de Cabeza / Fiebre:**
• **Acetaminofén 500mg MK:** Analgésico de primera elección y bajo impacto gástrico ($9.500 COP la caja x 50).
• **Dolex Avanzado con Optizorb:** Acción acelerada que empieza a actuar en minutos ($18.800 COP).
• *Recomendación:* Tómalo con un vaso lleno de agua. Si el dolor de cabeza es súbito, muy intenso o se acompaña de visión borrosa, acude a urgencias inmediatamente.`;
    }

    // Gripe / Resfriado / Defensas
    if (q.includes('gripe') || q.includes('resfriado') || q.includes('congestion') || q.includes('tos') || q.includes('defensas')) {
      return `🌿 **Alivio para Síntomas Gripales y Fortalecimiento:**
• **Redoxon Total (Vitamina C + D + Zinc):** Efervescente sabor naranja para elevar el sistema inmune ($33.900 COP).
• **Electrolit Suero Oral:** Indispensable para mantener hidratación adecuada durante el cuadro febril o malestar ($9.400 COP).
• *Tip farmacéutico:* Mantén reposo, buena ventilación y abundante hidratación oral.`;
    }

    // Piel / Dermocosmética / Protector Solar
    if (q.includes('piel') || q.includes('solar') || q.includes('bloqueador') || q.includes('crema') || q.includes('manchas') || q.includes('resequedad')) {
      return `✨ **Dermocosmética Clínica KATIANA:**
• **Anthelios UVMune 400 SPF 50+ (La Roche-Posay):** Máxima protección contra rayos UVA ultra largos, textura invisible ($99.000 COP).
• **CeraVe Crema Hidratante:** Con 3 ceramidas esenciales y ácido hialurónico para restaurar la barrera cutánea ($89.900 COP).
• **Cicaplast Baume B5+:** Reparador celular intensivo para piel irritada o resecada ($59.000 COP).`;
    }

    // Acidez / Gastritis
    if (q.includes('acidez') || q.includes('gastritis') || q.includes('estomago') || q.includes('reflujo')) {
      return `🩺 **Para Acidez y Molestia Gástrica:**
• **Omeprazol 20mg MK:** Reduce la producción ácida estomacal. Tomar 1 cápsula en ayunas 30 min antes del desayuno ($10.800 COP).
• *Precaución:* Evita automedicarte por más de 14 días continuos sin valoración médica para descartar causas subyacentes.`;
    }

    // Club Katiana
    if (q.includes('club') || q.includes('descuento') || q.includes('promocion') || q.includes('afiliar')) {
      return `⭐ **Club Katiana Salud & Bienestar:**
• Inscríbete gratis con tu número de cédula en la sección inferior.
• Obtén **15% a 30% de descuento** en días especiales de dermocosmética, vitaminas y medicamentos seleccionados.
• Acumulas beneficios directos en cada compra online y en droguería física.`;
    }

    // Respuesta General con sugerencias
    return `Gracias por tu consulta. En Droguerías **KATIANA** disponemos de medicamentos 100% certificados con registro INVIMA, dermocosmética premium y botiquín familiar.

Puedes preguntarme por:
1. Alivio para dolor, fiebre, gripe o acidez.
2. Cuidado dermatológico y protectores solares.
3. Cómo subir tu fórmula médica para despacho express en 45 minutos.
4. O si prefieres hablar directamente con un químico farmacéutico, contáctanos a la línea **${CONFIG.phoneDisplay}** o WhatsApp **${CONFIG.whatsappDisplay}**.`;
  }
}
