/**
 * Agent API - SimRyoko eSIM Agent API Wrapper
 * Handles communication with backend代理商API
 */

class AgentApi {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || '/api';
    this.apiKey = options.apiKey || '';
    this.timeout = options.timeout || 30000;
    this.retryCount = options.retryCount || 3;
    this.retryDelay = options.retryDelay || 1000;
    
    // Request/response interceptors
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  /**
   * Add request interceptor
   * @param {Function} interceptor - Function(config) => config
   */
  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor
   * @param {Function} interceptor - Function(response) => response
   */
  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Execute request with interceptors
   */
  async _request(config) {
    // Apply request interceptors
    let modifiedConfig = { ...config };
    for (const interceptor of this.requestInterceptors) {
      modifiedConfig = await interceptor(modifiedConfig);
    }

    const { method = 'GET', url, data, headers = {}, timeout } = modifiedConfig;
    
    const requestOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
        ...headers
      },
      credentials: 'include'
    };

    if (data && method !== 'GET') {
      requestOptions.body = JSON.stringify(data);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout || this.timeout);
    requestOptions.signal = controller.signal;

    try {
      const response = await fetch(`${this.baseUrl}${url}`, requestOptions);
      clearTimeout(timeoutId);
      
      let responseData;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      // Apply response interceptors
      const responseObj = {
        ok: response.ok,
        status: response.status,
        data: responseData,
        headers: response.headers
      };

      let finalResponse = responseObj;
      for (const interceptor of this.responseInterceptors) {
        finalResponse = await interceptor(finalResponse);
      }

      if (!response.ok) {
        throw new ApiError(
          responseData.message || 'Request failed',
          response.status,
          responseData
        );
      }

      return finalResponse;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }
      throw error;
    }
  }

  /**
   * Retry wrapper
   */
  async _withRetry(requestFn, retries = this.retryCount) {
    let lastError;
    for (let i = 0; i < retries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        if (i < retries - 1) {
          await this._delay(this.retryDelay * (i + 1));
        }
      }
    }
    throw lastError;
  }

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ============ Agent Operations ============

  /**
   * Get agent profile
   * @returns {Promise<Object>}
   */
  async getProfile() {
    return this._request({ url: '/agent/profile' });
  }

  /**
   * Update agent profile
   * @param {Object} data - Profile data
   */
  async updateProfile(data) {
    return this._request({ 
      method: 'PUT', 
      url: '/agent/profile', 
      data 
    });
  }

  /**
   * Get agent stats
   * @param {Object} params - { period: 'daily' | 'weekly' | 'monthly' }
   */
  async getStats(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this._request({ 
      url: `/agent/stats?${query}` 
    });
  }

  // ============ eSIM Package Operations ============

  /**
   * Get all packages with filters
   * @param {Object} filters - { country, region, minData, maxData, priceRange, inStock }
   */
  async getPackages(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this._request({ 
      url: `/packages?${query}` 
    });
  }

  /**
   * Get single package by ID
   * @param {string} id - Package ID
   */
  async getPackage(id) {
    return this._request({ url: `/packages/${id}` });
  }

  /**
   * Search packages
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   */
  async searchPackages(query, filters = {}) {
    const params = { q: query, ...filters };
    const queryString = new URLSearchParams(params).toString();
    return this._request({ 
      url: `/packages/search?${queryString}` 
    });
  }

  // ============ Order Operations ============

  /**
   * Create new order
   * @param {Object} orderData - { items: [{packageId, quantity}], customerEmail, paymentMethod }
   */
  async createOrder(orderData) {
    return this._request({ 
      method: 'POST', 
      url: '/orders', 
      data: orderData 
    });
  }

  /**
   * Get order by ID
   * @param {string} orderId - Order ID
   */
  async getOrder(orderId) {
    return this._request({ url: `/orders/${orderId}` });
  }

  /**
   * Get orders list
   * @param {Object} params - { status, page, limit }
   */
  async getOrders(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this._request({ 
      url: `/orders?${query}` 
    });
  }

  /**
   * Cancel order
   * @param {string} orderId - Order ID
   */
  async cancelOrder(orderId) {
    return this._request({ 
      method: 'POST', 
      url: `/orders/${orderId}/cancel` 
    });
  }

  /**
   * Refund order
   * @param {string} orderId - Order ID
   * @param {Object} reason - { reason, amount }
   */
  async refundOrder(orderId, reason) {
    return this._request({ 
      method: 'POST', 
      url: `/orders/${orderId}/refund`, 
      data: reason 
    });
  }

  // ============ eSIM Activation ============

  /**
   * Activate eSIM
   * @param {string} orderId - Order ID
   * @param {Object} activationData - { iccid, email }
   */
  async activateEsim(orderId, activationData) {
    return this._request({ 
      method: 'POST', 
      url: `/orders/${orderId}/activate`, 
      data: activationData 
    });
  }

  /**
   * Get eSIM status
   * @param {string} iccid - ICCID
   */
  async getEsimStatus(iccid) {
    return this._request({ url: `/esim/${iccid}/status` });
  }

  /**
   * Top up eSIM data
   * @param {string} iccid - ICCID
   * @param {string} packageId - Package ID to add
   */
  async topUpEsim(iccid, packageId) {
    return this._request({ 
      method: 'POST', 
      url: `/esim/${iccid}/topup`, 
      data: { packageId } 
    });
  }

  /**
   * Get eSIM QR code
   * @param {string} iccid - ICCID
   */
  async getEsimQrCode(iccid) {
    return this._request({ url: `/esim/${iccid}/qrcode` });
  }

  // ============ Customer Operations ============

  /**
   * Get customers list
   * @param {Object} params - { page, limit, search }
   */
  async getCustomers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this._request({ 
      url: `/customers?${query}` 
    });
  }

  /**
   * Get customer by email
   * @param {string} email - Customer email
   */
  async getCustomer(email) {
    return this._request({ url: `/customers/${encodeURIComponent(email)}` });
  }

  /**
   * Create customer
   * @param {Object} customerData - { email, name, phone }
   */
  async createCustomer(customerData) {
    return this._request({ 
      method: 'POST', 
      url: '/customers', 
      data: customerData 
    });
  }

  // ============ Wallet & Commission ============

  /**
   * Get wallet balance
   */
  async getWallet() {
    return this._request({ url: '/wallet' });
  }

  /**
   * Get commission history
   * @param {Object} params - { page, limit, startDate, endDate }
   */
  async getCommissionHistory(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this._request({ 
      url: `/wallet/commissions?${query}` 
    });
  }

  /**
   * Request withdrawal
   * @param {Object} withdrawalData - { amount, method, account }
   */
  async requestWithdrawal(withdrawalData) {
    return this._request({ 
      method: 'POST', 
      url: '/wallet/withdraw', 
      data: withdrawalData 
    });
  }
}

/**
 * API Error class
 */
class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AgentApi, ApiError };
} else if (typeof window !== 'window') {
  window.AgentApi = AgentApi;
  window.ApiError = ApiError;
}

export { AgentApi, ApiError };
export default AgentApi;