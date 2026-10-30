/**
 * KATIANA Droguería Online · Cart & Checkout Controller
 */

import { store } from '../core/store.js';
import { CONFIG } from '../core/config.js';
import { formatCOP } from './catalog.js';
import { toast } from './toast.js';

export class CartController {
  constructor() {
    this.overlay = document.querySelector('#cart-overlay');
    this.drawer = document.querySelector('#cart-drawer');
    this.toggleBtns = document.querySelectorAll('[data-action="toggle-cart"]');
    this.closeBtn = document.querySelector('#cart-close-btn');
    this.itemsContainer = document.querySelector('#cart-items');
    this.badge = document.querySelector('#cart-badge-count');
    
    // Summary elements
    this.subtotalEl = document.querySelector('#cart-subtotal');
    this.discountEl = document.querySelector('#cart-discount');
    this.shippingEl = document.querySelector('#cart-shipping');
    this.totalEl = document.querySelector('#cart-total');
    
    // Free shipping bar
    this.freeShippingText = document.querySelector('#free-shipping-text');
    this.freeShippingBar = document.querySelector('#free-shipping-fill');

    // Checkout Modal
    this.checkoutModal = document.querySelector('#checkout-modal');
    this.btnOpenCheckout = document.querySelector('#btn-open-checkout');
    this.btnCheckoutWa = document.querySelector('#btn-checkout-wa');
    this.checkoutForm = document.querySelector('#checkout-form');

    this.bindEvents();
    this.render();
  }

