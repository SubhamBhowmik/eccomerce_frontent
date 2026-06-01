import { useState, useEffect } from 'react';
import { useHistory }          from 'react-router-dom';
import { useDispatch }         from 'react-redux';
import { fetchProductsByCategory } from '../../store/slices/productsSlice';
import { CATEGORIES, BANNER_SLIDES, OFFERS_MARQUEE, buildRoute } from '../../constants/app.constants';
import ProductCard             from '../../components/product/ProductCard';
import { ProductCardSkeleton } from '../../components/common/Loaders';
import productService          from '../../api/productService';
import styles                  from './Home.module.css';

// ── Offers Marquee ────────────────────────────────────────────────────────────
function OffersMarquee() {
  const doubled = [...OFFERS_MARQUEE, ...OFFERS_MARQUEE];
  return (
    <div className={styles.marquee}>
      <div className={styles.marqueeTrack}>
        {doubled.map((item, i) => (
          <span key={i} className={styles.marqueeItem}>{item}</span>
        ))}
      </div>
    </div>
  );
}

// ── Hero Banner ───────────────────────────────────────────────────────────────
function HeroBanner() {
  const [active, setActive] = useState(0);
  const history = useHistory();

  useEffect(() => {
    const id = setInterval(() => {
      setActive(a => (a + 1) % BANNER_SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const slide = BANNER_SLIDES[active];

  return (
    <div className={styles.banner}>
      {BANNER_SLIDES.map((s, i) => (
        <div
          key={i}
          className={`${styles.bannerSlide} ${i === active ? styles.bannerActive : ''}`}
          aria-hidden={i !== active}
        >
          <img src={s.bg} alt={s.title} className={styles.bannerImg} />
          <div className={styles.bannerOverlay} />
        </div>
      ))}

      <div className={styles.bannerContent}>
        <span className={styles.bannerTag}>{slide.tag}</span>
        <h1 className={styles.bannerTitle} style={{ whiteSpace: 'pre-line' }}>
          {slide.title}
        </h1>
        <p className={styles.bannerSub}>{slide.sub}</p>
        <button
          className={styles.bannerCta}
          onClick={() => history.push(buildRoute.category(slide.cta.category))}
        >
          {slide.cta.label}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </div>

      {/* Controls */}
      <button className={`${styles.bannerNav} ${styles.navPrev}`} onClick={() => setActive(a => (a - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length)} aria-label="Previous slide">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <button className={`${styles.bannerNav} ${styles.navNext}`} onClick={() => setActive(a => (a + 1) % BANNER_SLIDES.length)} aria-label="Next slide">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>

      <div className={styles.dots}>
        {BANNER_SLIDES.map((_, i) => (
          <button key={i} className={`${styles.dot} ${i === active ? styles.dotActive : ''}`} onClick={() => setActive(i)} aria-label={`Slide ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

// ── Category Grid ─────────────────────────────────────────────────────────────
function CategoryGrid() {
  const history = useHistory();
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>Shop by Category</h2>
      </div>
      <div className={styles.catGrid}>
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            className={styles.catCard}
            onClick={() => history.push(buildRoute.category(c.id))}
          >
            <span className={styles.catEmoji}>{c.emoji}</span>
            <span className={styles.catName}>{c.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

// ── Featured Section ──────────────────────────────────────────────────────────
function FeaturedSection({ title, category, emoji }) {
  const history  = useHistory();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    let alive = true;
    productService.getByCategory(category)
      .then(d => { if (alive) setProducts(d.slice(0, 8)); })
      .catch(() => {})
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [category]);

  const goCategory = () => {
    dispatch(fetchProductsByCategory(category));
    history.push(buildRoute.category(category));
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>{emoji} {title}</h2>
        <button className={styles.viewAll} onClick={goCategory}>
          View all →
        </button>
      </div>
      <div className={styles.hScroll}>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.hCard}><ProductCardSkeleton /></div>
            ))
          : products.map(p => (
              <div key={p.id} className={styles.hCard}>
                <ProductCard product={p} />
              </div>
            ))
        }
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className={`${styles.page} page-enter`}>
      <OffersMarquee />
      <HeroBanner />

      <div className={styles.content}>
        <div className="page-container">
          <CategoryGrid />
          <FeaturedSection title="Electronics"    category="Electronics" emoji="💻" />
          <FeaturedSection title="Fashion"        category="Fashion"     emoji="👗" />
          <FeaturedSection title="Top Mobiles"   category="Mobile"      emoji="📱" />
          <FeaturedSection title="Home & Kitchen" category="Home"        emoji="🏠" />
        </div>
      </div>
    </div>
  );
}