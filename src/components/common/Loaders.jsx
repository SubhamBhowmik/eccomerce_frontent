import styles from './Loaders.module.css';

export function Spinner({ size = 28 }) {
  return (
    <div
      className={styles.spinner}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  );
}

export function PageLoader() {
  return (
    <div className={styles.pageLoader}>
      <Spinner size={40} />
      <span className={styles.loaderText}>Loading…</span>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className={styles.cardSkeleton}>
      <div className={`${styles.skImg} skeleton`} />
      <div className={styles.skBody}>
        <div className={`${styles.skLine} ${styles.w80} skeleton`} />
        <div className={`${styles.skLine} ${styles.w55} skeleton`} />
        <div className={`${styles.skLine} ${styles.w40} skeleton`} />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 12 }) {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className={styles.detailSkeleton}>
      <div className={`${styles.dskImg} skeleton`} />
      <div className={styles.dskInfo}>
        <div className={`${styles.skLine} ${styles.w65} skeleton`} />
        <div className={`${styles.skLine} ${styles.w90} skeleton`} style={{ height: 28 }} />
        <div className={`${styles.skLine} ${styles.w45} skeleton`} />
        <div className={`${styles.skLine} ${styles.w30} skeleton`} style={{ height: 40 }} />
        <div className={`${styles.skLine} ${styles.w80} skeleton`} />
        <div className={`${styles.skLine} ${styles.w70} skeleton`} />
        <div className={`${styles.skLine} ${styles.w75} skeleton`} />
      </div>
    </div>
  );
}
