/*
  Script seed tạo dữ liệu mẫu với:
  - 1 user owner + 1 user manager (có thể trùng)
  - 1 organization, 1 restaurant, 1 menu chính
  - 28 categories đa dạng
  - 30 bàn (tables)
  - ~140 nguyên liệu (inventory_items)
  - 500 món ăn (menu_items) phân bố theo category
  - 500 recipes (mỗi món 1 recipe)
  - recipe_ingredients: 3-8 nguyên liệu / món (khoảng 2500-3000 dòng)

  Chạy:  npx ts-node prisma/seeds/seed-500-menu-items.ts  (đảm bảo đã build prisma client: npx prisma generate)
*/

import { PrismaClient, Prisma } from '@prisma/client';
import { randomUUID, randomBytes } from 'crypto';

const prisma = new PrismaClient();

// Helper tạo slug
const slugify = (s: string) => s.toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 100);

// Danh sách category (cố gắng bao phủ nhiều nhóm)
const CATEGORY_NAMES = [
  'Món Việt Truyền Thống', 'Phở & Bún Mỳ', 'Cơm & Cơm Niêu', 'Món Nướng & BBQ',
  'Hải Sản', 'Món Chay', 'Salad & Gỏi', 'Súp & Cháo', 'Dim Sum & Hấp', 'Mì Ý & Pasta',
  'Burger & Sandwich', 'Pizza', 'Ăn Nhanh Fusion', 'Món Nhật', 'Món Hàn', 'Món Thái',
  'Món Hoa', 'Món Âu', 'Tráng Miệng', 'Bánh Ngọt & Pastry', 'Kem & Gelato', 'Nước Ép & Detox',
  'Cà Phê & Trà', 'Sinh Tố & Smoothie', 'Cocktail Không Cồn', 'Nước Uống Có Gas', 'Đặc Sản Vùng Miền', 'Set Combo'
];

// Bảng phân loại logic để sinh nguyên liệu phù hợp
const CATEGORY_TAGS: Record<string, string[]> = {
  'Món Việt Truyền Thống': ['thit-heo','nuoc-mam','hanh','toi','ot','tieu','rau-thom'],
  'Phở & Bún Mỳ': ['banh-pho','xuong-bo','thit-bo','hanh','rau-thom','gia','chanh','ot'],
  'Cơm & Cơm Niêu': ['gao','thit-heo','thit-ga','nuoc-mam','dau-hanh'],
  'Món Nướng & BBQ': ['thit-bo','thit-heo','thit-ga','mat-ong','tieu','toi'],
  'Hải Sản': ['tom','muc','ca','ngheu','squid-ink','gừng','toi'],
  'Món Chay': ['dau-hu','nam-huong','rau-cu','hat-dieu','rau-thom','tuong'],
  'Salad & Gỏi': ['rau-xanh','dau-oliu','ca-ngu','trung-ga','hat-quinoa','dau-giam'],
  'Súp & Cháo': ['gao','nuoc-dung-ga','nam','hanh','tieu'],
  'Dim Sum & Hấp': ['bot-mi','thit-heo','tom','hanh-la','nam-huong'],
  'Mì Ý & Pasta': ['pasta','tomato','olive-oil','toi','pho-mai','hung-que'],
  'Burger & Sandwich': ['banh-mi-burger','thit-bo','xalat','ca-chua','phomai','hanh-tay'],
  'Pizza': ['bot-pizza','tomato','phomai','olive-oil','xuc-xich','nam'],
  'Ăn Nhanh Fusion': ['ga-ran','khoai-tay','tuong-ot','mayonnaise'],
  'Món Nhật': ['gao-nhat','ca-hoi','rong-bien','nuoc-tuong','wasabi'],
  'Món Hàn': ['kimchi','banh-gao','thit-bo','tuong-ot-han','toi'],
  'Món Thái': ['la-chanh','sa','ot','nuoc-ca','nuoc-cot-dua','tom'],
  'Món Hoa': ['nam-dong-co','dau-hao','thit-heo','bot-nang','hanh-la'],
  'Món Âu': ['bo-uc','khoai-tay','bo-que','bot-mi','bo-cream'],
  'Tráng Miệng': ['duong','trung-ga','bot-mi','sua','socola','trai-cay'],
  'Bánh Ngọt & Pastry': ['bot-mi','bo-cream','trung-ga','duong','socola'],
  'Kem & Gelato': ['sua','kem-sua','vanilla','socola','trai-cay'],
  'Nước Ép & Detox': ['tao','cam','dua-hau','carrot','rau-ma','chanh'],
  'Cà Phê & Trà': ['ca-phe-hat','tra-xanh','sua-dac','duong'],
  'Sinh Tố & Smoothie': ['chuoi','xoai','dua','sua-chua','yogurt'],
  'Cocktail Không Cồn': ['chanh','bac-ha','soda','giam-dua'],
  'Nước Uống Có Gas': ['nuoc-khoang','syrup','chanh'],
  'Đặc Sản Vùng Miền': ['thit-trau','la-mac-khen','com-lam','thit-heo','ca-kho'],
  'Set Combo': ['thit-bo','pasta','salad','nuoc-ngot']
};

