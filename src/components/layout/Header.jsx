import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useHistory }  from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCart }           from '../../hooks/useCart';
import { fetchCartAPI }      from '../../store/slices/cartSlice';
import { fetchAllProducts, selectProductList, setSearchQuery } from '../../store/slices/productsSlice';
import { toggleMobileMenu, selectMobileMenuOpen, closeMobileMenu } from '../../store/slices/uiSlice';
import { logout, selectIsAuthenticated, selectCurrentUser } from '../../store/slices/authSlice';
import { CATEGORIES, buildRoute, ROUTES }  from '../../constants/app.constants';
import { debounce }          from '../../utils/helpers';
import styles                from './Header.module.css';

// ── Search Dropdown ───────────────────────────────────────────────────────────
function SearchDropdown({ results, onSelect, visible }) {
  if (!visible || results.length === 0) return null;
  return (
    <ul className={styles.searchDropdown} role="listbox">
      {results.map(p => (
        <li
          key={p.id}
          className={styles.searchItem}
          role="option"
          onMouseDown={() => onSelect(p)}
        >
          <img
            src={p.thumbnail}
            alt=""
            className={styles.searchThumb}
            onError={e => { e.target.src = `https://placehold.co/36x36/f3f2ef/888?text=?`; }}
          />
          <div className={styles.searchMeta}>
            <span className={styles.searchName}>{p.name}</span>
            <span className={styles.searchCat}>{p.category}</span>
          </div>
          <span className={styles.searchPrice}>₹{p.price?.toLocaleString('en-IN')}</span>
        </li>
      ))}
    </ul>
  );
}

// ── Category Pill Nav ─────────────────────────────────────────────────────────
function CategoryNav() {
  const history = useHistory();
  return (
    <nav className={styles.catNav} aria-label="Product categories">
      <div className={styles.catNavInner}>
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            className={styles.catPill}
            onClick={() => history.push(buildRoute.category(c.id))}
          >
            <span className={styles.catEmoji}>{c.emoji}</span>
            <span className={styles.catLabel}>{c.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// ── Main Header ───────────────────────────────────────────────────────────────
export default function Header() {
  const dispatch          = useDispatch();
  const history           = useHistory();
  const { totalItems }    = useCart();
  const allProducts       = useSelector(selectProductList);
  const mobileMenuOpen    = useSelector(selectMobileMenuOpen);
  const isAuthenticated   = useSelector(selectIsAuthenticated);
  const user              = useSelector(selectCurrentUser);

  const [query,        setQuery]        = useState('');
  const [suggestions,  setSuggestions]  = useState([]);
  const [dropVisible,  setDropVisible]  = useState(false);
  const inputRef = useRef(null);

  // Fetch cart on initial load if user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartAPI());
    }
  }, [isAuthenticated, dispatch]);

  // Fetch all products for search if list is empty
  useEffect(() => {
    if (allProducts.length === 0) {
      dispatch(fetchAllProducts());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const debouncedSearch = useCallback(
    debounce((q) => {
      if (q.length < 2) { setSuggestions([]); return; }
      const lq = q.toLowerCase();
      setSuggestions(
        allProducts
          .filter(p => p.name.toLowerCase().includes(lq) || p.category.toLowerCase().includes(lq))
          .slice(0, 7)
      );
    }, 250),
    [allProducts]
  );

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setDropVisible(true);
    debouncedSearch(val);
  };

  const handleSelect = (product) => {
    setQuery('');
    setSuggestions([]);
    setDropVisible(false);
    history.push(buildRoute.product(product.id));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    dispatch(setSearchQuery(query));
    setDropVisible(false);
    setQuery('');
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!inputRef.current?.closest('form')?.contains(e.target)) {
        setDropVisible(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      {/* ── Top bar ── */}
      <header className={styles.header}>
        <div className={styles.inner}>
          {/* Logo */}
          <Link to="/" className={styles.logo} onClick={() => dispatch(closeMobileMenu())}>
            Shop<span className={styles.logoAccent}>India</span>
          </Link>

          {/* Search */}
          <form
            className={styles.searchForm}
            onSubmit={handleSearchSubmit}
            role="search"
          >
            <div className={styles.searchWrap} ref={inputRef}>
              <input
                type="search"
                className={styles.searchInput}
                placeholder="Search products, brands, categories…"
                value={query}
                onChange={handleQueryChange}
                onFocus={() => suggestions.length && setDropVisible(true)}
                onBlur={() => setTimeout(() => setDropVisible(false), 150)}
                aria-label="Search"
                autoComplete="off"
              />
              <button type="submit" className={styles.searchBtn} aria-label="Search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
              <SearchDropdown
                results={suggestions}
                onSelect={handleSelect}
                visible={dropVisible}
              />
            </div>
          </form>

          {/* Actions */}
          <div className={styles.actions}>
            {/* User / Login Button */}
            {isAuthenticated ? (
              <div className={styles.userMenu}>
                <span className={styles.userName}>
                  {user?.username || 'User'}
                </span>
                <button
                  className={styles.logoutBtn}
                  onClick={() => dispatch(logout())}
                  aria-label="Logout"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                </button>
              </div>
            ) : (
              <Link to={ROUTES.LOGIN} className={styles.loginBtn} aria-label="Login">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span className={styles.loginLabel}>Login</span>
              </Link>
            )}

            <Link to="/cart" className={styles.cartBtn} aria-label={`Cart, ${totalItems} items`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <span className={styles.cartLabel}>Cart</span>
              {totalItems > 0 && (
                <span className={styles.cartBadge}>{totalItems > 99 ? '99+' : totalItems}</span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              className={styles.hamburger}
              onClick={() => dispatch(toggleMobileMenu())}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className={`${styles.bar} ${mobileMenuOpen ? styles.open : ''}`} />
              <span className={`${styles.bar} ${mobileMenuOpen ? styles.open : ''}`} />
              <span className={`${styles.bar} ${mobileMenuOpen ? styles.open : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Category nav bar ── */}
      <CategoryNav />

      {/* ── Mobile drawer ── */}
      {mobileMenuOpen && (
        <div className={styles.mobileDrawer}>
          <div className={styles.drawerInner}>
            {/* Mobile user info (visible only when authenticated) */}
            {isAuthenticated && (
              <div className={styles.drawerUserSection}>
                <div className={styles.drawerUserInfo}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span className={styles.drawerUserName}>{user?.username || 'User'}</span>
                </div>
                <button
                  className={styles.drawerLogoutBtn}
                  onClick={() => {
                    dispatch(logout());
                    dispatch(closeMobileMenu());
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Logout
                </button>
              </div>
            )}
            <p className={styles.drawerTitle}>Categories</p>
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                className={styles.drawerItem}
                onClick={() => {
                  dispatch(closeMobileMenu());
                  history.push(buildRoute.category(c.id));
                }}
              >
                <span>{c.emoji}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
