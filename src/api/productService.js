/**
 * productService — all product-related API calls
 * This is the Model layer's data-access object.
 */

import httpClient from './httpClient';
import { PRODUCT_ENDPOINTS } from '../constants/api.constants';

/**
 * Normalise raw API product shape → unified internal shape.
 * Keeps the rest of the app decoupled from the backend contract.
 */
export function normaliseProduct(raw) {
  const images =
    Array.isArray(raw.images) && raw.images.length > 0
      ? raw.images
      : raw.url
      ? [raw.url]
      : [];

  const price   = raw.price?.cost  ?? raw.price ?? raw.originalPrice ?? 0;
  const mrp     = raw.price?.mrp   ?? price;
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  return {
    id:          String(raw.id ?? ''),
    name:        raw.name || raw.title?.longTitle || raw.title?.shortTitle || 'Unnamed Product',
    shortName:   raw.title?.shortTitle || raw.name || '',
    description: raw.description || '',
    category:    raw.category || '',
    subcategory: raw.subcategory || '',
    images,
    thumbnail:   images[0] || '',
    price,
    mrp,
    discount,         // percent
    rating:      raw.rating  ?? 0,
    reviews:     raw.reviews ?? 0,
    stock:       raw.stock   ?? null,
    size:        Array.isArray(raw.size) ? raw.size : [],
    tagline:     raw.tagline || '',
    // raw reference preserved for debugging
    _raw: raw,
  };
}

const productService = {
  /**
   * Fetch all products (may return large set — use sparingly).
   * @returns {Promise<NormalisedProduct[]>}
   */
  async getAll() {
    const data = await httpClient.get(PRODUCT_ENDPOINTS.ALL);
    return Array.isArray(data) ? data.map(normaliseProduct) : [];
  },

  /**
   * Fetch a single product by ID.
   * @param {string|number} id
   * @returns {Promise<NormalisedProduct>}
   */
  async getById(id) {
    const data = await httpClient.get(PRODUCT_ENDPOINTS.BY_ID(id));
    return normaliseProduct(data);
  },

  /**
   * Fetch products by category slug.
   * @param {string} category
   * @returns {Promise<NormalisedProduct[]>}
   */
  async getByCategory(category) {
    const data = await httpClient.get(PRODUCT_ENDPOINTS.BY_CATEGORY(category));
    return Array.isArray(data) ? data.map(normaliseProduct) : [];
  },

  /**
   * Create a new product.
   * @param {object} payload
   * @returns {Promise<NormalisedProduct>}
   */
  async create(payload) {
    const data = await httpClient.post(PRODUCT_ENDPOINTS.CREATE, payload);
    return normaliseProduct(data);
  },

  /**
   * Update an existing product.
   * @param {string|number} id
   * @param {object} payload
   * @returns {Promise<NormalisedProduct>}
   */
  async update(id, payload) {
    const data = await httpClient.put(PRODUCT_ENDPOINTS.UPDATE(id), payload);
    return normaliseProduct(data);
  },

  /**
   * Delete a product.
   * @param {string|number} id
   * @returns {Promise<void>}
   */
  async remove(id) {
    await httpClient.delete(PRODUCT_ENDPOINTS.DELETE(id));
  },
};

export default productService;