// Kho nguyên liệu mẫu (một phần sẽ dùng trong tags trên) - đặt id trước để map.
// Chúng ta sinh động bằng cách kết hợp các nhóm; những nguyên liệu chung cung cấp đa dạng.
interface IngredientDef { name: string; unit: string; baseQuantity?: number; tagKeys?: string[] }

const CORE_INGREDIENTS: IngredientDef[] = [
  { name: 'Gạo thơm Jasmine', unit: 'kg', tagKeys: ['gao'] },
  { name: 'Gạo Nhật', unit: 'kg', tagKeys: ['gao-nhat'] },
  { name: 'Bánh phở tươi', unit: 'kg', tagKeys: ['banh-pho'] },
  { name: 'Xương bò', unit: 'kg', tagKeys: ['xuong-bo'] },
  { name: 'Thịt bò thăn', unit: 'kg', tagKeys: ['thit-bo'] },
  { name: 'Thịt heo ba rọi', unit: 'kg', tagKeys: ['thit-heo'] },
  { name: 'Thịt gà ta', unit: 'kg', tagKeys: ['thit-ga'] },
  { name: 'Tôm sú', unit: 'kg', tagKeys: ['tom'] },
  { name: 'Mực ống', unit: 'kg', tagKeys: ['muc'] },
  { name: 'Cá hồi phi lê', unit: 'kg', tagKeys: ['ca-hoi'] },
  { name: 'Cá biển tươi', unit: 'kg', tagKeys: ['ca'] },
  { name: 'Ngao tươi', unit: 'kg', tagKeys: ['ngheu'] },
  { name: 'Đậu hũ non', unit: 'block', tagKeys: ['dau-hu'] },
  { name: 'Nấm hương khô', unit: 'kg', tagKeys: ['nam-huong','nam'] },
  { name: 'Rau củ hỗn hợp', unit: 'kg', tagKeys: ['rau-cu','rau-xanh'] },
  { name: 'Hạt điều rang', unit: 'kg', tagKeys: ['hat-dieu'] },
  { name: 'Quinoa', unit: 'kg', tagKeys: ['hat-quinoa'] },
  { name: 'Hành lá', unit: 'kg', tagKeys: ['hanh-la','hanh'] },
  { name: 'Hành tây', unit: 'kg', tagKeys: ['hanh-tay','hanh'] },
  { name: 'Tỏi khô', unit: 'kg', tagKeys: ['toi'] },
  { name: 'Ớt tươi', unit: 'kg', tagKeys: ['ot'] },
  { name: 'Tiêu đen', unit: 'kg', tagKeys: ['tieu'] },
  { name: 'Gừng tươi', unit: 'kg', tagKeys: ['gừng'] },
  { name: 'Rau thơm hỗn hợp', unit: 'kg', tagKeys: ['rau-thom'] },
  { name: 'Nước mắm cá cơm', unit: 'l', tagKeys: ['nuoc-mam'] },
  { name: 'Dầu hào', unit: 'l', tagKeys: ['dau-hao'] },
  { name: 'Dầu ô liu Extra Virgin', unit: 'l', tagKeys: ['dau-oliu','olive-oil'] },
  { name: 'Bơ lạt', unit: 'kg', tagKeys: ['bo-cream'] },
  { name: 'Kem tươi whipping', unit: 'l', tagKeys: ['kem-sua'] },
  { name: 'Sữa tươi', unit: 'l', tagKeys: ['sua'] },
  { name: 'Sữa đặc', unit: 'l', tagKeys: ['sua-dac'] },
  { name: 'Pho mát Mozzarella', unit: 'kg', tagKeys: ['phomai','pho-mai'] },
  { name: 'Pho mát Parmesan', unit: 'kg', tagKeys: ['pho-mai'] },
  { name: 'Bột mì đa dụng', unit: 'kg', tagKeys: ['bot-mi'] },
  { name: 'Bột pizza', unit: 'kg', tagKeys: ['bot-pizza'] },
  { name: 'Pasta Spaghetti', unit: 'kg', tagKeys: ['pasta'] },
  { name: 'Pasta Penne', unit: 'kg', tagKeys: ['pasta'] },
  { name: 'Cà chua tươi', unit: 'kg', tagKeys: ['tomato','ca-chua'] },
  { name: 'Sốt cà chua', unit: 'kg', tagKeys: ['tomato'] },
  { name: 'Lá húng quế', unit: 'kg', tagKeys: ['hung-que'] },
  { name: 'Xúc xích Ý', unit: 'kg', tagKeys: ['xuc-xich'] },
  { name: 'Bánh mì burger', unit: 'pcs', tagKeys: ['banh-mi-burger'] },
  { name: 'Xà lách Romaine', unit: 'kg', tagKeys: ['xalat','rau-xanh'] },
  { name: 'Khoai tây', unit: 'kg', tagKeys: ['khoai-tay'] },
  { name: 'Mayonnaise', unit: 'kg', tagKeys: ['mayonnaise'] },
  { name: 'Tương ớt', unit: 'kg', tagKeys: ['tuong-ot'] },
  { name: 'Tương ớt Hàn Gochujang', unit: 'kg', tagKeys: ['tuong-ot-han'] },
  { name: 'Nước cốt dừa', unit: 'l', tagKeys: ['nuoc-cot-dua'] },
  { name: 'Sả cây', unit: 'kg', tagKeys: ['sa'] },
  { name: 'Lá chanh Thái', unit: 'kg', tagKeys: ['la-chanh'] },
  { name: 'Kimchi cải thảo', unit: 'kg', tagKeys: ['kimchi'] },
  { name: 'Bánh gạo Hàn', unit: 'kg', tagKeys: ['banh-gao'] },
  { name: 'Rong biển nori', unit: 'pack', tagKeys: ['rong-bien'] },
  { name: 'Nước tương Nhật', unit: 'l', tagKeys: ['nuoc-tuong'] },
  { name: 'Wasabi', unit: 'kg', tagKeys: ['wasabi'] },
  { name: 'Giấm gạo', unit: 'l', tagKeys: ['giam-dua'] },
  { name: 'Thịt bò Úc', unit: 'kg', tagKeys: ['bo-uc'] },
  { name: 'Bơ que', unit: 'kg', tagKeys: ['bo-que'] },
  { name: 'Nấm đông cô', unit: 'kg', tagKeys: ['nam-dong-co'] },
  { name: 'Bột năng', unit: 'kg', tagKeys: ['bot-nang'] },
  { name: 'Đường cát trắng', unit: 'kg', tagKeys: ['duong'] },
  { name: 'Trứng gà', unit: 'chục', tagKeys: ['trung-ga'] },
  { name: 'Sô cô la đen', unit: 'kg', tagKeys: ['socola'] },
  { name: 'Vani chiết xuất', unit: 'l', tagKeys: ['vanilla'] },
  { name: 'Chuối', unit: 'kg', tagKeys: ['chuoi'] },
  { name: 'Xoài chín', unit: 'kg', tagKeys: ['xoai'] },
  { name: 'Dừa nạo', unit: 'kg', tagKeys: ['dua'] },
  { name: 'Sữa chua không đường', unit: 'kg', tagKeys: ['sua-chua','yogurt'] },
  { name: 'Táo đỏ', unit: 'kg', tagKeys: ['tao'] },
  { name: 'Cam sành', unit: 'kg', tagKeys: ['cam'] },
  { name: 'Dưa hấu', unit: 'kg', tagKeys: ['dua-hau'] },
  { name: 'Cà rốt', unit: 'kg', tagKeys: ['carrot'] },
  { name: 'Rau má', unit: 'kg', tagKeys: ['rau-ma'] },
  { name: 'Chanh tươi', unit: 'kg', tagKeys: ['chanh'] },
  { name: 'Bạc hà', unit: 'kg', tagKeys: ['bac-ha','rau-thom'] },
  { name: 'Syrup đường', unit: 'l', tagKeys: ['syrup'] },
  { name: 'Nước khoáng có gas', unit: 'l', tagKeys: ['nuoc-khoang'] },
  { name: 'Hạt cà phê rang', unit: 'kg', tagKeys: ['ca-phe-hat'] },
  { name: 'Trà xanh matcha', unit: 'kg', tagKeys: ['tra-xanh'] },
  { name: 'Thịt trâu gác bếp', unit: 'kg', tagKeys: ['thit-trau'] },
  { name: 'Lá mắc khén', unit: 'kg', tagKeys: ['la-mac-khen'] },
  { name: 'Cơm lam', unit: 'ong', tagKeys: ['com-lam'] },
  { name: 'Mực mực (squid ink)', unit: 'kg', tagKeys: ['squid-ink'] },
  { name: 'Hạnh nhân lát', unit: 'kg', tagKeys: ['hat-dieu'] },
  { name: 'Hạt óc chó', unit: 'kg', tagKeys: ['hat-dieu'] },
  { name: 'Rau rocket', unit: 'kg', tagKeys: ['rau-xanh'] },
  { name: 'Phô mai xanh', unit: 'kg', tagKeys: ['pho-mai'] },
  { name: 'Mat ong rừng', unit: 'kg', tagKeys: ['mat-ong'] },
  { name: 'Dầu hành phi', unit: 'l', tagKeys: ['dau-hanh'] },
  { name: 'Tương (Soy paste)', unit: 'kg', tagKeys: ['tuong'] },
  { name: 'Nước dùng gà', unit: 'l', tagKeys: ['nuoc-dung-ga'] },
  { name: 'Nấm mỡ', unit: 'kg', tagKeys: ['nam'] },
  { name: 'Rau gia vị Ý mix', unit: 'kg', tagKeys: ['hung-que'] },
  { name: 'Bột cacao', unit: 'kg', tagKeys: ['socola'] },
  { name: 'Dâu tây', unit: 'kg', tagKeys: ['trai-cay'] },
  { name: 'Việt quất', unit: 'kg', tagKeys: ['trai-cay'] },
  { name: 'Mâm xôi', unit: 'kg', tagKeys: ['trai-cay'] },
  { name: 'Xoài sấy dẻo', unit: 'kg', tagKeys: ['trai-cay','xoai'] },
  { name: 'Hạt chia', unit: 'kg', tagKeys: ['hat-quinoa'] },
  { name: 'Bột yến mạch', unit: 'kg', tagKeys: ['pasta'] },
];

