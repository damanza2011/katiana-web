/**
 * KATIANA Droguería Online · Application Bootstrap
 */

import { CONFIG } from './core/config.js';
import { store } from './core/store.js';
import { CatalogController } from './ui/catalog.js';
import { CartController } from './ui/cart.js';
import { PrescriptionController } from './ui/prescription.js';
import { ConciergeChat } from './chat/concierge.js';
import { toast } from './ui/toast.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializar Controladores Principales
  const catalog = new CatalogController();
  const cart = new CartController();
  const prescription = new PrescriptionController();
  const concierge = new ConciergeChat();

  // 2. Selector de Ciudad (Bogotá, Medellín, Cali, etc.)
  const citySelectBtn = document.querySelector('#location-selector-btn');
  const cityDisplay = document.querySelector('#current-city-name');

  if (citySelectBtn && cityDisplay) {
    citySelectBtn.addEventListener('click', () => {
      const currentCity = store.getState().activeCity;
      const cityNames = CONFIG.cities.map(c => c.name);
      
      const newCity = prompt(
        `Selecciona tu ciudad para entrega Express 45 min:\n\n` + 
        cityNames.map((c, i) => `${i + 1}. ${c}`).join('\n') + 
        `\n\nEscribe el nombre de la ciudad:`, 
        currentCity
      );

      if (newCity && newCity.trim()) {
        const matched = CONFIG.cities.find(c => c.name.toLowerCase().includes(newCity.trim().toLowerCase()));
        const selected = matched ? matched.name : newCity.trim();
        store.setState({ activeCity: selected });
        cityDisplay.textContent = selected;
        toast.info('Ciudad actualizada', `Cobertura express activa para ${selected}`);
      }
    });

    // Actualizar nombre al inicio
    cityDisplay.textContent = store.getState().activeCity;
  }

  // 3. Registro al Club Katiana
  const clubForm = document.querySelector('#club-registration-form');
  const clubInput = document.querySelector('#club-document-input');

  if (clubForm && clubInput) {
    clubForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const doc = clubInput.value.trim();
      if (!doc || doc.length < 6) {
        toast.info('Documento requerido', 'Por favor ingresa un número de cédula válido.');
        return;
      }

      store.registerClubMember(doc);
      toast.success('¡Bienvenido al Club Katiana!', 'Tu 15% de descuento ha sido aplicado a tu cuenta.');
      clubInput.value = '';
    });
  }

  // 4. Preguntas Frecuentes (FAQ Accordion)
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => i.classList.remove('open'));
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });

  // 5. Botones de Acción Rápida en Hero
  const heroPrescriptionBtn = document.querySelector('#hero-btn-prescription');
  if (heroPrescriptionBtn) {
    heroPrescriptionBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prescription.open();
    });
  }

  const heroChatBtn = document.querySelector('#hero-btn-chat');
  if (heroChatBtn) {
    heroChatBtn.addEventListener('click', (e) => {
      e.preventDefault();
      concierge.open();
    });
  }

  // 6. Cerrar modales genéricos con botón data-close-modal
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  console.log(`✅ [${CONFIG.appName}] Droguería Online inicializada correctamente.`);
});
