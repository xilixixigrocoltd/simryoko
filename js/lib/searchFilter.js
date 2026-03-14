/**
 * Search & Filter Utilities
 * Implements debounce, search, and filter logic for eSIM packages
 */

// Debounce function - delays execution until after wait milliseconds of no calls
export function debounce(func, wait = 300, immediate = false) {
  let timeout;
  
  return function executedFunction(...args) {
    const context = this;
    
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
}

// Throttle function - ensures function is called at most once in wait milliseconds
export function throttle(func, wait = 300) {
  let lastTime = 0;
  let timeout;
  
  return function executedFunction(...args) {
    const now = Date.now();
    const remaining = wait - (now - lastTime);
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      lastTime = now;
      func.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        lastTime = Date.now();
        timeout = null;
        func.apply(this, args);
      }, remaining);
    }
  };
}

// Search/Filter functions
export const SearchFilter = {
  /**
   * Filter packages by various criteria
   * @param {Array} packages - Array of package objects
   * @param {Object} filters - Filter criteria
   * @returns {Array} - Filtered packages
   */
  filter(packages, filters = {}) {
    let result = [...packages];
    
    const {
      query = '',
      country = '',
      region = '',
      minData,
      maxData,
      minPrice,
      maxPrice,
      speed = '',
      inStock,
      popular,
      tags = [],
      carrier = ''
    } = filters;

    // Text search (name, country, tags)
    if (query && query.trim()) {
      const searchTerm = query.toLowerCase().trim();
      result = result.filter(pkg => 
        pkg.name.toLowerCase().includes(searchTerm) ||
        pkg.country.toLowerCase().includes(searchTerm) ||
        pkg.countryCode.toLowerCase().includes(searchTerm) ||
        pkg.carrier.toLowerCase().includes(searchTerm) ||
        pkg.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        pkg.region.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by country
    if (country && country.trim()) {
      const countryTerm = country.toLowerCase().trim();
      result = result.filter(pkg => 
        pkg.country.toLowerCase() === countryTerm ||
        pkg.countryCode.toLowerCase() === countryTerm.toUpperCase()
      );
    }

    // Filter by region
    if (region && region.trim()) {
      const regionTerm = region.toLowerCase().trim();
      result = result.filter(pkg => 
        pkg.region.toLowerCase().includes(regionTerm)
      );
    }

    // Filter by data range
    if (minData !== undefined && minData !== null) {
      result = result.filter(pkg => pkg.data >= minData);
    }
    
    if (maxData !== undefined && maxData !== null) {
      result = result.filter(pkg => pkg.data <= maxData);
    }

    // Filter by price range
    if (minPrice !== undefined && minPrice !== null) {
      result = result.filter(pkg => pkg.price >= minPrice);
    }
    
    if (maxPrice !== undefined && maxPrice !== null) {
      result = result.filter(pkg => pkg.price <= maxPrice);
    }

    // Filter by speed
    if (speed && speed.trim()) {
      const speedTerm = speed.toLowerCase().trim();
      result = result.filter(pkg => 
        pkg.speed.toLowerCase().includes(speedTerm)
      );
    }

    // Filter by in-stock
    if (inStock !== undefined && inStock !== null) {
      result = result.filter(pkg => pkg.inStock === inStock);
    }

    // Filter by popular
    if (popular !== undefined && popular !== null) {
      result = result.filter(pkg => pkg.popular === popular);
    }

    // Filter by tags
    if (tags && tags.length > 0) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      result = result.filter(pkg => 
        tagArray.some(tag => pkg.tags.includes(tag.toLowerCase()))
      );
    }

    // Filter by carrier
    if (carrier && carrier.trim()) {
      const carrierTerm = carrier.toLowerCase().trim();
      result = result.filter(pkg => 
        pkg.carrier.toLowerCase().includes(carrierTerm)
      );
    }

    return result;
  },

  /**
   * Sort packages
   * @param {Array} packages - Array of package objects
   * @param {string} sortBy - Sort field
   * @param {string} order - 'asc' or 'desc'
   * @returns {Array} - Sorted packages
   */
  sort(packages, sortBy = 'price', order = 'asc') {
    const sorted = [...packages];
    const orderMultiplier = order === 'desc' ? -1 : 1;

    sorted.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return (a.price - b.price) * orderMultiplier;
        case 'data':
          return (a.data - b.data) * orderMultiplier;
        case 'validity':
          return (a.validity - b.validity) * orderMultiplier;
        case 'name':
          return a.name.localeCompare(b.name) * orderMultiplier;
        case 'country':
          return a.country.localeCompare(b.country) * orderMultiplier;
        case 'popular':
          // Sort popular first in desc, last in asc
          return (b.popular - a.popular) * orderMultiplier;
        default:
          return 0;
      }
    });

    return sorted;
  },

  /**
   * Get unique regions from packages
   * @param {Array} packages - Array of package objects
   * @returns {Array} - Unique regions
   */
  getRegions(packages) {
    return [...new Set(packages.map(pkg => pkg.region))].sort();
  },

  /**
   * Get unique countries from packages
   * @param {Array} packages - Array of package objects
   * @returns {Array} - Unique countries with code
   */
  getCountries(packages) {
    const countryMap = new Map();
    packages.forEach(pkg => {
      if (!countryMap.has(pkg.countryCode)) {
        countryMap.set(pkg.countryCode, {
          code: pkg.countryCode,
          name: pkg.country
        });
      }
    });
    return Array.from(countryMap.values()).sort((a, b) => 
      a.name.localeCompare(b.name)
    );
  },

  /**
   * Get unique carriers from packages
   * @param {Array} packages - Array of package objects
   * @returns {Array} - Unique carriers
   */
  getCarriers(packages) {
    return [...new Set(packages.map(pkg => pkg.carrier))].sort();
  },

  /**
   * Get price range
   * @param {Array} packages - Array of package objects
   * @returns {Object} - { min, max }
   */
  getPriceRange(packages) {
    if (!packages.length) return { min: 0, max: 0 };
    const prices = packages.map(pkg => pkg.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  },

  /**
   * Get data range
   * @param {Array} packages - Array of package objects
   * @returns {Object} - { min, max }
   */
  getDataRange(packages) {
    if (!packages.length) return { min: 0, max: 0 };
    const data = packages.map(pkg => pkg.data);
    return {
      min: Math.min(...data),
      max: Math.max(...data)
    };
  },

  /**
   * Group packages by country
   * @param {Array} packages - Array of package objects
   * @returns {Object} - Grouped packages
   */
  groupByCountry(packages) {
    return packages.reduce((groups, pkg) => {
      const key = pkg.countryCode;
      if (!groups[key]) {
        groups[key] = {
          country: pkg.country,
          code: pkg.countryCode,
          packages: []
        };
      }
      groups[key].packages.push(pkg);
      return groups;
    }, {});
  },

  /**
   * Group packages by region
   * @param {Array} packages - Array of package objects
   * @returns {Object} - Grouped packages
   */
  groupByRegion(packages) {
    return packages.reduce((groups, pkg) => {
      const key = pkg.region;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(pkg);
      return groups;
    }, {});
  }
};

