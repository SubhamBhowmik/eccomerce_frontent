# ShopIndia — Enterprise MVC E-Commerce Frontend

A production-grade React e-commerce frontend built with **Redux Toolkit**, **React Router**, and **modern CSS modules**. Focuses on products: browse categories, filter & sort, view detailed product information, and add to cart (cart checkout coming next).

## 🎯 MVP Scope (Current Iteration)

✅ **Products Module:**
- Fetch products by category from 3 backend APIs
- Display in grid with lazy loading & placeholders
- Full product detail page with gallery zoom
- Search within categories
- Sort by price, rating, discount
- Filter by stock, rating, price range

⏸️ **Cart (Next Iteration):**
- Add to cart button (state only, no checkout yet)
- Cart badge with item count
- Full cart page with quantity controls

⏸️ **Auth & Orders (Future):**
- Login/Signup
- Order history
- Notifications

---

## 📂 Directory Structure

```
shopindia/
├── src/
│   ├── api/                          # API Layer (Model)
│   │   ├── httpClient.js             # HTTP wrapper
│   │   └── productService.js         # Product API calls + normalisation
│   │
│   ├── store/                        # Redux State Layer
│   │   ├── slices/
│   │   │   ├── productsSlice.js      # Product state + thunks
│   │   │   ├── cartSlice.js          # Cart state (stub)
│   │   │   └── uiSlice.js            # Toast, mobile menu
│   │   └── index.js                  # Store config
│   │
│   ├── hooks/                        # Custom hooks (View layer access to Redux)
│   │   ├── useProducts.js            # Category/list products hook
│   │   ├── useProductDetail.js       # Single product hook
│   │   └── useCart.js                # Cart hook
│   │
│   ├── components/                   # Reusable UI Components
│   │   ├── common/
│   │   │   ├── Toast.jsx             # Toast notifications
│   │   │   ├── Loaders.jsx           # Spinner, skeleton cards
│   │   │   └── *.module.css
│   │   ├── layout/
│   │   │   ├── Header.jsx            # Top bar with search
│   │   │   └── Header.module.css
│   │   └── product/
│   │       ├── ProductCard.jsx       # Product card component
│   │       ├── ProductGrid.jsx       # Product grid container
│   │       └── *.module.css
│   │
│   ├── pages/                        # Page components (full screens)
│   │   ├── Home/
│   │   │   ├── HomePage.jsx          # Home banner + featured sections
│   │   │   └── Home.module.css
│   │   ├── CategoryProducts/
│   │   │   ├── CategoryProductsPage.jsx # Category list with filters
│   │   │   └── CategoryProducts.module.css
│   │   └── ProductDetail/
│   │       ├── ProductDetailPage.jsx # Product detail page
│   │       └── ProductDetail.module.css
│   │
│   ├── constants/
│   │   ├── api.constants.js          # API endpoints
│   │   └── app.constants.js          # Routes, categories, offers
│   │
│   ├── utils/
│   │   └── helpers.js                # formatINR, truncate, etc.
│   │
│   ├── styles/
│   │   └── global.css                # Design tokens, reset, animations
│   │
│   ├── App.js                        # Router setup
│   └── index.js                      # Entry point
│
├── public/
│   └── index.html
├── package.json
└── README.md
```

---

## 🏗️ Architecture: MVC Pattern

### Model (API Layer)
- **`api/httpClient.js`** — Thin fetch wrapper with error handling
- **`api/productService.js`** — All product API calls + data normalisation
  - Decouples backend contract from internal shape
  - Returns consistent `NormalisedProduct` objects

### View (Components)
- **`components/`** — Reusable, presentational React components
  - ProductCard, ProductGrid, Toast, Loaders
  - Props-driven, zero business logic
  - Styled with CSS modules

### Controller (Redux + Hooks)
- **`store/slices/`** — Redux state + async thunks
  - `productsSlice` — Fetch categories, details, search
  - `cartSlice` — Add/remove items
  - `uiSlice` — Toast, mobile menu
- **`hooks/`** — Custom hooks wrapping Redux logic
  - `useProducts()` — Category products with filters
  - `useProductDetail()` — Single product with add-to-cart
  - `useCart()` — Cart state access

### Pages (Routes)
- **`pages/Home/`** — Homepage with banner, category grid, featured sections
- **`pages/CategoryProducts/`** — Category list + filtering sidebar
- **`pages/ProductDetail/`** — Full product view with gallery & specs

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 14+ and **npm** 6+

### Installation

```bash
# Clone / navigate to project
cd shopindia

# Install dependencies
npm install

# Start dev server
npm start
```

Dev server runs at `http://localhost:3000` (hot reload enabled).

### Build for Production

