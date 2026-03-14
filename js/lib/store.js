/**
 * Zustand-style State Management Store
 * Compatible with vanilla JS and can be used with React
 * Follows Zustand API patterns for easy migration
 */

// Simple subscription manager
function createSubscription() {
  let listeners = new Set();
  
  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    notify() {
      listeners.forEach(listener => listener());
    },
    getCount() {
      return listeners.size;
    }
  };
}

// Create store function (Zustand-like API)
export function createStore(createState) {
  let state;
  const subscriptions = createSubscription();
  
  // Set initial state
  const setState = (partial, replace) => {
    const nextState = typeof partial === 'function' ? partial(state) : partial;
    
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = replace ? nextState : Object.assign({}, state, nextState);
      
      // Notify subscribers
      subscriptions.notify();
    }
  };
  
  const getState = () => state;
  
  const subscribe = (listener) => subscriptions.subscribe(listener);
  
  const destroy = () => {
    // Cleanup if needed
  };
  
  // Initialize state
  state = createState(setState, getState, { subscribe, destroy });
  
  return { getState, setState, subscribe, destroy };
}

// eSIM Store - Main application store
export const useEsimStore = createStore((set, get) => ({
  // Packages state
  packages: [],
  packagesLoading: false,
  packagesError: null,
  
  // Filters state
  filters: {
    query: '',
    country: '',
    region: '',
    minData: null,
    maxData: null,
    minPrice: null,
    maxPrice: null,
    speed: '',
    inStock: null,
    popular: null,
    tags: []
  },
  
  // Sorting state
  sortBy: 'price',
  sortOrder: 'asc',
  
  // Filtered results
  filteredPackages: [],
  
  // Cart state
  cart: [],
  cartTotal: 0,
  
  // Customer state
  customer: null,
  customerOrders: [],
  
  // UI state
  selectedPackage: null,
  isCartOpen: false,
  isSearchOpen: false,
  notification: null,
  
  // ============ Package Actions ============
  
  setPackages: (packages) => set({ 
    packages, 
    filteredPackages: packages 
  }),
  
  setPackagesLoading: (loading) => set({ packagesLoading: loading }),
  
  setPackagesError: (error) => set({ packagesError: error }),
  
  // ============ Filter Actions ============
  
  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value }
  })),
  
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),
  
  clearFilters: () => set({
    filters: {
      query: '',
      country: '',
      region: '',
      minData: null,
      maxData: null,
      minPrice: null,
      maxPrice: null,
      speed: '',
      inStock: null,
      popular: null,
      tags: []
    },
    sortBy: 'price',
    sortOrder: 'asc'
  }),
  
  setSort: (sortBy, sortOrder = 'asc') => set({ sortBy, sortOrder }),
  
  // ============ Cart Actions ============
  
  addToCart: (packageItem, quantity = 1) => set((state) => {
    const existingIndex = state.cart.findIndex(item => item.id === packageItem.id);
    let newCart;
    
    if (existingIndex > -1) {
      // Update quantity if already in cart
      newCart = [...state.cart];
      newCart[existingIndex] = {
        ...newCart[existingIndex],
        quantity: newCart[existingIndex].quantity + quantity
      };
    } else {
      // Add new item
      newCart = [...state.cart, {
        id: packageItem.id,
        name: packageItem.name,
        price: packageItem.price,
        data: packageItem.data,
        dataUnit: packageItem.dataUnit,
        country: packageItem.country,
        countryCode: packageItem.countryCode,
        carrier: packageItem.carrier,
        quantity,
        itemTotal: packageItem.price * quantity
      }];
    }
    
    // Calculate total
    const cartTotal = newCart.reduce((sum, item) => sum + item.itemTotal, 0);
    
    return { cart: newCart, cartTotal };
  }),
  
  removeFromCart: (packageId) => set((state) => {
    const newCart = state.cart.filter(item => item.id !== packageId);
    const cartTotal = newCart.reduce((sum, item) => sum + item.itemTotal, 0);
    return { cart: newCart, cartTotal };
  }),
  
  updateCartQuantity: (packageId, quantity) => set((state) => {
    if (quantity <= 0) {
      return get().removeFromCart(packageId);
    }
    
    const newCart = state.cart.map(item => {
      if (item.id === packageId) {
        return {
          ...item,
          quantity,
          itemTotal: item.price * quantity
        };
      }
      return item;
    });
    
    const cartTotal = newCart.reduce((sum, item) => sum + item.itemTotal, 0);
    return { cart: newCart, cartTotal };
  }),
  
  clearCart: () => set({ cart: [], cartTotal: 0 }),
  
  // ============ Customer Actions ============
  
  setCustomer: (customer) => set({ customer }),
  
  setCustomerOrders: (orders) => set({ customerOrders: orders }),
  
  // ============ UI Actions ============
  
  selectPackage: (packageItem) => set({ selectedPackage: packageItem }),
  
  clearSelectedPackage: () => set({ selectedPackage: null }),
  
  toggleCart: (isOpen) => set((state) => ({ 
    isCartOpen: isOpen !== undefined ? isOpen : !state.isCartOpen 
  })),
  
  toggleSearch: (isOpen) => set((state) => ({ 
    isSearchOpen: isOpen !== undefined ? isOpen : !state.isSearchOpen 
  })),
  
  showNotification: (message, type = 'info', duration = 3000) => {
    set({ notification: { message, type, timestamp: Date.now() } });
    
    if (duration > 0) {
      setTimeout(() => {
        set((state) => {
          if (state.notification?.timestamp === state.notification?.timestamp) {
            return { notification: null };
          }
          return {};
        });
      }, duration);
    }
  },
  
  clearNotification: () => set({ notification: null }),
  
  // ============ Computed Selectors ============
  
  getCartItemCount: () => {
    const state = get();
    return state.cart.reduce((sum, item) => sum + item.quantity, 0);
  },
  
  getFilteredPackages: () => {
    const state = get();
    let result = [...state.packages];
    const { filters, sortBy, sortOrder } = state;
    
    // Apply filters
    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(pkg => 
        pkg.name.toLowerCase().includes(q) ||
        pkg.country.toLowerCase().includes(q) ||
        pkg.countryCode.toLowerCase().includes(q) ||
        pkg.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    
    if (filters.country) {
      result = result.filter(pkg => 
        pkg.countryCode === filters.country.toUpperCase() ||
        pkg.country.toLowerCase() === filters.country.toLowerCase()
      );
    }
    
    if (filters.region) {
      result = result.filter(pkg => 
        pkg.region.toLowerCase() === filters.region.toLowerCase()
      );
    }
    
    if (filters.minData) {
      result = result.filter(pkg => pkg.data >= filters.minData);
    }
    
    if (filters.maxData) {
      result = result.filter(pkg => pkg.data <= filters.maxData);
    }
    
    if (filters.minPrice) {
      result = result.filter(pkg => pkg.price >= filters.minPrice);
    }
    
    if (filters.maxPrice) {
      result = result.filter(pkg => pkg.price <= filters.maxPrice);
    }
    
    if (filters.inStock !== null) {
      result = result.filter(pkg => pkg.inStock === filters.inStock);
    }
    
    if (filters.popular !== null) {
      result = result.filter(pkg => pkg.popular === filters.popular);
    }
    
    if (filters.tags && filters.tags.length > 0) {
      result = result.filter(pkg => 
        filters.tags.some(tag => pkg.tags.includes(tag))
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const multiplier = sortOrder === 'desc' ? -1 : 1;
      switch (sortBy) {
        case 'price':
          return (a.price - b.price) * multiplier;
        case 'data':
          return (a.data - b.data) * multiplier;
        case 'name':
          return a.name.localeCompare(b.name) * multiplier;
        default:
          return 0;
      }
    });
    
    return result;
  }
}));

