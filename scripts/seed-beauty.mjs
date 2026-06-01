/**
 * Seed Beauty category products
 * Usage: node scripts/seed-beauty.mjs
 */
import https from 'https';

const API_BASE = 'https://eccomerce-spring-2.onrender.com';

const credentials = {
  email: 'czsubham@gmail.com',
  password: '123456789',
};

const BEAUTY_PRODUCTS = [
  {
    name: 'Maybelline Fit Me Foundation',
    description: 'Lightweight liquid foundation with SPF 18. Natural matte finish for all skin types.',
    category: 'Beauty',
    subcategory: 'Makeup',
    price: 549,
    rating: 4.5,
    reviews: 12543,
    stock: 500,
    images: ['https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=500&q=80', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80'],
    size: ['Fair', 'Medium', 'Tan', 'Deep'],
  },
  {
    name: 'Lakme Absolute Lipstick',
    description: 'High-pigment matte lipstick with vitamin E. Long-lasting 12-hour wear.',
    category: 'Beauty',
    subcategory: 'Makeup',
    price: 899,
    rating: 4.6,
    reviews: 8765,
    stock: 400,
    images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80', 'https://images.unsplash.com/photo-1599733589046-10c6f0f7c0f7?w=500&q=80'],
    size: ['Red', 'Nude', 'Rose', 'Berry'],
  },
  {
    name: 'Nivea Moisturizing Cream (200ml)',
    description: 'Deep moisturizing cream with Vitamin E and Almond Oil. Suitable for dry skin.',
    category: 'Beauty',
    subcategory: 'Skincare',
    price: 349,
    rating: 4.7,
    reviews: 23456,
    stock: 800,
    images: ['https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500&q=80', 'https://images.unsplash.com/photo-1611930022073-b7a56ba2f1b1?w=500&q=80'],
    size: ['100ml', '200ml', '400ml'],
  },
  {
    name: 'Plum Green Tea Face Wash',
    description: 'Natural green tea face wash with salicylic acid. Controls acne and oil.',
    category: 'Beauty',
    subcategory: 'Skincare',
    price: 395,
    rating: 4.4,
    reviews: 6543,
    stock: 600,
    images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&q=80', 'https://images.unsplash.com/photo-1570194065650-d99fb4ee8b39?w=500&q=80'],
    size: ['100ml', '200ml'],
  },
  {
    name: "Biotique Bio Hair Oil (200ml)",
    description: 'Ayurvedic hair oil with bhringraj, amla & coconut. Promotes hair growth.',
    category: 'Beauty',
    subcategory: 'Hair Care',
    price: 299,
    rating: 4.5,
    reviews: 18987,
    stock: 700,
    images: ['https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&q=80', 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&q=80'],
    size: ['100ml', '200ml', '450ml'],
  },
  {
    name: 'L\'Oreal Paris Shampoo (600ml)',
    description: 'Professional care shampoo with arginine and ceramide. Strengthens hair.',
    category: 'Beauty',
    subcategory: 'Hair Care',
    price: 449,
    rating: 4.3,
    reviews: 11234,
    stock: 500,
    images: ['https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=500&q=80', 'https://images.unsplash.com/photo-1558689447-e886c8e0fb07?w=500&q=80'],
    size: ['200ml', '400ml', '600ml'],
  },
  {
    name: 'Bath & Body Works Body Lotion',
    description: 'Luxurious body lotion with shea butter. Japanese cherry blossom fragrance.',
    category: 'Beauty',
    subcategory: 'Bath & Body',
    price: 1299,
    rating: 4.6,
    reviews: 7890,
    stock: 300,
    images: ['https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=500&q=80', 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80'],
    size: ['200ml', '400ml'],
  },
  {
    name: 'Mamaearth Baby Soap Pack (3 pcs)',
    description: 'Gentle natural soap with milk & oats. Chemical-free, safe for babies.',
    category: 'Beauty',
    subcategory: 'Bath & Body',
    price: 399,
    rating: 4.4,
    reviews: 5678,
    stock: 400,
    images: ['https://images.unsplash.com/photo-1600850052780-115c5df29b1b?w=500&q=80', 'https://images.unsplash.com/photo-1610992315-c11e324ca6a2?w=500&q=80'],
    size: [],
  },
  {
    name: 'Neutrogena Sunscreen SPF 50',
    description: 'Ultra-sheer dry-touch sunblock with SPF 50. Non-greasy, water resistant.',
    category: 'Beauty',
    subcategory: 'Skincare',
    price: 795,
    rating: 4.7,
    reviews: 14567,
    stock: 350,
    images: ['https://images.unsplash.com/photo-1559551740-0cce1f88f27f?w=500&q=80', 'https://images.unsplash.com/photo-1611930022073-b7a56ba2f1b1?w=500&q=80'],
    size: ['30ml', '50ml', '88ml'],
  },
  {
    name: 'Forest Essentials Face Serum',
    description: 'Premium vitamin C face serum with saffron & honey. Brightens and evens skin tone.',
    category: 'Beauty',
    subcategory: 'Skincare',
    price: 1895,
    rating: 4.8,
    reviews: 3456,
    stock: 150,
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80', 'https://images.unsplash.com/photo-1570194065650-d99fb4ee8b39?w=500&q=80'],
    size: ['15ml', '30ml'],
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
  console.log('✨ Seeding Beauty & Toys Products\n');
  const token = await login();

  console.log(`📦 Creating ${BEAUTY_PRODUCTS.length} beauty products...\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < BEAUTY_PRODUCTS.length; i++) {
    if (i > 0) await new Promise(r => setTimeout(r, 400));
    const product = BEAUTY_PRODUCTS[i];
    const res = await httpsRequest(
      `${API_BASE}/api/products`,
      { method: 'POST', headers: { Authorization: `Bearer ${token}` } },
      product
    );
    if (res.status >= 200 && res.status < 300) {
      console.log(`  ✅ [${i + 1}/${BEAUTY_PRODUCTS.length}] ${product.name} — Created`);
      success++;
    } else {
      console.log(`  ❌ [${i + 1}/${BEAUTY_PRODUCTS.length}] ${product.name} — Failed (${res.status})`);
      failed++;
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ Success: ${success}  |  ❌ Failed: ${failed}  |  📦 Total: ${BEAUTY_PRODUCTS.length}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

main().catch(console.error);