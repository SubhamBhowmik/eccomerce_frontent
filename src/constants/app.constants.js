// ─── Categories ───────────────────────────────────────────────────────────────
export const CATEGORIES = [
  { id: 'TopOffers',   label: 'Top Offers',       emoji: '🔥' },
  { id: 'Grocery',     label: 'Grocery',           emoji: '🛒' },
  { id: 'Mobile',      label: 'Mobiles',           emoji: '📱' },
  { id: 'Fashion',     label: 'Fashion',           emoji: '👗' },
  { id: 'Electronics', label: 'Electronics',       emoji: '💻' },
  { id: 'Home',        label: 'Home & Furniture',  emoji: '🏠' },
  { id: 'Appliances',  label: 'Appliances',        emoji: '❄️' },
  { id: 'Travel',      label: 'Travel',            emoji: '✈️' },
  { id: 'Beauty',      label: 'Beauty & Toys',     emoji: '✨' },
];

// ─── Route Paths ──────────────────────────────────────────────────────────────
export const ROUTES = {
  HOME:       '/',
  CATEGORY:   '/category/:categoryId',
  PRODUCT:    '/product/:productId',
  LOGIN:      '/login',
  REGISTER:   '/register',
  CART:       '/cart',
  ORDERS:     '/orders',
  NOT_FOUND:  '*',
};

export const buildRoute = {
  category: (id) => `/category/${id}`,
  product:  (id) => `/product/${id}`,
};

// ─── Redux Slice Names ────────────────────────────────────────────────────────
export const SLICE_NAMES = {
  PRODUCTS:     'products',
  CART:         'cart',
  UI:           'ui',
};

// ─── Status ───────────────────────────────────────────────────────────────────
export const LOAD_STATUS = {
  IDLE:     'idle',
  LOADING:  'loading',
  SUCCESS:  'success',
  ERROR:    'error',
};

// ─── Offers marquee ───────────────────────────────────────────────────────────
export const OFFERS_MARQUEE = [
  '🚚 Free delivery on orders over ₹499',
  '💳 10% cashback with HDFC cards',
  '📲 Exclusive app-only deals',
  '💰 No cost EMI on electronics',
  '⚡ Same-day delivery in 15 cities',
  '↩️ Easy 30-day returns',
  '🔒 100% secure payments',
];

// ─── Banner slides ────────────────────────────────────────────────────────────
export const BANNER_SLIDES = [
  {
    tag:   'MEGA DEALS',
    title: 'Electronics at\nUnbeatable Prices',
    sub:   'Up to 60% off on top brands',
    bg:    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&q=80',
    cta:   { label: 'Shop Electronics', category: 'Electronics' },
  },
  {
    tag:   'NEW ARRIVALS',
    title: 'Fashion Forward\nThis Season',
    sub:   'Latest trends, delivered fast',
    bg:    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=80',
    cta:   { label: 'Explore Fashion', category: 'Fashion' },
  },
  {
    tag:   'HOME & KITCHEN',
    title: 'Transform Your\nLiving Space',
    sub:   'Exclusive home deals available now',
    bg:    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&q=80',
    cta:   { label: 'Shop Home', category: 'Home' },
  },
  {
    tag:   'FLASH SALE',
    title: 'Mobiles at\nRecord Low Prices',
    sub:   'Trusted brands, unbeatable deals',
    bg:    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1400&q=80',
    cta:   { label: 'Shop Mobiles', category: 'Mobile' },
  },
];