// Sinh thêm một số nguyên liệu giả lập
for (let i = 0; i < 40; i++) {
  CORE_INGREDIENTS.push({ name: `Gia vị tổng hợp đặc biệt ${i+1}`, unit: 'kg', tagKeys: ['toi','tieu','ot'] });
}

// Danh sách tên món nền tảng (đủ đa dạng) sẽ được kết hợp biến thể để đạt 500
const BASE_DISH_NAMES = [
  'Phở Bò Tái', 'Phở Gà', 'Bún Chả Hà Nội', 'Bún Bò Huế', 'Bánh Mì Thịt Nướng', 'Bánh Mì Gà Xé', 'Cơm Tấm Sườn Bì Chả', 'Cơm Gà Hải Nam',
  'Bánh Xèo Tôm Thịt', 'Gỏi Cuốn Tôm Thịt', 'Chả Giò Rế', 'Bánh Cuốn Thanh Trì', 'Mì Quảng Gà', 'Hủ Tiếu Nam Vang', 'Bánh Canh Cua',
  'Lẩu Thái Hải Sản', 'Lẩu Riêu Cua', 'Lẩu Nấm Chay', 'Gà Nướng Mật Ong', 'Sườn Nướng BBQ', 'Bò Nướng Lá Lốt', 'Cá Hấp Xì Dầu',
  'Tôm Hấp Sả', 'Mực Nướng Sa Tế', 'Gỏi Hải Sản Thái', 'Salad Caesar', 'Salad Hy Lạp', 'Salad Quinoa Rau Củ', 'Súp Bí Đỏ Kem',
  'Súp Hải Sản Chua Cay', 'Cháo Gà Xé', 'Cháo Hải Sản', 'Dim Sum Tôm', 'Há Cảo Nấm', 'Xíu Mại Trứng Cút', 'Bánh Bao Xá Xíu',
  'Mì Ý Bolognese', 'Mì Ý Carbonara', 'Penne Pesto Gà', 'Spaghetti Hải Sản', 'Pizza Margherita', 'Pizza Pepperoni', 'Pizza Hải Sản',
  'Burger Bò Phô Mai', 'Burger Gà Giòn', 'Sandwich Gà Nướng', 'Sandwich Cá Ngừ', 'Sushi Cá Hồi', 'Sushi Thập Cẩm', 'Maki Rong Biển Chay',
  'Sashimi Tổng Hợp', 'Cơm Cuộn Lươn', 'Ramen Shoyu', 'Udon Hải Sản', 'Tempura Tôm', 'Takoyaki', 'Okonomiyaki', 'Gà Rán Karaage',
  'Canh Kimchi', 'Bibimbap', 'Gimbap Bò', 'Tokbokki Phô Mai', 'Lẩu Kimchi', 'Pad Thai Tôm', 'Tom Yum', 'Som Tum Đu Đủ', 'Cà Ri Xanh Thái',
  'Massaman Curry', 'Gỏi Bò Thái', 'Dumpling Chiên', 'Đậu Hũ Tứ Xuyên', 'Gà Kung Pao', 'Bò Sốt Tiêu Đen', 'Mực Xào Cần Tỏi', 'Tôm Rang Muối',
  'Steak Bò Mỹ Medium', 'Sườn Cừu Nướng Thảo Mộc', 'Cá Hồi Đút Lò', 'Risotto Nấm', 'Khoai Tây Nghiền', 'Gà Đút Lò Lá Thym', 'Bánh Panna Cotta',
  'Crème Brûlée', 'Tiramisu', 'Cheesecake Dâu', 'Bánh Mousse Socola', 'Bánh Croissant Bơ', 'Bánh Sừng Bò Hạnh Nhân', 'Bánh Su Kem', 'Bánh Tarte Chanh',
  'Kem Vanilla', 'Kem Socola Đắng', 'Gelato Trái Cây Nhiệt Đới', 'Kem Matcha', 'Nước Ép Cam Cà Rốt', 'Nước Ép Táo Cần Tây', 'Detox Xanh', 'Sinh Tố Xoài Chuối',
  'Smoothie Dâu Việt Quất', 'Sinh Tố Bơ', 'Trà Sữa Matcha', 'Cà Phê Sữa Đá', 'Cà Phê Cold Brew', 'Trà Đào Cam Sả', 'Mocktail Mojito Bạc Hà', 'Mocktail Sunrise',
  'Soda Chanh Muối', 'Nước Ngọt Cola', 'Đặc Sản Thịt Trâu Gác Bếp', 'Cơm Lam Gà Nướng', 'Cá Kho Tộ', 'Set Combo Phở + Gỏi Cuốn', 'Set Combo Burger + Khoai',
  'Set Combo Sushi + Tempura'
];