```bash
npm run build
```

Outputs optimised bundle to `build/` folder.

---

## 🎨 Design & UI

**Aesthetic Direction:** Refined Indian e-commerce — professional yet warm.

**Typography:**
- **Headings:** Playfair Display (serif, elegant)
- **Body:** DM Sans (modern, readable)
- **Mono:** JetBrains Mono (specs, prices)

**Color Palette (CSS Variables in `global.css`):**
- Navy (`--c-navy: #0f172a`) — Primary dark
- Crimson (`--c-crimson: #dc2626`) — Accent, CTAs
- Jade (`--c-jade: #16a34a`) — Success, in-stock
- Cream (`--c-cream: #faf9f6`) — Page background

**Responsive:**
- `xs`: < 480px (phones)
- `sm`: 480–767px (large phones)
- `md`: 768–1023px (tablets)
- `lg`: 1024–1279px (small laptops)
- `xl`: 1280px+ (desktops)

**Animations:**
- `fadeUp` — Page entrance
- `shimmer` — Skeleton loaders
- `marquee` — Offers scrolling
- `scale`, `slide` — Micro-interactions

---

## 🔌 API Integration

### Three Backend Services

1. **Products & Auth**
   ```
   https://eccomerce-spring-2.onrender.com
   GET  /api/products
   GET  /api/products/:id
   GET  /api/products/category/:category
   POST /login
   POST /signup
   ```

2. **Orders**
   ```
   https://eccomerce-orderhandling.onrender.com
   GET  /api/orders/user/:userId
   POST /api/orders
   ```

3. **Notifications**
   ```
   https://eccomerce-notification.onrender.com
   GET  /api/notifications/:userId
   POST /api/notifications
   ```

### Data Normalisation

All API responses are normalised to a standard shape by `productService.normaliseProduct()`:

```javascript
{
  id: string,
  name: string,
  shortName: string,
  description: string,
  category: string,
  subcategory: string,
  images: string[],
  thumbnail: string,
  price: number,         // selling price
  mrp: number,          // marked-up price
  discount: number,     // percentage
  rating: number,
  reviews: number,
  stock: number | null,
  size: string[],
  tagline: string,
  _raw: object          // original API response
}
```

This keeps the rest of the app decoupled from backend changes.

---

## 🎯 Key Features

### 1. **Category Browsing**
- **Route:** `/category/:categoryId`
- Lists all products in a category
- Responsive grid (6 cols desktop → 2 cols mobile)
- Hover effects, discount ribbons, stock badges

### 2. **Search & Filter**
- **In-header search:** Full-app product search
- **Category search:** Local filter within category page
- **Sidebar filters:**
  - In stock only
  - Min rating (0, 3, 3.5, 4, 4.5+)
  - Max price
- **Sort options:** Relevance, price (asc/desc), rating, discount

### 3. **Product Detail**
- **Route:** `/product/:productId`
- Image gallery with zoom
- Thumbnail selector
- Price, MRP, discount, stock status
- Estimated delivery date
- Specifications table (category, size, warranty, returns)
- Offers carousel (bank discounts, EMI, etc.)
- "Add to Cart" & "Buy Now" buttons

### 4. **Homepage**
- Offers marquee (scrolling promotions)
- Hero banner carousel (auto-rotating with manual nav)
- Category grid (9 categories)
- Featured sections (Electronics, Fashion, Mobiles, Home)
- Horizontal scroll product cards

### 5. **Responsive Design**
- Mobile-first approach
- Hamburger menu (mobile only)
- Adaptive grids, touch-friendly buttons
- Optimised images (lazy loading)

### 6. **State Management**
- **Redux Toolkit** slices for clean reducers
- **Async thunks** for API calls with loading states
- **Custom hooks** for view layer (useProducts, useProductDetail)
- Automatic loading/error states

### 7. **Performance**
- Skeleton loaders (shimmer effect)
- Lazy image loading
- Code splitting (route-based)
- Minimal re-renders (Redux selectors)

---

## 🛠️ Development Workflow

### Adding a New Feature

1. **Define API call** (if needed) in `api/productService.js`
2. **Create Redux slice** in `store/slices/`
3. **Build custom hook** in `hooks/` to encapsulate Redux logic
4. **Build presentational components** in `components/`
5. **Integrate in a page** under `pages/`

### Example: Add "Wishlist" Feature

