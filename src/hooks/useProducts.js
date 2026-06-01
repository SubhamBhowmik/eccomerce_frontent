/**
 * useProducts — hook for category-level product data.
 * Encapsulates all Redux dispatch & selector logic for the View layer.
 */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProductsByCategory,
  fetchAllProducts,
  selectProductList,
  selectFilteredProducts,
  selectListStatus,
  selectProductError,
  selectActiveCategory,
  setSearchQuery,
  selectSearchQuery,
} from '../store/slices/productsSlice';
import { LOAD_STATUS } from '../constants/app.constants';

export function useProducts(category = null) {
  const dispatch = useDispatch();

  const list            = useSelector(selectProductList);
  const filtered        = useSelector(selectFilteredProducts);
  const status          = useSelector(selectListStatus);
  const error           = useSelector(selectProductError);
  const activeCategory  = useSelector(selectActiveCategory);
  const searchQuery     = useSelector(selectSearchQuery);

  useEffect(() => {
    if (category) {
      // Only re-fetch if the category actually changed
      if (activeCategory !== category || status === LOAD_STATUS.IDLE) {
        dispatch(fetchProductsByCategory(category));
      }
    } else {
      if (status === LOAD_STATUS.IDLE) {
        dispatch(fetchAllProducts());
      }
    }
  }, [category]); // eslint-disable-line react-hooks/exhaustive-deps

  const search = (query) => dispatch(setSearchQuery(query));
  const reload  = () => category
    ? dispatch(fetchProductsByCategory(category))
    : dispatch(fetchAllProducts());

  return {
    products:   filtered,
    allProducts: list,
    status,
    isLoading:  status === LOAD_STATUS.LOADING,
    isSuccess:  status === LOAD_STATUS.SUCCESS,
    isError:    status === LOAD_STATUS.ERROR,
    error,
    activeCategory,
    searchQuery,
    search,
    reload,
  };
}
