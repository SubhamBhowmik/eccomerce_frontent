# ShopIndia Setup & Quick Start

## 📦 Installation & Running

### Step 1: Install Dependencies
```bash
cd shopindia
npm install
```

### Step 2: Start Development Server
```bash
npm start
```

The app will open at `http://localhost:3000` with hot reload enabled.

### Step 3: Build for Production
```bash
npm run build
```

Output goes to `shopindia/build/` folder.

---

## 🗂️ Complete File Manifest

### Core Application Files
```
shopindia/
├── src/
│   ├── App.js                                 ← Router setup
│   ├── index.js                               ← Entry point
│   │
│   ├── api/
│   │   ├── httpClient.js                      ← Fetch wrapper
│   │   └── productService.js                  ← Product API calls
│   │
│   ├── store/
│   │   ├── index.js                           ← Redux store config
│   │   └── slices/
│   │       ├── productsSlice.js               ← Product state + thunks
│   │       ├── cartSlice.js                   ← Cart state (stub)
│   │       └── uiSlice.js                     ← Toast, menu state
│   │
│   ├── hooks/
│   │   ├── useProducts.js                     ← Category products hook
│   │   ├── useProductDetail.js                ← Single product hook
│   │   └── useCart.js                         ← Cart total hook
│   │
│   ├── constants/
│   │   ├── api.constants.js                   ← API endpoints
│   │   └── app.constants.js                   ← Routes, categories, offers
│   │
│   ├── utils/
│   │   └── helpers.js                         ← formatINR, truncate, etc.
│   │
│   ├── styles/
│   │   └── global.css                         ← Design tokens, animations
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Toast.jsx
│   │   │   ├── Toast.module.css
│   │   │   ├── Loaders.jsx
│   │   │   └── Loaders.module.css
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   └── Header.module.css
│   │   └── product/
│   │       ├── ProductCard.jsx
│   │       ├── ProductCard.module.css
│   │       ├── ProductGrid.jsx
│   │       └── ProductGrid.module.css
│   │
│   └── pages/
│       ├── Home/
│       │   ├── HomePage.jsx
│       │   └── Home.module.css
│       ├── CategoryProducts/
│       │   ├── CategoryProductsPage.jsx
│       │   └── CategoryProducts.module.css
│       └── ProductDetail/
│           ├── ProductDetailPage.jsx
│           └── ProductDetail.module.css
│
├── public/
│   └── index.html
├── package.json
├── .gitignore
├── README.md
└── SETUP.md (this file)
```

---

## 🎯 Feature Checklist (Current MVP)

✅ **Homepage**
- Offers marquee
- Hero banner carousel (auto-rotating)
- Category grid
- Featured product sections (Electronics, Fashion, Mobiles, Home)

✅ **Category Page** (`/category/:categoryId`)
- Product grid with lazy loading
- Sidebar filters (stock, rating, price)
- Sort options (relevance, price, rating, discount)
- Local search within category
- Responsive grid (6 cols → 2 cols)

✅ **Product Detail** (`/product/:productId`)
- Image gallery with zoom
- Thumbnail selector
- Pricing with discount calculation
- Stock status
- Specifications table
- Available offers
- Add to Cart button
- Buy Now button

✅ **Global Features**
- Header with search & cart badge
- Category navigation bar
- Toast notifications
- Skeleton loaders
- Mobile responsive design
- Dark/light text contrast

⏸️ **Not Yet Implemented**
- Cart page & checkout
- Auth & orders
- Notifications
- Wishlist

---

## 🔑 Key Technology Decisions

### Why Redux Toolkit?
- Cleaner boilerplate than vanilla Redux
- Built-in immer for immutability
- Async thunks for API calls
- Great DevTools integration

### Why CSS Modules?
- Scoped styles (no global conflicts)
- CSS-in-JS alternative (lighter than Styled Components)
- Easy to maintain alongside components
- Mobile-first media queries

### Why React Router v5?
- Stable, widely used
- Simple nested routing
- URL-based navigation with browser history

### API Design
- Centralised `httpClient.js` for all fetch calls
- `productService.js` normalises all data
- Loose coupling between UI and backend

---