// Số món cần: 500
const TOTAL_DISHES = 500;

// Tạo danh sách 500 tên (kết hợp biến thể nếu vượt base)
const dishNames: string[] = [];
while (dishNames.length < TOTAL_DISHES) {
  for (const base of BASE_DISH_NAMES) {
    if (dishNames.length >= TOTAL_DISHES) break;
    if (!dishNames.includes(base)) {
      dishNames.push(base);
    } else {
      const variantSuffixes = ['Đặc Biệt', 'Cao Cấp', 'Phiên Bản Chay', 'Cay', 'Ít Tinh Bột', 'Lành Mạnh', 'Lựa Chọn Của Bếp Trưởng', 'Theo Mùa', 'Phiên Bản Mini'];
      const suffix = variantSuffixes[Math.floor(Math.random() * variantSuffixes.length)];
      const variant = `${base} ${suffix}`;
      if (!dishNames.includes(variant)) dishNames.push(variant);
    }
  }
}

// Phân loại món vào category theo index vòng tròn
const categoryCount = CATEGORY_NAMES.length;

// Hàm chọn giá trị thập phân
const randomPrice = (idx: number) => {
  const base = 30000 + (idx % 50) * 1500 + Math.floor(Math.random()*5000); // 30k -> ~110k
  return (Math.round(base/100)*100).toString();
};