/**
 * SearchManager - Manages search state and executes searches
 */
export class SearchManager {
  constructor(options = {}) {
    this.packages = [];
    this.filters = {};
    this.sortBy = 'price';
    this.sortOrder = 'asc';
    this.debounceMs = options.debounceMs || 300;
    this.onResults = options.onResults || (() => {});
    this.onLoading = options.onLoading || (() => {});
    this.onError = options.onError || (() => {});
    
    this._debouncedSearch = debounce(this._doSearch.bind(this), this.debounceMs);
  }

  /**
   * Initialize with packages data
   */
  setPackages(packages) {
    this.packages = packages;
    this._doSearch();
  }

  /**
   * Update filters (triggers debounced search)
   */
  setFilters(filters) {
    this.filters = { ...this.filters, ...filters };
    this._debouncedSearch();
  }

  /**
   * Set all filters at once
   */
  setAllFilters(filters) {
    this.filters = filters;
    this._doSearch();
  }

  /**
   * Clear all filters
   */
  clearFilters() {
    this.filters = {};
    this._doSearch();
  }

  /**
   * Set sorting
   */
  setSort(sortBy, order = 'asc') {
    this.sortBy = sortBy;
    this.sortOrder = order;
    this._doSearch();
  }

  /**
   * Execute search immediately (no debounce)
   */
  search() {
    this._doSearch();
  }

  /**
   * Internal search method
   */
  _doSearch() {
    this.onLoading(true);
    
    try {
      let results = SearchFilter.filter(this.packages, this.filters);
      results = SearchFilter.sort(results, this.sortBy, this.sortOrder);
      this.onResults(results);
    } catch (error) {
      this.onError(error);
    } finally {
      this.onLoading(false);
    }
  }

  /**
   * Get current filter state
   */
  getState() {
    return {
      filters: { ...this.filters },
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    };
  }

  /**
   * Get available filter options based on current packages
   */
  getAvailableOptions() {
    return {
      regions: SearchFilter.getRegions(this.packages),
      countries: SearchFilter.getCountries(this.packages),
      carriers: SearchFilter.getCarriers(this.packages),
      priceRange: SearchFilter.getPriceRange(this.packages),
      dataRange: SearchFilter.getDataRange(this.packages)
    };
  }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    debounce, 
    throttle, 
    SearchFilter, 
    SearchManager 
  };
} else if (typeof window !== 'undefined') {
  window.SearchUtils = { 
    debounce, 
    throttle, 
    SearchFilter, 
    SearchManager 
  };
}