// Cart specific store (for when you need cart-only state)
export const useCartStore = createStore((set, get) => ({
  items: [],
  total: 0,
  
  addItem: (item, quantity = 1) => {
    const state = get();
    const existingIndex = state.items.findIndex(i => i.id === item.id);
    let newItems;
    
    if (existingIndex > -1) {
      newItems = [...state.items];
      newItems[existingIndex] = {
        ...newItems[existingIndex],
        quantity: newItems[existingIndex].quantity + quantity,
        itemTotal: (newItems[existingIndex].quantity + quantity) * newItems[existingIndex].price
      };
    } else {
      newItems = [...state.items, {
        ...item,
        quantity,
        itemTotal: item.price * quantity
      }];
    }
    
    const total = newItems.reduce((sum, i) => sum + i.itemTotal, 0);
    set({ items: newItems, total });
  },
  
  removeItem: (itemId) => set((state) => {
    const newItems = state.items.filter(i => i.id !== itemId);
    const total = newItems.reduce((sum, i) => sum + i.itemTotal, 0);
    return { items: newItems, total };
  }),
  
  updateQuantity: (itemId, quantity) => set((state) => {
    if (quantity <= 0) {
      return get().removeItem(itemId);
    }
    
    const newItems = state.items.map(i => {
      if (i.id === itemId) {
        return { ...i, quantity, itemTotal: quantity * i.price };
      }
      return i;
    });
    
    const total = newItems.reduce((sum, i) => sum + i.itemTotal, 0);
    return { items: newItems, total };
  }),
  
  clear: () => set({ items: [], total: 0 }),
  
  getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0)
}));

// Export for vanilla JS usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createStore, useEsimStore, useCartStore };
} else if (typeof window !== 'undefined') {
  window.EsimStore = { createStore, useEsimStore, useCartStore };
}