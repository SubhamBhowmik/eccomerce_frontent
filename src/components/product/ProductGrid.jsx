import ProductCard            from './ProductCard';
import { ProductGridSkeleton } from '../common/Loaders';
import styles                  from './ProductGrid.module.css';

export default function ProductGrid({ products, isLoading, emptyMessage = 'No products found.' }) {
  if (isLoading) return <ProductGridSkeleton count={12} />;

  if (!products || products.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>📦</span>
        <p className={styles.emptyText}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {products.map((p, i) => (
        <ProductCard
          key={p.id}
          product={p}
          style={{ animationDelay: `${i * 0.03}s` }}
        />
      ))}
    </div>
  );
}
