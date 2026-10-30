/**
 * KATIANA Droguería Online · Catalog & Products Controller
 */

import { PRODUCTS } from '../data/products.js';
import { store } from '../core/store.js';
import { toast } from './toast.js';

export function formatCOP(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(amount);
}

export class CatalogController {
  constructor() {
    this.grid = document.querySelector('#products-grid');
    this.searchInput = document.querySelector('#header-search-input');
    this.searchClearBtn = document.querySelector('#search-clear-btn');
    this.categoryPills = document.querySelectorAll('.cat-pill');
    this.sortSelect = document.querySelector('#sort-select');
    this.countDisplay = document.querySelector('#catalog-count-display');
    this.quickViewModal = document.querySelector('#quickview-modal');

    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // Escuchar cambios de estado en el store
    store.subscribe(() => {
      this.render();
    });

    // Filtro por búsqueda
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if (this.searchClearBtn) {
          this.searchClearBtn.style.display = val ? 'block' : 'none';
        }
        store.setState({ searchQuery: val });
      });
    }

    if (this.searchClearBtn) {
      this.searchClearBtn.addEventListener('click', () => {
        if (this.searchInput) {
          this.searchInput.value = '';
          this.searchInput.focus();
        }
        this.searchClearBtn.style.display = 'none';
        store.setState({ searchQuery: '' });
      });
    }

    // Filtro por categorías (Pills)
    this.categoryPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = pill.getAttribute('data-category');
        this.categoryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        store.setState({ activeCategory: cat });
      });
    });

    // Ordenamiento
    if (this.sortSelect) {
      this.sortSelect.addEventListener('change', (e) => {
        store.setState({ sortBy: e.target.value });
      });
    }
  }

  filterProducts() {
    const { activeCategory, searchQuery, sortBy, filterRxOnly, filterDiscountOnly } = store.getState();
    const query = searchQuery.toLowerCase().trim();

    let list = PRODUCTS.filter(prod => {
      // Categoría
      if (activeCategory !== 'todos' && prod.category !== activeCategory) {
        return false;
      }

      // Venta con fórmula
      if (filterRxOnly && !prod.prescriptionRequired) {
        return false;
      }

      // Solo descuento
      if (filterDiscountOnly && !prod.oldPrice) {
        return false;
      }

      // Búsqueda inteligente por nombre, principio activo, marca o síntomas
      if (query) {
        const matchName = prod.name.toLowerCase().includes(query);
        const matchBrand = prod.brand.toLowerCase().includes(query);
        const matchPrinciple = prod.activePrinciple.toLowerCase().includes(query);
        const matchSymptoms = prod.symptoms.some(s => s.toLowerCase().includes(query));
        if (!matchName && !matchBrand && !matchPrinciple && !matchSymptoms) {
          return false;
        }
      }

      return true;
    });

    // Ordenamiento
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }

  render() {
    if (!this.grid) return;
    const products = this.filterProducts();

    if (this.countDisplay) {
      this.countDisplay.textContent = `${products.length} productos encontrados`;
    }

    if (products.length === 0) {
      this.grid.innerHTML = `
        <div class="catalog-empty" style="grid-column: 1 / -1;">
          <div class="catalog-empty-icon">🔍</div>
          <h3>No encontramos medicamentos o productos con ese criterio</h3>
          <p>Intenta buscar por principio activo (ej. <em>Paracetamol</em>), síntoma (ej. <em>dolor de cabeza</em>) o selecciona otra categoría.</p>
          <button class="btn btn-secondary btn-sm" id="btn-reset-filters">Ver todo el catálogo</button>
        </div>
      `;
      const resetBtn = this.grid.querySelector('#btn-reset-filters');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (this.searchInput) this.searchInput.value = '';
          if (this.searchClearBtn) this.searchClearBtn.style.display = 'none';
          this.categoryPills.forEach(p => p.classList.remove('active'));
          const firstPill = document.querySelector('.cat-pill[data-category="todos"]');
          if (firstPill) firstPill.classList.add('active');
          store.setState({ activeCategory: 'todos', searchQuery: '' });
        });
      }
      return;
    }

    this.grid.innerHTML = products.map(prod => {
      const discountPercent = prod.oldPrice 
        ? Math.round(((prod.oldPrice - prod.price) / prod.oldPrice) * 100) 
        : null;

      return `
        <article class="product-card" data-id="${prod.id}">
          <div class="product-badges">
            ${discountPercent ? `<span class="badge badge-discount">-${discountPercent}%</span>` : ''}
            ${prod.prescriptionRequired ? `<span class="badge badge-rx">Fórmula Médica</span>` : `<span class="badge badge-otc">Venta Libre</span>`}
            <span class="badge badge-invima">INVIMA</span>
          </div>

          <div class="product-image-wrap">
            <img 
              src="${prod.image}" 
              alt="${prod.name}" 
              class="product-image" 
              loading="lazy"
              onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80';"
            />
          </div>

          <span class="product-category-tag">${prod.brand}</span>
          <h3 class="product-title">${prod.name}</h3>
          <div class="product-active-principle">${prod.activePrinciple}</div>
          <div class="product-presentation">${prod.presentation}</div>

          <div class="product-pricing">
            <div class="price-row">
              <span class="current-price">${formatCOP(prod.price)}</span>
              ${prod.oldPrice ? `<span class="old-price">${formatCOP(prod.oldPrice)}</span>` : ''}
            </div>
            <div class="unit-price">${prod.unitPrice}</div>
          </div>

          <div class="product-footer-actions">
            <button class="btn-add-cart" data-action="add-cart" data-id="${prod.id}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              Agregar
            </button>
            <button class="btn-quick-view" data-action="quick-view" data-id="${prod.id}" title="Ver ficha técnica e INVIMA">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </button>
          </div>
        </article>
      `;
    }).join('');

    // Eventos en tarjetas
    this.grid.querySelectorAll('[data-action="add-cart"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        const product = PRODUCTS.find(p => p.id === id);
        if (product) {
          store.addToCart(product, 1);
          toast.success('Producto agregado', `${product.name} está en tu carrito.`);
        }
      });
    });

    this.grid.querySelectorAll('[data-action="quick-view"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        const product = PRODUCTS.find(p => p.id === id);
        if (product) {
          this.openProductModal(product);
        }
      });
    });
  }

  openProductModal(product) {
    if (!this.quickViewModal) return;

    const modalBody = this.quickViewModal.querySelector('.modal-body');
    const modalTitle = this.quickViewModal.querySelector('.modal-title');

    if (modalTitle) {
      modalTitle.textContent = product.name;
    }

    if (modalBody) {
      modalBody.innerHTML = `
        <div style="display: grid; grid-template-columns: 140px 1fr; gap: 1.5rem; align-items: start; margin-bottom: 1.5rem;">
          <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc; padding: 0.5rem;" />
          <div>
            <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
              <span class="badge ${product.prescriptionRequired ? 'badge-rx' : 'badge-otc'}">
                ${product.prescriptionRequired ? 'Requiere Fórmula Médica' : 'Venta Libre (OTC)'}
              </span>
              <span class="badge badge-invima">${product.invima}</span>
            </div>
            <div style="font-size: 1.4rem; font-weight: 900; color: #0f172a; margin-bottom: 0.25rem;">${formatCOP(product.price)}</div>
            <div style="font-size: 0.82rem; color: #64748b; margin-bottom: 0.75rem;">${product.unitPrice} · ${product.presentation}</div>
            <p style="font-size: 0.9rem; color: #334155; line-height: 1.5;">${product.description}</p>
          </div>
        </div>

        <div style="background: #f1f5f9; padding: 1rem; border-radius: 8px; font-size: 0.85rem; line-height: 1.5; color: #334155;">
          <strong>Principio Activo:</strong> ${product.activePrinciple}<br>
          <strong>Laboratorio / Marca:</strong> ${product.brand}<br>
          <strong>Registro Sanitario:</strong> ${product.invima}<br>
          <strong>Conservación:</strong> Manténgase en lugar fresco y seco a temperatura inferior a 30°C.
        </div>
      `;
    }

    const modalAddBtn = this.quickViewModal.querySelector('#modal-add-cart-btn');
    if (modalAddBtn) {
      modalAddBtn.onclick = () => {
        store.addToCart(product, 1);
        toast.success('Producto agregado', `${product.name} está en tu carrito.`);
        this.quickViewModal.classList.remove('open');
        document.body.style.overflow = '';
      };
    }

    this.quickViewModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}
