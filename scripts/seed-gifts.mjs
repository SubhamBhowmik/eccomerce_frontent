/**
 * Seed Gifts category products
 * Usage: node scripts/seed-gifts.mjs
 */
import https from 'https';

const API_BASE = 'https://eccomerce-spring-2.onrender.com';

const credentials = {
  email: 'czsubham@gmail.com',
  password: '123456789',
};

const GIFT_PRODUCTS = [
  {
    name: 'Personalized Photo Frame',
    description: 'Custom engraved wooden photo frame. Perfect for birthdays, anniversaries, and special moments.',
    category: 'Gifts',
    subcategory: 'Personalized Gifts',
    price: 499,
    rating: 4.6,
    reviews: 2341,
    stock: 300,
    images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&q=80', 'https://images.unsplash.com/photo-1607453998774-d533f65dac99?w=500&q=80'],
    size: [],
  },
  {
    name: 'Luxury Gift Hamper',
    description: 'Premium assorted gift hamper with chocolates, dry fruits, and gourmet treats. Beautifully packaged.',
    category: 'Gifts',
    subcategory: 'Gift Hampers',
    price: 1999,
    rating: 4.7,
    reviews: 1876,
    stock: 150,
    images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80', 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=500&q=80'],
    size: [],
  },
  {
    name: 'Teddy Bear Gift Set',
    description: 'Cute plush teddy bear with a heart-shaped cushion and chocolates. Ideal for Valentine\'s Day.',
    category: 'Gifts',
    subcategory: 'Soft Toys',
    price: 799,
    rating: 4.5,
    reviews: 3456,
    stock: 400,
    images: ['https://images.unsplash.com/photo-1562040506-a9b32cb51b94?w=500&q=80', 'https://images.unsplash.com/photo-1559454403-b8fb1d1a2e0a?w=500&q=80'],
    size: ['12"', '18"', '24"'],
  },
  {
    name: 'Scented Candle Gift Box',
    description: 'Set of 6 hand-poured scented candles in a premium gift box. Lavender, vanilla, and sandalwood.',
    category: 'Gifts',
    subcategory: 'Home Decor Gifts',
    price: 1299,
    rating: 4.4,
    reviews: 1234,
    stock: 250,
    images: ['https://images.unsplash.com/photo-1602874801006-e26c4c5b6e5a?w=500&q=80', 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&q=80'],
    size: [],
  },
  {
    name: 'Engraved Watch for Him',
    description: 'Classic analog watch with personalized engraving on the back. Stainless steel strap.',
    category: 'Gifts',
    subcategory: 'Personalized Gifts',
    price: 2499,
    rating: 4.6,
    reviews: 987,
    stock: 120,
    images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&q=80', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'],
    size: [],
  },
  {
    name: 'Chocolate Bouquet',
    description: 'Handcrafted bouquet made of premium Belgian chocolates. A sweet surprise for any occasion.',
    category: 'Gifts',
    subcategory: 'Gift Hampers',
    price: 1499,
    rating: 4.8,
    reviews: 2345,
    stock: 200,
    images: ['https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&q=80', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80'],
    size: [],
  },
  {
    name: 'Custom Name Necklace',
    description: 'Elegant gold-plated necklace with your loved one\'s name. Comes in a velvet gift box.',
    category: 'Gifts',
    subcategory: 'Jewellery Gifts',
    price: 1899,
    rating: 4.7,
    reviews: 1567,
    stock: 180,
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80', 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=500&q=80'],
    size: [],
  },
  {
    name: 'Gourmet Coffee Gift Set',
    description: 'Premium coffee beans from 4 regions with a French press and ceramic mug. Perfect for coffee lovers.',
    category: 'Gifts',
    subcategory: 'Gift Hampers',
    price: 1699,
    rating: 4.5,
    reviews: 876,
    stock: 150,
    images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80'],
    size: [],
  },
  {
    name: 'Birthday Surprise Box',
    description: 'Complete birthday celebration kit with balloons, cake topper, confetti, and a personalized card.',
    category: 'Gifts',
    subcategory: 'Celebration Gifts',
    price: 999,
    rating: 4.6,
    reviews: 1987,
    stock: 300,
    images: ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80', 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=500&q=80'],
    size: [],
  },
  {
    name: 'Silver Photo Locket',
    description: '925 sterling silver locket with space for two photos. A timeless keepsake gift.',
    category: 'Gifts',
    subcategory: 'Jewellery Gifts',
    price: 2199,
    rating: 4.8,
    reviews: 654,
    stock: 100,
    images: ['https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&q=80', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80'],
    size: [],
  },
];

function httpsRequest(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const opts = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: { 'Content-Type': 'application/json', ...options.headers },
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data), raw: data }); }
        catch { resolve({ status: res.statusCode, data: null, raw: data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function login() {
  console.log('🔑 Logging in...');
  const res = await httpsRequest(`${API_BASE}/api/auth/login`, { method: 'POST' }, credentials);
  if (res.status !== 200) throw new Error(`Login failed: ${res.raw}`);
  const token = res.data.accessToken || res.data.token || res.data.access_token;
  console.log(`✅ Logged in as: ${res.data.username}`);
  return token;
}

async function main() {
  console.log('🎁 Seeding Gifts Products\n');
  const token = await login();

  console.log(`📦 Creating ${GIFT_PRODUCTS.length} gift products...\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < GIFT_PRODUCTS.length; i++) {
    if (i > 0) await new Promise(r => setTimeout(r, 400));
    const product = GIFT_PRODUCTS[i];
    const res = await httpsRequest(
      `${API_BASE}/api/products`,
      { method: 'POST', headers: { Authorization: `Bearer ${token}` } },
      product
    );
    if (res.status >= 200 && res.status < 300) {
      console.log(`  ✅ [${i + 1}/${GIFT_PRODUCTS.length}] ${product.name} — Created`);
      success++;
    } else {
      console.log(`  ❌ [${i + 1}/${GIFT_PRODUCTS.length}] ${product.name} — Failed (${res.status})`);
      failed++;
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ Success: ${success}  |  ❌ Failed: ${failed}  |  📦 Total: ${GIFT_PRODUCTS.length}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

main().catch(console.error);