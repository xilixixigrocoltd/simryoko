/**
 * Data Loader - Fetch and load eSIM package data
 */

import { useEsimStore } from './store.js';
import { cartManager } from './cart.js';
import { debounce, SearchManager } from './searchFilter.js';

/**
 * Load packages from JSON data
 */
export async function loadPackages() {
  try {
    useEsimStore.setState({ packagesLoading: true });
    
    const response = await fetch('/data/esim-packages.json');
    if (!response.ok) {
      throw new Error('Failed to load packages');
    }
    
    const data = await response.json();
    useEsimStore.setState({ 
      packages: data.packages,
      filteredPackages: data.packages,
      packagesLoading: false 
    });
    
    return data.packages;
  } catch (error) {
    useEsimStore.setState({ 
      packagesError: error.message,
      packagesLoading: false 
    });
    throw error;
  }
}

/**
 * Initialize the app with data
 */
export async function initializeApp() {
  try {
    const packages = await loadPackages();
    
    // Set up search manager with store
    const searchManager = new SearchManager({
      debounceMs: 300,
      onResults: (results) => {
        useEsimStore.setState({ filteredPackages: results });
      },
      onLoading: (loading) => {
        useEsimStore.setState({ packagesLoading: loading });
      },
      onError: (error) => {
        useEsimStore.setState({ packagesError: error.message });
      }
    });
    
    searchManager.setPackages(useEsimStore.getState().packages);
    
    return { packages, searchManager };
  } catch (error) {
    console.error('Failed to initialize app:', error);
    throw error;
  }
}

/**
 * Add package to cart with store integration
 */
export function addToCart(packageData, quantity = 1) {
  // Add to cart manager
  cartManager.addItem(packageData, quantity);
  
  // Also update store
  useEsimStore.getState().addToCart(packageData, quantity);
}

/**
 * Remove from cart
 */
export function removeFromCart(packageId) {
  cartManager.removeItem(packageId);
  useEsimStore.getState().removeFromCart(packageId);
}

/**
 * Update cart quantity
 */
export function updateCartQuantity(packageId, quantity) {
  cartManager.updateQuantity(packageId, quantity);
  useEsimStore.getState().updateCartQuantity(packageId, quantity);
}

// Export everything
export { useEsimStore, cartManager, SearchManager };
export { debounce };
export { SearchFilter } from './searchFilter.js';
export { CartManager, CartEvents } from './cart.js';
export { AgentApi, ApiError } from './agentApi.js';