```javascript
// 1. API (if backend exists)
export async function addToWishlist(productId) {
  return await httpClient.post('/api/wishlist', { productId });
}

// 2. Redux slice
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [] },
  reducers: {
    addItem(state, action) { state.items.push(action.payload); },
  },
});

// 3. Custom hook
export function useWishlist() {
  const dispatch = useDispatch();
  const items = useSelector(selectWishlistItems);
  const add = (product) => dispatch(addItem(product));
  return { items, add };
}

// 4. Component
function WishlistButton({ product }) {
  const { add } = useWishlist();
  return <button onClick={() => add(product)}>❤️ Wishlist</button>;
}

// 5. Use in page
<WishlistButton product={product} />
```

### Testing

```bash
npm test
```

(Set up Jest + React Testing Library for unit/integration tests)

---

## 📝 Styles & CSS Modules

All components use **CSS modules** for scoped styling.

### Global Design Tokens (in `styles/global.css`)

```css
:root {
  --c-navy: #0f172a;
  --c-crimson: #dc2626;
  --c-jade: #16a34a;
  --c-cream: #faf9f6;
  --sp-4: 16px;
  --r-lg: 16px;
  --shadow-lg: 0 12px 40px rgba(0,0,0,0.1);
  --t-base: 0.22s;
  --ease: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Example Component Style

```css
/* ProductCard.module.css */
.card {
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-sm);
  transition: transform var(--t-base) var(--ease);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
```

---

## 🚨 Common Issues & Debugging

### 1. **Products Not Loading**
- Check backend URLs in `constants/api.constants.js`
- Verify network tab in DevTools
- Render services may take 30s to wake up on first call

### 2. **Images Not Showing**
- Backend returns `images` array; check `api/productService.js` normalisation
- Fallback to placeholder: `onError={e => e.target.src = placeholderImg()}`

### 3. **Redux DevTools**
- Download **Redux DevTools** browser extension
- Inspect actions, state, and time-travel debug

### 4. **Mobile Menu Not Closing**
- Check `closeMobileMenu()` dispatch in Header
- Ensure click handlers on links

---

## 💳 Payment Flow Testing

The app integrates Razorpay for payment processing. Here's how to test the full checkout flow:

### Test Card Details (Razorpay Test Mode)

When you click "Proceed to Checkout" on the Cart page, you'll be taken to the payment page. Use these test credentials:

| Method | Details |
|--------|---------|
| **RuPay Card** (recommended) | `6069 0000 0000 0001` |
| Expiry | `12/28` |
| CVV | `123` |
| Name | `Test User` |
| **Netbanking** (auto-succeeds) | Select any listed bank, click Pay |

### Step-by-Step Flow

1. **Login** → Add items to cart → Go to **Cart page**
2. Click **"Proceed to Checkout"**
3. Wait for **"Placing your order..."** (calls `POST /api/orders/place`)
4. **"Complete Payment"** screen appears with test card info
5. Click **"Pay Rs.xxx"** button
6. In the Razorpay popup, enter the RuPay card details above
7. Payment succeeds → **"Payment Successful!"** with Order ID + Transaction ID ✅
8. Cart gets cleared automatically
9. Check email for order confirmation

### Troubleshooting

| Symptom | Fix |
|---------|-----|
| 401 Unauthorized | Login first (JWT token required) |
| "Cart is empty" error | Add items to cart before checkout |
| "International cards not supported" | Use **RuPay** card `6069 0000 0000 0001` instead of Visa |
| Popup doesn't open | Check browser console; refresh `/payment` page |
| Payment verification fails | Use backend's `/api/payment/test-signature` to generate valid signature |

### API Endpoints (Payment)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/orders/place` | Create order + Razorpay payment order |
| POST | `/api/payment/verify` | Verify payment signature & confirm order |
| GET | `/api/payment/test-signature?razorpayOrderId=...&razorpayPaymentId=...` | Generate test signature for debugging |

---

## 📚 Next Steps (Roadmap)

- [ ] **Cart Page:** Full cart with quantity controls, remove item, proceed to checkout
- [ ] **Order Checkout:** Payment gateway integration (Paytm, UPI, COD)
- [ ] **Auth:** Login/Signup with JWT tokens, protected routes
- [ ] **Order History:** View past orders, track shipment
- [ ] **Notifications:** Real-time order updates, promotional alerts
- [ ] **Wishlist:** Save items for later
- [ ] **Reviews & Ratings:** User product reviews
- [ ] **Admin Dashboard:** Product CRUD, inventory, analytics
- [ ] **PWA Support:** Offline browsing, install as app
- [ ] **E2E Tests:** Cypress/Playwright for user flows

---

## 📖 References

- **Redux Toolkit:** https://redux-toolkit.js.org
- **React Router v5:** https://v5.reactrouter.com
- **Design System:** All CSS vars in `global.css`
- **Components:** Browse `components/` for props and usage

---

## 📄 License

ShopIndia © 2024. Internal project.

---

**Built with ❤️ for Indian e-commerce excellence.**
