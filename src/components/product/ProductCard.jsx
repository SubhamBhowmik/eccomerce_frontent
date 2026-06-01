import { Link }    from 'react-router-dom';
import { formatINR } from '../../utils/helpers';
import { buildRoute } from '../../constants/app.constants';
import styles        from './ProductCard.module.css';

function StarRating({ rating }) {
  if (!rating) return null;
  const stars = Math.round(rating);
  return (
    <div className={styles.rating}>
      <div className={styles.stars}>
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`${styles.star} ${i < stars ? styles.filled : styles.empty}`}
            width="12" height="12" viewBox="0 0 24 24"
            fill={i < stars ? 'currentColor' : 'none'}
            stroke="currentColor" strokeWidth="2"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        ))}
      </div>
      <span className={styles.ratingNum}>{rating.toFixed(1)}</span>
      {/* reviews count is optional */}
    </div>
  );
}

export default function ProductCard({ product, style }) {
  const src = product.thumbnail
    || `https://placehold.co/320x320/f3f2ef/999?text=${encodeURIComponent(product.name?.slice(0, 12) || 'Product')}`;

  return (
    <Link
      to={buildRoute.product(product.id)}
      className={styles.card}
      style={style}
    >
      {/* Discount ribbon */}
      {product.discount > 0 && (
        <div className={styles.ribbon}>{product.discount}% off</div>
      )}

      {/* Image */}
      <div className={styles.imgWrap}>
        <img
          src={src}
          alt={product.name}
          className={styles.img}
          loading="lazy"
          onError={e => {
            e.target.src = `https://placehold.co/320x320/f3f2ef/999?text=No+Image`;
          }}
        />
      </div>

      {/* Body */}
      <div className={styles.body}>
        {product.subcategory && (
          <span className={styles.subcategory}>{product.subcategory}</span>
        )}
        <h3 className={`${styles.name} truncate-2`}>{product.name}</h3>

        <StarRating rating={product.rating} />

        <div className={styles.pricing}>
          <span className={styles.price}>{formatINR(product.price)}</span>
          {product.discount > 0 && (
            <span className={styles.mrp}>{formatINR(product.mrp)}</span>
          )}
        </div>

        {product.stock !== null && (
          <span className={`${styles.stockBadge} ${product.stock > 0 ? styles.inStock : styles.outStock}`}>
            {product.stock > 0 ? `In stock` : 'Out of stock'}
          </span>
        )}
      </div>

      {/* Hover overlay CTA */}
      <div className={styles.overlay}>
        <span className={styles.viewBtn}>View Details</span>
      </div>
    </Link>
  );
}
