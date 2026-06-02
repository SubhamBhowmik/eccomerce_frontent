import { useState }            from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { useProductDetail }    from '../../hooks/useProductDetail';
import { useCart }             from '../../hooks/useCart';
import { DetailSkeleton }      from '../../components/common/Loaders';
import { formatINR, estimatedDelivery, placeholderImg } from '../../utils/helpers';
import { buildRoute }          from '../../constants/app.constants';
import styles                  from './ProductDetail.module.css';

// ── Image Gallery ─────────────────────────────────────────────────────────────
function Gallery({ images, name }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomed,    setZoomed]    = useState(false);

  const src = images[activeIdx] || placeholderImg(600, 600, name?.slice(0, 15));

  return (
    <div className={styles.gallery}>
      {/* Main image */}
      <div
        className={`${styles.mainImgWrap} ${zoomed ? styles.zoomed : ''}`}
        onClick={() => setZoomed(z => !z)}
        title={zoomed ? 'Click to zoom out' : 'Click to zoom in'}
      >
        <img
          src={src}
          alt={name}
          className={styles.mainImg}
          onError={e => { e.target.src = placeholderImg(600, 600, 'No Image'); }}
        />
        {!zoomed && (
          <div className={styles.zoomHint}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            Click to zoom
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className={styles.thumbs}>
          {images.map((img, i) => (
            <button
              key={i}
              className={`${styles.thumb} ${i === activeIdx ? styles.thumbActive : ''}`}
              onClick={() => { setActiveIdx(i); setZoomed(false); }}
              aria-label={`Image ${i + 1}`}
            >
              <img
                src={img}
                alt=""
                onError={e => { e.target.src = placeholderImg(64, 64, '?'); }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Star Rating ───────────────────────────────────────────────────────────────
function Stars({ rating, reviews }) {
  if (!rating) return null;
  return (
    <div className={styles.ratingRow}>
      <div className={styles.ratingPill}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff" stroke="#fff" strokeWidth="1">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        {rating.toFixed(1)}
      </div>
      {reviews > 0 && (
        <span className={styles.reviewCount}>
          {reviews.toLocaleString('en-IN')} reviews
        </span>
      )}
    </div>
  );
}

// ── Offers ────────────────────────────────────────────────────────────────────
const OFFERS = [
  { icon: '💳', text: '10% off on HDFC Bank Credit Card, up to ₹1,500' },
  { icon: '🎁', text: 'No Cost EMI available on select cards' },
  { icon: '🔄', text: '30-day easy returns & exchange' },
  { icon: '🛡️', text: '1 Year brand warranty included' },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const { productId }                   = useParams();
  const history                         = useHistory();
  const { product, isLoading, isError } = useProductDetail(productId);
  const { addToCart }                   = useCart();
  const [addedToCart, setAddedToCart]   = useState(false);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product);
    history.push('/payment');
  };

  return (
    <div className={`${styles.page} page-enter`}>
      <div className="page-container">
        {/* Breadcrumb */}
        {product && (
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link to="/" className={styles.bcLink}>Home</Link>
            <span className={styles.bcSep}>›</span>
            {product.category && (
              <>
                <Link to={buildRoute.category(product.category)} className={styles.bcLink}>
                  {product.category}
                </Link>
                <span className={styles.bcSep}>›</span>
              </>
            )}
            <span className={styles.bcCurrent}>{product.name?.slice(0, 50)}{product.name?.length > 50 ? '…' : ''}</span>
          </nav>
        )}

        {/* Loading */}
        {isLoading && <DetailSkeleton />}

        {/* Error */}
        {isError && !isLoading && (
          <div className={styles.errorBox}>
            <span className={styles.errorIcon}>⚠️</span>
            <h2>Product not found</h2>
            <p>This product may be unavailable or the server is waking up. Please try again.</p>
            <Link to="/" className={styles.homeLink}>← Back to Home</Link>
          </div>
        )}

        {/* Detail */}
        {!isLoading && !isError && product && (
          <div className={styles.detail}>
            {/* Gallery col */}
            <Gallery
              images={product.images?.length ? product.images : []}
              name={product.name}
            />

            {/* Info col */}
            <div className={styles.info}>
              {/* Category / subcategory badge */}
              <div className={styles.badges}>
                {product.subcategory && (
                  <span className={styles.badge}>{product.subcategory}</span>
                )}
                {product.stock !== null && (
                  <span className={`${styles.stockBadge} ${product.stock > 0 ? styles.inStock : styles.outStock}`}>
                    {product.stock > 0 ? `✓ In Stock${product.stock < 10 ? ` (${product.stock} left)` : ''}` : '✕ Out of Stock'}
                  </span>
                )}
              </div>

              <h1 className={styles.name}>{product.name}</h1>

              <Stars rating={product.rating} reviews={product.reviews} />

              <hr className={styles.divider} />

              {/* Pricing */}
              <div className={styles.pricingBlock}>
                <div className={styles.priceRow}>
                  <span className={styles.price}>{formatINR(product.price)}</span>
                  {product.discount > 0 && (
                    <>
                      <span className={styles.mrp}>{formatINR(product.mrp)}</span>
                      <span className={styles.discBadge}>{product.discount}% off</span>
                    </>
                  )}
                </div>
                {product.discount > 0 && (
                  <p className={styles.savings}>
                    You save {formatINR(product.mrp - product.price)} on this item
                  </p>
                )}
                <p className={styles.taxNote}>Inclusive of all taxes</p>
              </div>

              <hr className={styles.divider} />

              {/* Delivery & specs */}
              <table className={styles.specsTable}>
                <tbody>
                  <tr>
                    <td>Delivery</td>
                    <td>By <strong>{estimatedDelivery(5)}</strong> · ₹40 shipping</td>
                  </tr>
                  {product.category && (
                    <tr>
                      <td>Category</td>
                      <td>{product.category}</td>
                    </tr>
                  )}
                  {product.size?.length > 0 && (
                    <tr>
                      <td>Sizes</td>
                      <td>
                        <div className={styles.sizePills}>
                          {product.size.map(s => (
                            <span key={s} className={styles.sizePill}>{s}</span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td>Warranty</td>
                    <td>1 Year Brand Warranty</td>
                  </tr>
                  <tr>
                    <td>Returns</td>
                    <td>30-day easy returns</td>
                  </tr>
                </tbody>
              </table>

              <hr className={styles.divider} />

              {/* Offers */}
              <div className={styles.offersBlock}>
                <h3 className={styles.offersTitle}>Available Offers</h3>
                <ul className={styles.offerList}>
                  {OFFERS.map((o, i) => (
                    <li key={i} className={styles.offerItem}>
                      <span>{o.icon}</span>
                      <span>{o.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <hr className={styles.divider} />

              {/* Actions */}
              <div className={styles.actions}>
                <button
                  className={`${styles.btnCart} ${addedToCart ? styles.btnAdded : ''}`}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  {addedToCart ? (
                    <>✓ Added to Cart</>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 01-8 0"/>
                      </svg>
                      Add to Cart
                    </>
                  )}
                </button>
                <button
                  className={styles.btnBuy}
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                  Buy Now
                </button>
              </div>

              {/* Description */}
              {product.description && (
                <>
                  <hr className={styles.divider} />
                  <div className={styles.descBlock}>
                    <h3 className={styles.descTitle}>About this product</h3>
                    <p className={styles.desc}>{product.description}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