  bindEvents() {
    store.subscribe((state) => {
      this.render();
      if (state.isCartOpen) {
        this.open();
      }
    });

    this.toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle();
      });
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.close());
    }

    // Botón abrir checkout modal
    if (this.btnOpenCheckout) {
      this.btnOpenCheckout.addEventListener('click', () => {
        const { cart } = store.getState();
        if (cart.length === 0) {
          toast.info('Carrito vacío', 'Agrega medicamentos antes de proceder al pago.');
          return;
        }
        this.close();
        this.openCheckoutModal();
      });
    }

    // Botón directo Checkout vía WhatsApp (Benchmark La Rebaja y Farmatodo)
    if (this.btnCheckoutWa) {
      this.btnCheckoutWa.addEventListener('click', () => {
        this.checkoutViaWhatsApp();
      });
    }

    // Envío del formulario de Checkout
    if (this.checkoutForm) {
      this.checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.processFinalOrder();
      });
    }
  }

  open() {
    if (this.drawer && this.overlay) {
      this.overlay.classList.add('open');
      this.drawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  close() {
    if (this.drawer && this.overlay) {
      this.overlay.classList.remove('open');
      this.drawer.classList.remove('open');
      document.body.style.overflow = '';
      store.setState({ isCartOpen: false });
    }
  }

  toggle() {
    if (this.drawer && this.drawer.classList.contains('open')) {
      this.close();
    } else {
      this.open();
    }
  }

  render() {
    const { cart } = store.getState();
    const totals = store.getCartTotals();

    // Actualizar badge del carrito
    if (this.badge) {
      this.badge.textContent = totals.count;
      this.badge.style.display = totals.count > 0 ? 'flex' : 'none';
    }

    // Actualizar barra de envío gratis
    if (this.freeShippingText && this.freeShippingBar) {
      if (totals.subtotal === 0) {
        this.freeShippingText.innerHTML = `Agrega <strong>${formatCOP(CONFIG.freeShippingThreshold)}</strong> para <strong>Envío Gratis</strong>`;
        this.freeShippingBar.style.width = '0%';
      } else if (totals.remainingForFreeShipping > 0) {
        this.freeShippingText.innerHTML = `¡Te faltan <strong>${formatCOP(totals.remainingForFreeShipping)}</strong> para <strong>Envío Gratis</strong>!`;
        this.freeShippingBar.style.width = `${totals.shippingProgress}%`;
      } else {
        this.freeShippingText.innerHTML = `🎉 <strong>¡Felicidades! Tienes Envío Gratis Express</strong>`;
        this.freeShippingBar.style.width = '100%';
      }
    }

    // Actualizar totales
    if (this.subtotalEl) this.subtotalEl.textContent = formatCOP(totals.subtotal);
    if (this.discountEl) this.discountEl.textContent = totals.discount > 0 ? `-${formatCOP(totals.discount)}` : '$0';
    if (this.shippingEl) this.shippingEl.textContent = totals.shipping === 0 ? 'GRATIS' : formatCOP(totals.shipping);
    if (this.totalEl) this.totalEl.textContent = formatCOP(totals.total);

    // Renderizar ítems
    if (!this.itemsContainer) return;

    if (cart.length === 0) {
      this.itemsContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: #64748b;">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">💊</div>
          <h4 style="color: #0f172a; font-weight: 700; margin-bottom: 0.25rem;">Tu carrito está vacío</h4>
          <p style="font-size: 0.85rem;">Explora nuestro catálogo con más de 1.000 medicamentos y dermocosmética.</p>
        </div>
      `;
      return;
    }

    this.itemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">${formatCOP(item.price)}</div>
          ${item.prescriptionRequired ? `<span style="font-size: 0.68rem; color: #b45309; font-weight: 700;">Requiere Fórmula</span>` : ''}
        </div>
        <div class="cart-item-controls">
          <div class="qty-control">
            <button class="qty-btn" data-action="decrease" data-id="${item.id}">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
          </div>
          <button class="item-remove-btn" data-action="remove" data-id="${item.id}" title="Eliminar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    `).join('');

    // Eventos de cantidad
    this.itemsContainer.querySelectorAll('[data-action="increase"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = cart.find(i => i.id === id);
        if (item) store.updateQuantity(id, item.quantity + 1);
      });
    });

    this.itemsContainer.querySelectorAll('[data-action="decrease"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = cart.find(i => i.id === id);
        if (item) store.updateQuantity(id, item.quantity - 1);
      });
    });

    this.itemsContainer.querySelectorAll('[data-action="remove"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        store.removeFromCart(id);
      });
    });
  }

  openCheckoutModal() {
    if (!this.checkoutModal) return;
    const totals = store.getCartTotals();
    const modalTotal = this.checkoutModal.querySelector('#checkout-modal-total');
    if (modalTotal) modalTotal.textContent = formatCOP(totals.total);
    this.checkoutModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  processFinalOrder() {
    const name = document.querySelector('#checkout-name')?.value;
    const phone = document.querySelector('#checkout-phone')?.value;
    const address = document.querySelector('#checkout-address')?.value;
    const payment = document.querySelector('input[name="checkout-payment"]:checked')?.value || 'Contra entrega';
    const totals = store.getCartTotals();
    const { cart, activeCity } = store.getState();

    // Simulación de pedido exitoso
    const orderNumber = 'KAT-' + Math.floor(100000 + Math.random() * 900000);

    if (this.checkoutModal) {
      this.checkoutModal.classList.remove('open');
      document.body.style.overflow = '';
    }

    toast.success(`¡Pedido ${orderNumber} Confirmado!`, `Entrega express en 45 minutos a ${address}.`);
    store.clearCart();

    // Opcional: Notificar vía WhatsApp
    const itemsText = cart.map(i => `• ${i.quantity}x ${i.name} (${formatCOP(i.price * i.quantity)})`).join('\n');
    const msg = `🏥 *PEDIDO CONFIRMADO EN DROGUERÍA KATIANA*\n` +
      `*Orden:* #${orderNumber}\n` +
      `*Cliente:* ${name}\n` +
      `*Tel:* ${phone}\n` +
      `*Ciudad:* ${activeCity}\n` +
      `*Dirección de Entrega:* ${address}\n` +
      `*Método de Pago:* ${payment}\n\n` +
      `*Medicamentos y Productos:*\n${itemsText}\n\n` +
      `*Total a Pagar:* ${formatCOP(totals.total)}\n` +
      `_Promesa de entrega: Menos de 45 minutos._`;

    const waUrl = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  }

  checkoutViaWhatsApp() {
    const { cart, activeCity } = store.getState();
    if (cart.length === 0) {
      toast.info('Carrito vacío', 'Agrega productos antes de pedir.');
      return;
    }

    const totals = store.getCartTotals();
    const itemsText = cart.map(i => `• ${i.quantity}x ${i.name} (${formatCOP(i.price * i.quantity)})`).join('\n');

    const msg = `Hola Droguería *KATIANA*, deseo pedir estos productos para entrega express en *${activeCity}*:\n\n` +
      `${itemsText}\n\n` +
      `*Subtotal:* ${formatCOP(totals.subtotal)}\n` +
      (totals.discount > 0 ? `*Descuento Club:* -${formatCOP(totals.discount)}\n` : '') +
      `*Envío:* ${totals.shipping === 0 ? 'GRATIS' : formatCOP(totals.shipping)}\n` +
      `*TOTAL:* ${formatCOP(totals.total)}\n\n` +
      `Por favor indíquenme el tiempo estimado de entrega y datos de envío. ¡Muchas gracias!`;

    const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  }
}