// Map nguyên liệu theo tag để chọn cho recipe
interface InventoryItemSeed { id: string; name: string; unit: string; quantity: string; unit_cost?: string; tags: string[] }
const inventoryItems: InventoryItemSeed[] = CORE_INGREDIENTS.map(i => ({
  id: randomUUID(),
  name: i.name,
  unit: i.unit,
  quantity: (50 + Math.random()*150).toFixed(2),
  unit_cost: (10000 + Math.random()*90000).toFixed(2),
  tags: i.tagKeys || []
}));

// Tạo nhanh index tag -> item ids
const tagIndex: Record<string, InventoryItemSeed[]> = {};
for (const it of inventoryItems) {
  for (const t of it.tags) {
    if (!tagIndex[t]) tagIndex[t] = [];
    tagIndex[t].push(it);
  }
}

// Chọn nguyên liệu cho 1 category
const pickIngredientsForCategory = (categoryName: string, needed: number) => {
  const tags = CATEGORY_TAGS[categoryName] || [];
  const pool = tags.flatMap(t => tagIndex[t] || []);
  const unique = Array.from(new Set(pool.map(p => p.id))).map(id => inventoryItems.find(i => i.id === id)!);
  if (unique.length === 0) return inventoryItems.sort(() => 0.5 - Math.random()).slice(0, needed);
  const out: InventoryItemSeed[] = [];
  for (let i=0; i<needed; i++) {
    out.push(unique[i % unique.length]);
  }
  return out;
};

