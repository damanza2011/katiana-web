/**
 * KATIANA Droguería Online · Global State Store
 */

import { CONFIG } from './config.js';

class Store {
  constructor() {
    this.subscribers = new Set();
    this.state = this.loadInitialState();
  }

  loadInitialState() {
    try {
      const savedCart = localStorage.getItem('katiana_cart');
      const savedCity = localStorage.getItem('katiana_city');
      const savedClub = localStorage.getItem('katiana_club_member');

      return {
        cart: savedCart ? JSON.parse(savedCart) : [],
        activeCity: savedCity || CONFIG.cities[0].name,
        isClubMember: savedClub === 'true',
        clubDocument: localStorage.getItem('katiana_club_doc') || '',
        activeCategory: 'todos',
        searchQuery: '',
        filterRxOnly: false,
        filterDiscountOnly: false,
        sortBy: 'popular',
        isCartOpen: false,
        uploadedPrescription: null
      };
    } catch (e) {
      console.warn('Error reading from localStorage', e);
      return {
        cart: [],
        activeCity: CONFIG.cities[0].name,
        isClubMember: false,
        clubDocument: '',
        activeCategory: 'todos',
        searchQuery: '',
        filterRxOnly: false,
        filterDiscountOnly: false,
        sortBy: 'popular',
        isCartOpen: false,
        uploadedPrescription: null
      };
    }
  }

  getState() {
    return this.state;
  }

  setState(partial) {
    this.state = { ...this.state, ...partial };
    this.saveState();
    this.notify();
  }

  saveState() {
    try {
      localStorage.setItem('katiana_cart', JSON.stringify(this.state.cart));
      localStorage.setItem('katiana_city', this.state.activeCity);
      localStorage.setItem('katiana_club_member', this.state.isClubMember ? 'true' : 'false');
      localStorage.setItem('katiana_club_doc', this.state.clubDocument || '');
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify() {
    for (const callback of this.subscribers) {
      callback(this.state);
    }
  }

  // --- Acciones de Carrito ---
  addToCart(product, quantity = 1) {
    const cart = [...this.state.cart];
    const existingIndex = cart.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        ...product,
        quantity
      });
    }

    this.setState({ cart, isCartOpen: true });
  }

  updateQuantity(productId, newQty) {
    if (newQty <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const cart = this.state.cart.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: newQty };
      }
      return item;
    });

    this.setState({ cart });
  }

  removeFromCart(productId) {
    const cart = this.state.cart.filter(item => item.id !== productId);
    this.setState({ cart });
  }

  clearCart() {
    this.setState({ cart: [] });
  }

  // --- Totales y Cálculos ---
  getCartTotals() {
    const subtotal = this.state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Descuento de Club si es miembro (15%)
    const discount = this.state.isClubMember ? Math.round(subtotal * (CONFIG.clubDiscountPercent / 100)) : 0;
    
    // Envío gratis si supera el umbral ($50.000 COP)
    const effectiveSubtotal = subtotal - discount;
    const shipping = (effectiveSubtotal >= CONFIG.freeShippingThreshold || effectiveSubtotal === 0) 
      ? 0 
      : CONFIG.shippingCostStandard;

    const total = effectiveSubtotal + shipping;
    const remainingForFreeShipping = Math.max(0, CONFIG.freeShippingThreshold - effectiveSubtotal);
    const shippingProgress = Math.min(100, Math.round((effectiveSubtotal / CONFIG.freeShippingThreshold) * 100));

    return {
      subtotal,
      discount,
      shipping,
      total,
      count,
      remainingForFreeShipping,
      shippingProgress
    };
  }

  // --- Club Katiana ---
  registerClubMember(documentNumber) {
    if (!documentNumber || documentNumber.trim().length < 6) return false;
    this.setState({
      isClubMember: true,
      clubDocument: documentNumber.trim()
    });
    return true;
  }
}

export const store = new Store();
