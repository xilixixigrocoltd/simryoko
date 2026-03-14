/**
 * Shopping Cart Manager
 * Handles cart operations, persistence, and calculations
 */

// Cart event types
export const CartEvents = {
  ITEM_ADDED: 'cart:item_added',
  ITEM_REMOVED: 'cart:item_removed',
  ITEM_UPDATED: 'cart:item_updated',
  CART_CLEARED: 'cart:cleared',
  CART_SYNCED: 'cart:synced'
};

// Cart storage key
const CART_STORAGE_KEY = 'esim_cart';
const CART_MAX_ITEMS = 20;

/**
 * Cart Manager Class
 */
class CartManager {
  constructor(options = {}) {
    this.storageKey = options.storageKey || CART_STORAGE_KEY;
    this.maxItems = options.maxItems || CART_MAX_ITEMS;
    this.listeners = new Map();
    
    // Load initial cart from storage
    this.cart = this._loadFromStorage();
    
    // Sync across tabs
    this._setupStorageSync();
  }

  /**
   * Subscribe to cart events
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    
    // Return unsubscribe function
    return () => this.listeners.get(event).delete(callback);
  }

  /**
   * Emit event to listeners
   */
  _emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  /**
   * Load cart from localStorage
   */
  _loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.items || [];
      }
    } catch (e) {
      console.warn('Failed to load cart from storage:', e);
    }
    return [];
  }

  /**
   * Save cart to localStorage
   */
  _saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify({
        items: this.cart,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn('Failed to save cart to storage:', e);
    }
  }

  /**
   * Sync cart across browser tabs
   */
  _setupStorageSync() {
    window.addEventListener('storage', (e) => {
      if (e.key === this.storageKey && e.newValue) {
        try {
          const newCart = JSON.parse(e.newValue).items || [];
          this.cart = newCart;
          this._emit(CartEvents.CART_SYNCED, { items: newCart });
        } catch (err) {
          console.warn('Failed to sync cart:', err);
        }
      }
    });
  }

  /**
   * Add item to cart
   */
  addItem(packageData, quantity = 1) {
    // Check max items limit
    const existingIndex = this.cart.findIndex(item => item.id === packageData.id);
    
    if (existingIndex === -1 && this.cart.length >= this.maxItems) {
      throw new Error(`Cart is full. Maximum ${this.maxItems} items allowed.`);
    }

    if (existingIndex > -1) {
      // Update quantity
      this.cart[existingIndex] = {
        ...this.cart[existingIndex],
        quantity: this.cart[existingIndex].quantity + quantity,
        itemTotal: (this.cart[existingIndex].quantity + quantity) * packageData.price
      };
      this._emit(CartEvents.ITEM_UPDATED, this.cart[existingIndex]);
    } else {
      // Add new item
      const newItem = {
        id: packageData.id,
        name: packageData.name,
        price: packageData.price,
        currency: packageData.currency || 'USD',
        data: packageData.data,
        dataUnit: packageData.dataUnit,
        country: packageData.country,
        countryCode: packageData.countryCode,
        carrier: packageData.carrier,
        validity: packageData.validity,
        validityUnit: packageData.validityUnit,
        quantity,
        itemTotal: packageData.price * quantity,
        addedAt: Date.now()
      };
      
      this.cart.push(newItem);
      this._emit(CartEvents.ITEM_ADDED, newItem);
    }

    this._saveToStorage();
    return this.getCart();
  }

  /**
   * Remove item from cart
   */
  removeItem(packageId) {
    const removedItem = this.cart.find(item => item.id === packageId);
    this.cart = this.cart.filter(item => item.id !== packageId);
    
    if (removedItem) {
      this._emit(CartEvents.ITEM_REMOVED, removedItem);
    }
    
    this._saveToStorage();
    return this.getCart();
  }

  /**
   * Update item quantity
   */
  updateQuantity(packageId, quantity) {
    if (quantity <= 0) {
      return this.removeItem(packageId);
    }

    const itemIndex = this.cart.findIndex(item => item.id === packageId);
    if (itemIndex > -1) {
      this.cart[itemIndex] = {
        ...this.cart[itemIndex],
        quantity,
        itemTotal: quantity * this.cart[itemIndex].price
      };
      
      this._emit(CartEvents.ITEM_UPDATED, this.cart[itemIndex]);
      this._saveToStorage();
    }
    
    return this.getCart();
  }

  /**
   * Clear cart
   */
  clear() {
    this.cart = [];
    this._emit(CartEvents.CART_CLEARED, {});
    this._saveToStorage();
    return this.getCart();
  }

  /**
   * Get current cart
   */
  getCart() {
    return {
      items: [...this.cart],
      itemCount: this.cart.reduce((sum, item) => sum + item.quantity, 0),
      total: this.cart.reduce((sum, item) => sum + item.itemTotal, 0),
      formattedTotal: this._formatPrice(
        this.cart.reduce((sum, item) => sum + item.itemTotal, 0)
      )
    };
  }

  /**
   * Get item by ID
   */
  getItem(packageId) {
    return this.cart.find(item => item.id === packageId) || null;
  }

  /**
   * Check if item exists in cart
   */
  hasItem(packageId) {
    return this.cart.some(item => item.id === packageId);
  }

  /**
   * Get item quantity in cart
   */
  getItemQuantity(packageId) {
    const item = this.cart.find(item => item.id === packageId);
    return item ? item.quantity : 0;
  }

  /**
   * Get total item count
   */
  getItemCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * Get cart total
   */
  getTotal() {
    return this.cart.reduce((sum, item) => sum + item.itemTotal, 0);
  }

  /**
   * Format price
   */
  _formatPrice(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  }

  /**
   * Get cart summary for checkout
   */
  getCheckoutSummary() {
    const cart = this.getCart();
    
    return {
      items: cart.items,
      itemCount: cart.itemCount,
      subtotal: cart.total,
      tax: cart.total * 0.0, // No tax for digital goods
      total: cart.total,
      formattedSubtotal: this._formatPrice(cart.total),
      formattedTotal: this._formatPrice(cart.total)
    };
  }

  /**
   * Apply promo code (placeholder)
   */
  async applyPromoCode(code) {
    // In real implementation, validate with backend
    const validCodes = {
      'WELCOME10': { type: 'percent', value: 10 },
      'SAVE5': { type: 'fixed', value: 5 }
    };

    const promo = validCodes[code.toUpperCase()];
    if (!promo) {
      throw new Error('Invalid promo code');
    }

    const discount = promo.type === 'percent' 
      ? this.getTotal() * (promo.value / 100)
      : promo.value;

    return {
      code: code.toUpperCase(),
      discount,
      total: Math.max(0, this.getTotal() - discount),
      formattedDiscount: this._formatPrice(discount),
      formattedTotal: this._formatPrice(Math.max(0, this.getTotal() - discount))
    };
  }

  /**
   * Validate cart for checkout
   */
  validate() {
    const errors = [];
    
    if (this.cart.length === 0) {
      errors.push('Cart is empty');
    }

    // Check for invalid quantities
    this.cart.forEach(item => {
      if (item.quantity < 1) {
        errors.push(`Invalid quantity for ${item.name}`);
      }
      if (item.price < 0) {
        errors.push(`Invalid price for ${item.name}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Create singleton instance
const cartManager = new CartManager();

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CartManager, CartEvents, cartManager };
} else if (typeof window !== 'undefined') {
  window.CartManager = CartManager;
  window.CartEvents = CartEvents;
  window.cartManager = cartManager;
}

export { CartManager, CartEvents, cartManager };
export default cartManager;