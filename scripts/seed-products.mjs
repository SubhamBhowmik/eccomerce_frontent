/**
 * Seed Products Script
 * Usage: node scripts/seed-products.mjs
 *
 * Logs in with user credentials, gets a JWT token,
 * then POSTs sample products for all categories.
 */
import https from 'https';

const API_BASE = 'https://eccomerce-spring-2.onrender.com';

const credentials = {
  email: 'czsubham@gmail.com',
  password: '123456789',
};

const PRODUCTS = [
  // ── 🔥 Top Offers ──
  {
    name: 'Premium Wireless Headphones',
    description: 'Noise-cancelling over-ear headphones with 30hr battery life and deep bass.',
    category: 'TopOffers',
    subcategory: 'Electronics',
    price: 2499,
    rating: 4.6,
    reviews: 1842,
    stock: 200,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80'],
    size: [],
  },
  {
    name: 'Smart Watch Pro',
    description: 'Fitness tracker with AMOLED display, SpO2 monitor, and 7-day battery.',
    category: 'TopOffers',
    subcategory: 'Wearables',
    price: 3999,
    rating: 4.4,
    reviews: 956,
    stock: 150,
    images: ['https://images.unsplash.com/photo-1546868871-af0de0ae72e1?w=500&q=80', 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80'],
    size: [],
  },
  {
    name: 'Combo Deal: 4 Casual T-Shirts',
    description: 'Pack of 4 premium cotton t-shirts. Available in multiple colors.',
    category: 'TopOffers',
    subcategory: 'Fashion',
    price: 999,
    rating: 4.3,
    reviews: 3210,
    stock: 500,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&q=80'],
    size: ['S', 'M', 'L', 'XL', 'XXL'],
  },

  // ── 🛒 Grocery ──
  {
    name: 'Organic Basmati Rice (5kg)',
    description: 'Premium aged basmati rice, directly sourced from Punjab farms.',
    category: 'Grocery',
    subcategory: 'Rice & Grains',
    price: 649,
    rating: 4.7,
    reviews: 4521,
    stock: 1000,
    images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80'],
    size: [],
  },
  {
    name: 'Fortune Sunflower Oil (1L)',
    description: 'Pure refined sunflower oil for healthy cooking.',
    category: 'Grocery',
    subcategory: 'Cooking Oils',
    price: 175,
    rating: 4.5,
    reviews: 8723,
    stock: 2000,
    images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80'],
    size: [],
  },
  {
    name: 'Tata Tea Premium (500g)',
    description: 'Rich and strong tea blend, perfect for morning chai.',
    category: 'Grocery',
    subcategory: 'Tea & Coffee',
    price: 265,
    rating: 4.6,
    reviews: 12450,
    stock: 3000,
    images: ['https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80'],
    size: [],
  },
  {
    name: 'Amul Butter (500g)',
    description: 'Creamy, delicious butter made from fresh milk.',
    category: 'Grocery',
    subcategory: 'Dairy',
    price: 275,
    rating: 4.8,
    reviews: 9876,
    stock: 1500,
    images: ['https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&q=80'],
    size: [],
  },

  // ── 📱 Mobiles ──
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: '12GB RAM, 256GB storage, 200MP camera, S Pen included.',
    category: 'Mobile',
    subcategory: 'Smartphones',
    price: 94999,
    rating: 4.7,
    reviews: 2341,
    stock: 50,
    images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80'],
    size: ['256GB', '512GB', '1TB'],
  },
  {
    name: 'iPhone 15 Pro Max',
    description: 'A17 Pro chip, 48MP camera system, titanium design.',
    category: 'Mobile',
    subcategory: 'Smartphones',
    price: 119900,
    rating: 4.8,
    reviews: 5678,
    stock: 30,
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80', 'https://images.unsplash.com/photo-1695541938698-475e8b75f40e?w=500&q=80'],
    size: ['256GB', '512GB', '1TB'],
  },
  {
    name: 'OnePlus Nord CE 4',
    description: 'Snapdragon 7 Gen 3, 100W charging, 50MP Sony camera.',
    category: 'Mobile',
    subcategory: 'Smartphones',
    price: 24999,
    rating: 4.4,
    reviews: 1432,
    stock: 200,
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80'],
    size: ['128GB', '256GB'],
  },
  {
    name: 'Realme Narzo 70 Pro',
    description: '5G smartphone with 50MP OIS camera and 120Hz AMOLED display.',
    category: 'Mobile',
    subcategory: 'Smartphones',
    price: 16999,
    rating: 4.3,
    reviews: 892,
    stock: 300,
    images: ['https://images.unsplash.com/photo-1616348436168-de43ad0a1790?w=500&q=80'],
    size: ['128GB'],
  },

  // ── 👗 Fashion ──
  {
    name: "Men's Slim Fit Blazer",
    description: 'Premium linen blazer perfect for weddings and formal events.',
    category: 'Fashion',
    subcategory: "Men's Clothing",
    price: 2999,
    rating: 4.5,
    reviews: 654,
    stock: 100,
    images: ['https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=500&q=80', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80'],
    size: ['38', '40', '42', '44'],
  },
  {
    name: "Women's Silk Saree",
    description: 'Handwoven Banarasi silk saree with gold zari work.',
    category: 'Fashion',
    subcategory: "Women's Clothing",
    price: 5499,
    rating: 4.8,
    reviews: 2134,
    stock: 80,
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80', 'https://images.unsplash.com/photo-1583396060819-ab46c37c68b1?w=500&q=80'],
    size: [],
  },
  {
    name: 'Nike Air Max Sneakers',
    description: 'Comfortable running shoes with Air Max cushioning.',
    category: 'Fashion',
    subcategory: 'Footwear',
    price: 7995,
    rating: 4.6,
    reviews: 3421,
    stock: 150,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80'],
    size: ['7', '8', '9', '10', '11'],
  },
  {
    name: "Kids' Denim Jacket",
    description: 'Stylish denim jacket for boys and girls, ages 4-12.',
    category: 'Fashion',
    subcategory: "Kids' Clothing",
    price: 1299,
    rating: 4.3,
    reviews: 876,
    stock: 200,
    images: ['https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=500&q=80'],
    size: ['4-5Y', '6-7Y', '8-9Y', '10-12Y'],
  },

  // ── 💻 Electronics ──
  {
    name: 'MacBook Air M3',
    description: 'Apple M3 chip, 16GB RAM, 512GB SSD, 18-hour battery.',
    category: 'Electronics',
    subcategory: 'Laptops',
    price: 114900,
    rating: 4.7,
    reviews: 1876,
    stock: 40,
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80', 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&q=80'],
    size: ['256GB', '512GB', '1TB'],
  },
  {
    name: 'Sony 65" OLED 4K TV',
    description: 'XR OLED with Dolby Vision, Dolby Atmos, and Google TV.',
    category: 'Electronics',
    subcategory: 'Televisions',
    price: 129990,
    rating: 4.6,
    reviews: 543,
    stock: 20,
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&q=80'],
    size: ['55"', '65"', '77"'],
  },
  {
    name: 'Canon EOS R50 Mirrorless Camera',
    description: '24.2MP APS-C sensor, 4K video, RF mount, lightweight.',
    category: 'Electronics',
    subcategory: 'Cameras',
    price: 64999,
    rating: 4.5,
    reviews: 432,
    stock: 35,
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80', 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&q=80'],
    size: [],
  },
  {
    name: 'JBL PartyBox 310',
    description: 'Portable Bluetooth speaker with powerful bass and light show.',
    category: 'Electronics',
    subcategory: 'Audio',
    price: 27999,
    rating: 4.4,
    reviews: 1234,
    stock: 60,
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80'],
    size: [],
  },

  // ── 🏠 Home & Furniture ──
  {
    name: 'Queen Size Bed with Storage',
    description: 'Engineered wood bed frame with hydraulic storage and headboard.',
    category: 'Home',
    subcategory: 'Bedroom',
    price: 25999,
    rating: 4.4,
    reviews: 765,
    stock: 25,
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&q=80'],
    size: ['Queen', 'King'],
  },
  {
    name: '3-Seater Fabric Sofa',
    description: 'Modern L-shaped sofa with washable covers and memory foam.',
    category: 'Home',
    subcategory: 'Living Room',
    price: 34999,
    rating: 4.5,
    reviews: 543,
    stock: 15,
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=500&q=80'],
    size: ['3-Seater', 'L-Shape'],
  },
  {
    name: 'Adjustable Study Table',
    description: 'Height-adjustable desk with cable management and shelf.',
    category: 'Home',
    subcategory: 'Study Furniture',
    price: 8999,
    rating: 4.3,
    reviews: 1232,
    stock: 80,
    images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&q=80'],
    size: [],
  },
  {
    name: 'Decorative Floor Lamp',
    description: 'Tripod wooden floor lamp with warm LED bulb, dimmable.',
    category: 'Home',
    subcategory: 'Lighting',
    price: 3499,
    rating: 4.2,
    reviews: 876,
    stock: 120,
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=500&q=80'],
    size: [],
  },

  // ── ❄️ Appliances ──
  {
    name: 'Samsung 7kg Front Load Washer',
    description: 'EcoBubble technology, digital inverter motor, 5-year warranty.',
    category: 'Appliances',
    subcategory: 'Washing Machines',
    price: 32990,
    rating: 4.5,
    reviews: 2345,
    stock: 40,
    images: ['https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500&q=80'],
    size: ['7kg', '8kg', '9kg'],
  },
  {
    name: 'LG 260L Frost-Free Refrigerator',
    description: 'Smart Inverter Compressor, multi-air flow, stabilizer-free.',
    category: 'Appliances',
    subcategory: 'Refrigerators',
    price: 27990,
    rating: 4.6,
    reviews: 4567,
    stock: 35,
    images: ['https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500&q=80'],
    size: ['190L', '260L', '320L'],
  },
  {
    name: 'Havells 1.5 Ton Split AC',
    description: '5-star energy rating, copper condenser, turbo cooling.',
    category: 'Appliances',
    subcategory: 'Air Conditioners',
    price: 42999,
    rating: 4.4,
    reviews: 1876,
    stock: 50,
    images: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&q=80'],
    size: ['1 Ton', '1.5 Ton', '2 Ton'],
  },
  {
    name: 'Philips Air Fryer XXL',
    description: 'Fat removal technology, 7.3L capacity, 14 cooking presets.',
    category: 'Appliances',
    subcategory: 'Kitchen Appliances',
    price: 10999,
    rating: 4.5,
    reviews: 6543,
    stock: 100,
    images: ['https://images.unsplash.com/photo-1599796901407-0f0c81a6b8d1?w=500&q=80'],
    size: ['4.5L', '7.3L'],
  },

  // ── ✈️ Travel ──
  {
    name: 'American Tourister 55cm Cabin Bag',
    description: 'Hard-shell polypropylene luggage with 4 dual spinner wheels.',
    category: 'Travel',
    subcategory: 'Luggage',
    price: 4999,
    rating: 4.3,
    reviews: 3456,
    stock: 200,
    images: ['https://images.unsplash.com/photo-1565022536202-cf2f7e7d94ed?w=500&q=80', 'https://images.unsplash.com/photo-1581553870738-9b8a5b1f3d5a?w=500&q=80'],
    size: ['55cm', '65cm', '75cm'],
  },
  {
    name: 'Travel Adapter Universal',
    description: 'Worldwide travel adapter with 4 USB ports and fast charging.',
    category: 'Travel',
    subcategory: 'Travel Accessories',
    price: 1499,
    rating: 4.4,
    reviews: 2341,
    stock: 300,
    images: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&q=80'],
    size: [],
  },
  {
    name: 'Wildcraft 45L Backpack',
    description: 'Water-resistant trekking backpack with padded straps and rain cover.',
    category: 'Travel',
    subcategory: 'Backpacks',
    price: 2999,
    rating: 4.6,
    reviews: 5678,
    stock: 150,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80', 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500&q=80'],
    size: ['35L', '45L', '60L'],
  },
];

