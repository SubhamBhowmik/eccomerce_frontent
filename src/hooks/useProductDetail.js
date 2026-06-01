/**
 * useProductDetail — hook for fetching a single product's details.
 * Encapsulates all API calls and state management for the product detail page.
 */

import { useState, useEffect } from 'react';
import productService from '../api/productService';

export function useProductDetail(productId) {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!productId) {
      setIsError(true);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setIsError(false);

    productService
      .getById(productId)
      .then((data) => {
        if (isMounted) {
          setProduct(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('❌ [useProductDetail] Error fetching product:', err);
        if (isMounted) {
          setIsError(true);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [productId]);

  return { product, isLoading, isError };
}