async function main() {
  console.time('seed-500-menu-items');

  // User owner & manager
  const ownerId = randomUUID();
  const managerId = randomUUID();
  const now = new Date();
  const runSuffix = Date.now().toString(36).slice(-6);

  // Tạo user với hậu tố để tránh trùng lặp khi chạy nhiều lần
  await prisma.users.create({ data: {
    id: ownerId,
    username: `owner_demo_${runSuffix}`,
    email: `owner_${runSuffix}@example.com`,
    first_name: 'Owner',
    last_name: 'Demo',
    full_name: 'Owner Demo',
    role: 'admin'
  }});
  await prisma.users.create({ data: {
    id: managerId,
    username: `manager_demo_${runSuffix}`,
    email: `manager_${runSuffix}@example.com`,
    first_name: 'Manager',
    last_name: 'Demo',
    full_name: 'Manager Demo',
    role: 'manager'
  }});

  const organizationId = randomUUID();
  await prisma.organizations.create({ data: {
    id: organizationId,
    name: 'Demo F&B Group',
    code: `DEMOFB_${runSuffix}`,
    owner_id: ownerId,
    description: 'Tổ chức demo phục vụ seed dữ liệu 500 món ăn'
  }});

  const restaurantId = randomUUID();
  await prisma.restaurants.create({ data: {
    id: restaurantId,
    organization_id: organizationId,
    code: `RST${runSuffix}`,
    name: 'Nhà Hàng Demo Đa Dạng',
    address: '123 Đường Ẩm Thực, Quận 1, TP.HCM',
    manager_id: managerId,
    status: 'active'
  }});

  // Tạo menu chính
  const menuId = randomUUID();
  await prisma.menus.create({ data: {
    id: menuId,
    restaurant_id: restaurantId,
    name: `Menu Chính 2025 ${runSuffix}`,
    description: 'Menu tự động seed 500 món đa dạng'
  }});

  // Categories
  const categoriesData = CATEGORY_NAMES.map((name, i) => ({
    id: randomUUID(),
    name,
    slug: slugify(name + '-' + runSuffix),
    display_order: i,
    description: `Nhóm: ${name}`
  }));
  await prisma.categories.createMany({ data: categoriesData });

  // Tables (30 bàn)
  const tablesData = Array.from({ length: 30 }, (_, i) => ({
    id: randomUUID(),
    restaurant_id: restaurantId,
    table_number: (i+1).toString().padStart(2,'0'),
    capacity: [2,4,4,6,8][i%5],
    location: ['Tầng 1','Tầng 2','Ban công','Sân vườn','Phòng VIP'][i%5],
    status: 'available' as const
  }));
  await prisma.tables.createMany({ data: tablesData });

  // Inventory Items
  await prisma.inventory_items.createMany({ data: inventoryItems.map(ii => ({
    id: ii.id,
    restaurant_id: restaurantId,
    name: ii.name,
    unit: ii.unit,
    quantity: ii.quantity as any,
    unit_cost: ii.unit_cost as any,
    description: 'Nguyên liệu seed tự động'
  })) });

  // Menu Items + Recipes + Recipe Ingredients
  const menuItemsData: Prisma.menu_itemsCreateManyInput[] = [];
  const recipesData: Prisma.recipesCreateManyInput[] = [];
  // recipe ingredients sẽ insert theo batch sau (cần biết recipe_id)

  const categoryCycle = categoriesData;
  for (let i = 0; i < dishNames.length; i++) {
    const name = dishNames[i];
    const category = categoryCycle[i % categoryCycle.length];
    const id = randomUUID();
    const price = randomPrice(i);
    const prepTime = 5 + (i % 25);
    menuItemsData.push({
      id,
      menu_id: menuId,
      category_id: category.id,
      name,
      price: price as any,
      description: `Món: ${name} thuộc nhóm ${category.name}`,
      is_available: true,
      is_featured: i % 37 === 0,
      preparation_time: prepTime,
      calories: 80 + (i % 500),
      allergens: i % 11 === 0 ? ['gluten'] : [],
      dietary_info: (name.toLowerCase().includes('chay') || name.toLowerCase().includes('salad')) ? ['vegetarian'] : []
    });
    const recipeId = randomUUID();
    recipesData.push({
      id: recipeId,
      menu_item_id: id,
      name: `Recipe ${name}`,
      description: `Công thức cho ${name}`,
      instructions: 'Chuẩn bị nguyên liệu, sơ chế, nấu theo trình tự chuẩn và trình bày đẹp mắt.',
      prep_time: Math.min(prepTime, 30),
      cook_time: 5 + (i % 40),
      serving_size: 1
    });
  }

  // Insert menu_items (batch)
  for (let start = 0; start < menuItemsData.length; start += 100) {
    await prisma.menu_items.createMany({ data: menuItemsData.slice(start, start + 100) });
  }
  // Insert recipes (batch)
  for (let start = 0; start < recipesData.length; start += 200) {
    await prisma.recipes.createMany({ data: recipesData.slice(start, start + 200) });
  }

  // Tạo map recipe theo category chọn nguyên liệu
  const recipeIngredientRows: Prisma.recipe_ingredientsCreateManyInput[] = [];
  for (let i = 0; i < recipesData.length; i++) {
    const recipe = recipesData[i]!; // non-null assertion
    const cat = categoryCycle[i % categoryCycle.length];
    const ingredientPool = pickIngredientsForCategory(cat.name, 12);
    const ingredientCount = 3 + (i % 6); // 3-8
    const picked = ingredientPool.slice(0, ingredientCount);
    for (const ing of picked) {
      recipeIngredientRows.push({
        id: randomUUID(),
        recipe_id: recipe.id!,
        inventory_item_id: ing.id,
        quantity: (0.05 + Math.random() * 0.4).toFixed(2) as any,
        unit: ing.unit
      });
    }
  }
  for (let start = 0; start < recipeIngredientRows.length; start += 500) {
    await prisma.recipe_ingredients.createMany({ data: recipeIngredientRows.slice(start, start + 500) });
  }

  console.log(`Đã tạo: ${categoriesData.length} categories, ${tablesData.length} tables, ${inventoryItems.length} nguyên liệu, ${menuItemsData.length} món, ${recipesData.length} recipes, ${recipeIngredientRows.length} dòng recipe_ingredients.`);
  console.timeEnd('seed-500-menu-items');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