// ─── Helper: HTTPS request wrapper ───────────────────────────────────
function httpsRequest(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const opts = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: data ? JSON.parse(data) : null, raw: data });
        } catch {
          resolve({ status: res.statusCode, data: null, raw: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function login() {
  console.log('🔑 Logging in...');
  const res = await httpsRequest(
    `${API_BASE}/api/auth/login`,
    { method: 'POST' },
    credentials
  );

  if (res.status !== 200) {
    throw new Error(`Login failed (${res.status}): ${res.raw}`);
  }

  const token = res.data.accessToken || res.data.token || res.data.access_token;
  console.log(`✅ Logged in as: ${res.data.username || credentials.email}`);
  return token;
}

async function createProduct(token, product, index, total) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await httpsRequest(
    `${API_BASE}/api/products`,
    { method: 'POST', headers },
    product
  );

  if (res.status >= 200 && res.status < 300) {
    const id = res.data?.id || res.data?._id || 'unknown';
    console.log(`  ✅ [${index + 1}/${total}] ${product.name} — Created (ID: ${id})`);
    return true;
  } else {
    console.log(`  ❌ [${index + 1}/${total}] ${product.name} — Failed (${res.status}): ${(res.raw || '').slice(0, 120)}`);
    return false;
  }
}

async function main() {
  console.log('🚀 ShopIndia Product Seeder\n');

  let token;
  try {
    token = await login();
  } catch (err) {
    console.error(err.message);
    console.log('\n💡 Trying without auth...');
  }

  console.log(`\n📦 Seeding ${PRODUCTS.length} products...\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < PRODUCTS.length; i++) {
    if (i > 0) await new Promise(r => setTimeout(r, 400));
    const ok = await createProduct(token, PRODUCTS[i], i, PRODUCTS.length);
    if (ok) success++;
    else failed++;
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ Success: ${success}  |  ❌ Failed: ${failed}  |  📦 Total: ${PRODUCTS.length}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

main().catch(console.error);