## 📝 Code Examples

### Adding a Product to Cart

```javascript
// In a component
import { useProductDetail } from '../hooks/useProductDetail';

function ProductCard({ productId }) {
  const { product, addToCart } = useProductDetail(productId);
  
  return (
    <button onClick={() => addToCart(product)}>
      Add to Cart
    </button>
  );
}
```

### Using Products Hook

```javascript
import { useProducts } from '../hooks/useProducts';

function CategoryPage() {
  const { products, isLoading, search } = useProducts('Electronics');
  
  return (
    <>
      <input onChange={(e) => search(e.target.value)} />
      {isLoading ? <Spinner /> : <ProductGrid products={products} />}
    </>
  );
}
```

### Styling a Component

```css
/* Button.module.css */
.button {
  background: var(--c-crimson);
  color: #fff;
  padding: var(--sp-4);
  border-radius: var(--r-lg);
  transition: background var(--t-base) var(--ease);
  border: none;
  cursor: pointer;
}

.button:hover {
  background: #b91c1c;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

@media (max-width: 480px) {
  .button { padding: var(--sp-3); }
}
```

```jsx
// Button.jsx
import styles from './Button.module.css';

export default function Button({ children, ...props }) {
  return <button className={styles.button} {...props}>{children}</button>;
}
```

---

## 🔧 Troubleshooting

### Issue: "Cannot find module 'productService'"
**Solution:** Check relative import path in your file. The path should be relative to the file you're in.
```javascript
// ❌ Wrong (from src/pages/Home/HomePage.jsx)
import productService from './productService';

// ✅ Correct
import productService from '../../api/productService';
```

### Issue: Styles not applying
**Solution:** Make sure you're importing the CSS module correctly.
```javascript
// ❌ Wrong
import './ProductCard.css';
import ProductCard from './ProductCard';

// ✅ Correct
import ProductCard from './ProductCard';
import styles from './ProductCard.module.css';

// Then use
<div className={styles.cardName}>
```

### Issue: Redux not updating
**Solution:** Check that you're using selectors correctly.
```javascript
// ❌ Wrong
const products = useSelector(state => state.products);  // selector fn every render

// ✅ Correct
import { selectProductList } from '../store/slices/productsSlice';
const products = useSelector(selectProductList);  // memoized selector
```

### Issue: Backend returning 403 errors
**Solution:** Render services wake up after inactivity. Wait 30 seconds and retry.

---

## 🚀 Performance Checklist

- [ ] Images use lazy loading (`loading="lazy"`)
- [ ] Fallback placeholder images for broken images
- [ ] Skeleton loaders during data fetch
- [ ] Redux selectors memoised (avoid inline arrow functions)
- [ ] CSS animations use `transform` and `opacity` (GPU-accelerated)
- [ ] Debounced search input (250ms)
- [ ] No inline object/array creation in render

---

## 📚 Learning Resources

1. **Redux Toolkit Guide:** https://redux-toolkit.js.org/tutorials/overview
2. **React Hooks:** https://react.dev/reference/react/hooks
3. **CSS Module Patterns:** https://css-modules.github.io
4. **Responsive Design:** https://web.dev/responsive-web-design-basics/

---

## 🎓 Best Practices in This Project

✅ **Separation of Concerns**
- API logic in `api/`
- State management in `store/`
- Presentational components in `components/`
- Page wrappers in `pages/`

✅ **Naming Conventions**
- Files: `camelCase.js` or `PascalCase.jsx`
- Components: PascalCase
- CSS Classes: kebab-case
- Constants: UPPER_SNAKE_CASE

✅ **Performance**
- Functional components with hooks
- Memoised selectors
- Lazy image loading
- Code splitting at route level

✅ **Styling**
- CSS modules for scoping
- CSS variables for theming
- Mobile-first responsive design
- Accessibility (ARIA labels, semantic HTML)

---

## 📞 Support & Questions

For issues or questions:
1. Check the README.md for architecture overview
2. Check SETUP.md (this file) for common issues
3. Inspect Redux state with DevTools
4. Check browser console for errors
5. Verify API endpoints in `constants/api.constants.js`

---

**Happy coding! 🎉**
