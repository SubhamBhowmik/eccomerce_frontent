import { useEffect, useState } from 'react';
import { useParams, Link }     from 'react-router-dom';
import { useProducts }         from '../../hooks/useProducts';
import { CATEGORIES }          from '../../constants/app.constants';
import ProductGrid             from '../../components/product/ProductGrid';
import { debounce }            from '../../utils/helpers';
import styles                  from './CategoryProducts.module.css';

// ── Sort options ──────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: 'default',       label: 'Relevance'       },
  { value: 'price_asc',     label: 'Price: Low → High' },
  { value: 'price_desc',    label: 'Price: High → Low' },
  { value: 'rating_desc',   label: 'Top Rated'       },
  { value: 'discount_desc', label: 'Best Discount'   },
];

function sortProducts(list, sort) {
  const copy = [...list];
  switch (sort) {
    case 'price_asc':     return copy.sort((a, b) => a.price - b.price);
    case 'price_desc':    return copy.sort((a, b) => b.price - a.price);
    case 'rating_desc':   return copy.sort((a, b) => b.rating - a.rating);
    case 'discount_desc': return copy.sort((a, b) => b.discount - a.discount);
    default:              return copy;
  }
}

// ── Filter sidebar state ──────────────────────────────────────────────────────
function FilterBar({ products, onFilter }) {
  const [inStockOnly,  setInStockOnly]  = useState(false);
  const [minRating,    setMinRating]    = useState(0);
  const [priceMax,     setPriceMax]     = useState('');

  useEffect(() => {
    let filtered = products;
    if (inStockOnly)  filtered = filtered.filter(p => p.stock === null || p.stock > 0);
    if (minRating > 0) filtered = filtered.filter(p => p.rating >= minRating);
    if (priceMax)      filtered = filtered.filter(p => p.price <= Number(priceMax));
    onFilter(filtered);
  }, [inStockOnly, minRating, priceMax, products]); // eslint-disable-line

  return (
    <aside className={styles.filters}>
      <h3 className={styles.filterTitle}>Filters</h3>

      <div className={styles.filterGroup}>
        <label className={styles.checkLabel}>
          <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} />
          In Stock Only
        </label>
      </div>

      <div className={styles.filterGroup}>
        <p className={styles.filterLabel}>Min Rating</p>
        <div className={styles.ratingBtns}>
          {[0, 3, 3.5, 4, 4.5].map(r => (
            <button
              key={r}
              className={`${styles.ratingBtn} ${minRating === r ? styles.ratingBtnActive : ''}`}
              onClick={() => setMinRating(r)}
            >
              {r === 0 ? 'All' : `${r}★+`}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filterGroup}>
        <p className={styles.filterLabel}>Max Price (₹)</p>
        <input
          type="number"
          className={styles.priceInput}
          placeholder="e.g. 5000"
          value={priceMax}
          onChange={e => setPriceMax(e.target.value)}
          min={0}
        />
      </div>

      <button
        className={styles.resetBtn}
        onClick={() => { setInStockOnly(false); setMinRating(0); setPriceMax(''); }}
      >
        Reset Filters
      </button>
    </aside>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CategoryProductsPage() {
  const { categoryId }       = useParams();
  const { products, isLoading, isError } = useProducts(categoryId);

  const [sort,     setSort]     = useState('default');
  const [filtered, setFiltered] = useState([]);
  const [searchQ,  setSearchQ]  = useState('');

  const catMeta = CATEGORIES.find(c => c.id === categoryId);

  // Sync filtered when base products change
  useEffect(() => {
    setFiltered(products);
  }, [products]);

  // Local search within category
  const handleSearch = debounce((q) => {
    if (!q) { setFiltered(products); return; }
    const lq = q.toLowerCase();
    setFiltered(products.filter(p => p.name.toLowerCase().includes(lq)));
  }, 250);

  const displayProducts = sortProducts(filtered, sort);

  return (
    <div className={`${styles.page} page-enter`}>
      <div className="page-container">
        {/* ── Breadcrumb ── */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/" className={styles.bcLink}>Home</Link>
          <span className={styles.bcSep}>›</span>
          <span className={styles.bcCurrent}>{catMeta?.label || categoryId}</span>
        </nav>

        {/* ── Page header ── */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>
              {catMeta?.emoji} {catMeta?.label || categoryId}
            </h1>
            {!isLoading && (
              <p className={styles.productCount}>
                {displayProducts.length} product{displayProducts.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Sort + Search toolbar */}
          <div className={styles.toolbar}>
            <input
              type="search"
              className={styles.catSearch}
              placeholder="Search in category…"
              value={searchQ}
              onChange={e => { setSearchQ(e.target.value); handleSearch(e.target.value); }}
            />
            <div className={styles.sortWrap}>
              <label className={styles.sortLabel} htmlFor="sort">Sort:</label>
              <select
                id="sort"
                className={styles.sortSelect}
                value={sort}
                onChange={e => setSort(e.target.value)}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Body: filter sidebar + grid ── */}
        <div className={styles.body}>
          <FilterBar products={products} onFilter={setFiltered} />

          <div className={styles.gridArea}>
            {isError ? (
              <div className={styles.error}>
                <span>⚠️</span>
                <p>Failed to load products. The server may be waking up — try again.</p>
                <button className={styles.retryBtn} onClick={() => window.location.reload()}>
                  Retry
                </button>
              </div>
            ) : (
              <ProductGrid
                products={displayProducts}
                isLoading={isLoading}
                emptyMessage="No products match your filters."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
