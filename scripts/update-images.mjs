/**
 * Update product images with real Unsplash URLs
 * Usage: node scripts/update-images.mjs
 *
 * Fetches all existing products, maps by name,
 * and updates each with real product images.
 */
import https from 'https';

const API_BASE = 'https://eccomerce-spring-2.onrender.com';

const credentials = {
  email: 'czsubham@gmail.com',
  password: '123456789',
};

const PRODUCT_IMAGES = {
  'Premium Wireless Headphones': [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80',
  ],
  'Smart Watch Pro': [
    'https://images.unsplash.com/photo-1546868871-af0de0ae72e1?w=500&q=80',
    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80',
  ],
  'Combo Deal: 4 Casual T-Shirts': [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&q=80',
  ],
  'Organic Basmati Rice (5kg)': [
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80',
  ],
  'Fortune Sunflower Oil (1L)': [
    'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80',
  ],
  'Tata Tea Premium (500g)': [
    'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80',
  ],
  'Amul Butter (500g)': [
    'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&q=80',
  ],
  'Samsung Galaxy S24 Ultra': [
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80',
    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80',
  ],
  'iPhone 15 Pro Max': [
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80',
    'https://images.unsplash.com/photo-1695541938698-475e8b75f40e?w=500&q=80',
  ],
  'OnePlus Nord CE 4': [
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80',
  ],
  'Realme Narzo 70 Pro': [
    'https://images.unsplash.com/photo-1616348436168-de43ad0a1790?w=500&q=80',
  ],
  "Men's Slim Fit Blazer": [
    'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=500&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80',
  ],
  "Women's Silk Saree": [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80',
    'https://images.unsplash.com/photo-1583396060819-ab46c37c68b1?w=500&q=80',
  ],
  'Nike Air Max Sneakers': [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80',
  ],
  "Kids' Denim Jacket": [
    'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=500&q=80',
  ],
  'MacBook Air M3': [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&q=80',
  ],
  'Sony 65" OLED 4K TV': [
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&q=80',
  ],
  'Canon EOS R50 Mirrorless Camera': [
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&q=80',
  ],
  'JBL PartyBox 310': [
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80',
  ],
  'Queen Size Bed with Storage': [
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&q=80',
  ],
  '3-Seater Fabric Sofa': [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80',
    'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=500&q=80',
  ],
  'Adjustable Study Table': [
    'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&q=80',
  ],
  'Decorative Floor Lamp': [
    'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=500&q=80',
  ],
  'Samsung 7kg Front Load Washer': [
    'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500&q=80',
  ],
  'LG 260L Frost-Free Refrigerator': [
    'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500&q=80',
  ],
  'Havells 1.5 Ton Split AC': [
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&q=80',
  ],
  'Philips Air Fryer XXL': [
    'https://images.unsplash.com/photo-1599796901407-0f0c81a6b8d1?w=500&q=80',
  ],
  'American Tourister 55cm Cabin Bag': [
    'https://images.unsplash.com/photo-1565022536202-cf2f7e7d94ed?w=500&q=80',
    'https://images.unsplash.com/photo-1581553870738-9b8a5b1f3d5a?w=500&q=80',
  ],
  'Travel Adapter Universal': [
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&q=80',
  ],
  'Wildcraft 45L Backpack': [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
    'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500&q=80',
  ],
};

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

async function getAllProducts(token) {
  const res = await httpsRequest(`${API_BASE}/api/products`, { headers: { Authorization: `Bearer ${token}` } });
  if (res.status !== 200) throw new Error(`Fetch products failed: ${res.raw}`);
  console.log(`📦 Fetched ${res.data.length} products from DB\n`);
  return res.data;
}

async function updateProductImages(token, product) {
  const images = PRODUCT_IMAGES[product.name];
  if (!images) {
    console.log(`  ⏭️  [${product.name}] — No image mapping found, skipping`);
    return false;
  }

  const payload = {
    name: product.name,
    description: product.description,
    category: product.category,
    subcategory: product.subcategory,
    price: product.price,
    stock: product.stock,
    rating: product.rating || 0,
    reviews: product.reviews || 0,
    size: product.size || [],
    images: images,
  };

  const res = await httpsRequest(
    `${API_BASE}/api/products/${product.id || product._id}`,
    { method: 'PUT', headers: { Authorization: `Bearer ${token}` } },
    payload
  );

  if (res.status >= 200 && res.status < 300) {
    console.log(`  ✅ [${product.name}] — Images updated (${images.length} images)`);
    return true;
  } else {
    console.log(`  ❌ [${product.name}] — Failed (${res.status}): ${(res.raw || '').slice(0, 100)}`);
    return false;
  }
}

async function main() {
  console.log('🖼️  ShopIndia Product Image Updater\n');

  const token = await login();
  const products = await getAllProducts(token);

  let success = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < products.length; i++) {
    if (i > 0) await new Promise(r => setTimeout(r, 300));
    const images = PRODUCT_IMAGES[products[i].name];
    if (!images) {
      console.log(`  ⏭️  [${products[i].name}] — No image mapping, skipping`);
      skipped++;
      continue;
    }
    const ok = await updateProductImages(token, products[i]);
    if (ok) success++;
    else failed++;
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ Updated: ${success}  |  ⏭️  Skipped: ${skipped}  |  ❌ Failed: ${failed}  |  📦 Total: ${products.length}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

main().catch(console.error);