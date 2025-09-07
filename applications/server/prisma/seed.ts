/* prisma/seed.ts */
import { PrismaClient, Prisma } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

// Helper random
const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

async function main() {

  // 1. User tối thiểu (owner + manager giả lập)
  const owner = await prisma.users.upsert({
    where: { email: 'owner@example.com' },
    update: {},
    create: {
      id: uuidv4(),
      username: 'owner',
      email: 'owner@example.com',
      first_name: 'Owner',
      last_name: 'System',
      full_name: 'Owner System',
      role: 'admin',
      status: 'active'
    }
  })

  const manager = await prisma.users.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: {
      id: uuidv4(),
      username: 'manager',
      email: 'manager@example.com',
      first_name: 'Restaurant',
      last_name: 'Manager',
      full_name: 'Restaurant Manager',
      role: 'manager',
      status: 'active'
    }
  })

  // 2. Organization
  const org = await prisma.organizations.upsert({
    where: { code: 'ORG_MAIN' },
    update: {},
    create: {
      id: uuidv4(),
      name: 'Tasty Group',
      code: 'ORG_MAIN',
      owner_id: owner.id
    }
  })

  // 3. Restaurant
  const restaurant = await prisma.restaurants.upsert({
    where: { 
      organization_id_code: { 
        code: 'R001', 
        organization_id: org.id 
      } 
    },
    update: {},
    create: {
      id: uuidv4(),
      organization_id: org.id,
      code: 'R001',
      name: 'Nhà Hàng Trung Tâm',
      address: '123 Đường Ẩm Thực, Quận 1',
      manager_id: manager.id,
      status: 'active'
    }
  })

  // 4. Menu chính
  const menu = await prisma.menus.create({
    data: {
      id: uuidv4(),
      restaurant_id: restaurant.id,
      name: 'Menu Chính',
      is_active: true
    }
  })

  // 5. Categories
  const categoryDefs = [
    { code: 'soup', name: 'Món Nước' },
    { code: 'appetizer', name: 'Khai Vị' },
    { code: 'rice', name: 'Cơm' },
    { code: 'noodle', name: 'Mì/Bún' },
    { code: 'hotpot', name: 'Lẩu' },
    { code: 'main', name: 'Món Chính' },
    { code: 'salad', name: 'Salad' },
    { code: 'western', name: 'Âu' },
    { code: 'street', name: 'Đường Phố' },
    { code: 'dessert', name: 'Tráng Miệng' },
    { code: 'drink', name: 'Đồ Uống' },
    { code: 'dim_sum', name: 'Dim Sum' },
    { code: 'special', name: 'Đặc Biệt' }
  ]

  const categoryMap: Record<string, string> = {}
  for (const c of categoryDefs) {
    const cat = await prisma.categories.upsert({
      where: { slug: c.code },
      update: {},
      create: {
        id: uuidv4(),
        name: c.name,
        slug: c.code,
        is_active: true
      }
    })
    categoryMap[c.code] = cat.id
  }

  // 6. Inventory Items (nguyên liệu)
  const inventoryDefs = [
    'gao','banh_pho','bun_tuoi','mi_trung','thit_bo','thit_ga','suon_heo','thit_lon','tom_tuoi','muc_tuoi','ca_hoi','ca_ngu','ca_trang','ech','bach_tuoc','rau_thom','hanh_la','hanh_tay','toi','gung','sa','ot','ca_chua','khoai_tay','nam_rom','nam_dong_co','dau_hu','trung_ga','trung_cut','dau_nanh','dau_phong','me_den','dau_hao','nuoc_tuong','nuoc_mam','duong_cat','muoi','tieu_den','bot_ngot','bot_bap','bot_mi','dau_oliu','dau_me','dau_dieu','pho_mai','sua_tuoi','kem_tuoi','bot_ca_ri','la_chanh','la_qua_que','chanhsanh','chanh_day','xoai','dau_tay','bo','dua_dua','hat_sen','rong_bien','bot_tra_xanh','bot_ca_cao'
  ]

  const inventoryMap: Record<string,string> = {}
  for (const name of inventoryDefs) {
    const inv = await prisma.inventory_items.create({
      data: {
        id: uuidv4(),
        restaurant_id: restaurant.id,
        name,
        unit: 'gram',
        quantity: new Prisma.Decimal(rand(5000,12000)),
        unit_cost: new Prisma.Decimal(rand(10,200)),
      }
    })
    inventoryMap[name] = inv.id
  }

  // 7. Danh sách 200 món (tên + category code) – nén vào mảng
  const dishes: { name: string; category: string }[] = [
    // (đưa đúng thứ tự 1..200 như đã liệt kê trên)
    ['Phở Bò Truyền Thống','soup'],['Phở Gà Ta','soup'],['Bún Bò Huế','soup'],['Hủ Tiếu Nam Vang','soup'],['Miến Gà Nấm','soup'],['Cháo Sườn Non','soup'],['Cháo Hải Sản','soup'],['Canh Chua Cá','soup'],['Canh Rau Củ','soup'],['Canh Kim Chi Đậu Phụ','soup'],
    ['Gỏi Cuốn Tôm Thịt','appetizer'],['Chả Giò Rế','appetizer'],['Đậu Hũ Chiên Sả','appetizer'],['Bánh Gạo Lắc Phô Mai','appetizer'],['Khoai Tây Chiên Tỏi','appetizer'],['Cánh Gà Chiên Nước Mắm','appetizer'],['Bánh Xèo Tôm','appetizer'],['Gỏi Bò Rau Thơm','appetizer'],['Bánh Cuốn Thịt','appetizer'],['Bánh Khọt Tôm','appetizer'],
    ['Cơm Tấm Sườn Bì Chả','rice'],['Cơm Gà Hải Nam','rice'],['Cơm Chiên Dương Châu','rice'],['Cơm Chiên Trứng','rice'],['Cơm Rang Thịt Bò','rice'],['Cơm Rang Hải Sản','rice'],['Cơm Sườn Nướng','rice'],['Cơm Thịt Kho Trứng','rice'],['Cơm Cá Kho Tộ','rice'],['Cơm Chay Thập Cẩm','rice'],
    ['Bún Thịt Nướng','noodle'],['Bún Chả Hà Nội','noodle'],['Bún Đậu Mắm Tôm','noodle'],['Bún Cá Nha Trang','noodle'],['Bún Riêu Cua','noodle'],['Bún Nghêu Sả Ớt','noodle'],['Mì Xào Bò','noodle'],['Mì Xào Hải Sản','noodle'],['Mì Udon Xào Gà','noodle'],['Mì Trộn Sa Tế','noodle'],
    ['Lẩu Thái Hải Sản','hotpot'],['Lẩu Gà Lá É','hotpot'],['Lẩu Bò Nhúng Dấm','hotpot'],['Lẩu Nấm Chay','hotpot'],['Lẩu Cá Măng Chua','hotpot'],['Lẩu Riêu Cua','hotpot'],['Lẩu Ếch Măng Cay','hotpot'],['Lẩu Kim Chi Thịt Bò','hotpot'],['Lẩu Tứ Xuyên','hotpot'],['Lẩu Thập Cẩm','hotpot'],
    ['Bò Lúc Lắc','main'],['Bò Kho Bánh Mì','main'],['Thịt Kho Trứng Cút','main'],['Gà Kho Gừng','main'],['Gà Rang Muối','main'],['Gà Nướng Mật Ong','main'],['Cá Kho Lạt','main'],['Cá Chiên Sốt Chanh','main'],['Tôm Rang Me','main'],['Mực Xào Cần','main'],
    ['Sườn Nướng BBQ','main'],['Sườn Rim Mặn','main'],['Ba Chỉ Rim Mắm','main'],['Thịt Bằm Sốt Cà','main'],['Thịt Viên Sốt Tiêu','main'],['Đậu Hũ Kho Nấm','main'],['Đậu Hũ Sốt Tứ Xuyên','main'],['Nấm Kho Tiêu','main'],['Chả Cá Thì Là','main'],['Tôm Hấp Sả','main'],
    ['Gà Hấp Hành','main'],['Cá Hấp Gừng','main'],['Nghêu Hấp Thái','main'],['Sò Lụa Xào Tỏi','main'],['Hàu Nướng Phô Mai','main'],['Bạch Tuộc Nướng Sa Tế','main'],['Ếch Xào Sả Ớt','main'],['Lườn Ngỗng Xông Khói','main'],['Bò Cuộn Phô Mai','main'],['Thịt Xiên Nướng','main'],
    ['Salad Rau Trộn Dầu Giấm','salad'],['Salad Gà Xé','salad'],['Salad Hải Sản','salad'],['Salad Trứng','salad'],['Salad Đậu Hũ Rong Biển','salad'],['Salad Bò Nướng','salad'],['Salad Xoài Tôm','salad'],['Salad Dưa Leo Chanh Muối','salad'],['Salad Ngũ Sắc','salad'],['Salad Bơ Trứng','salad'],
    ['Pizza Hải Sản','western'],['Pizza Bò Phô Mai','western'],['Pizza Gà BBQ','western'],['Pizza Chay Nấm','western'],['Mì Ý Sốt Cà Bò','western'],['Mì Ý Sốt Kem Nấm','western'],['Mì Ý Sốt Pesto','western'],['Bò Beefsteak','western'],['Cá Hồi Áp Chảo','western'],['Gà Đút Lò Thảo Mộc','western'],
    ['Bánh Mì Bò Nướng','street'],['Bánh Mì Gà Xé','street'],['Bánh Mì Chả Lụa','street'],['Bánh Mì Thịt Nguội','street'],['Bánh Mì Xíu Mại','street'],['Bánh Mì Cá','street'],['Bánh Mì Trứng Ốp','street'],['Bánh Mì Chay','street'],['Bánh Tráng Trộn','street'],['Xoài Lắc Muối Ớt','street'],
    ['Sữa Chua Nếp Cẩm','dessert'],['Chè Ba Màu','dessert'],['Chè Đậu Xanh','dessert'],['Chè Khúc Bạch','dessert'],['Rau Câu Dừa','dessert'],['Bánh Flan Caramel','dessert'],['Bánh Su Kem','dessert'],['Tiramisu Việt','dessert'],['Bánh Chuối Nướng','dessert'],['Bánh Da Lợn','dessert'],
    ['Kem Dừa','dessert'],['Kem Xoài','dessert'],['Kem Dâu','dessert'],['Kem Matcha','dessert'],['Bánh Brownie','dessert'],['Pudding Xoài','dessert'],['Pudding Socola','dessert'],['Bánh Mousse Chanh Dây','dessert'],['Chè Thái','dessert'],['Chè Hạt Sen','dessert'],
    ['Trà Đào Cam Sả','drink'],['Trà Sữa Trân Châu','drink'],['Nước Chanh Sả','drink'],['Nước Cam Ép','drink'],['Nước Dưa Hấu','drink'],['Nước Ép Cà Rốt','drink'],['Sinh Tố Bơ','drink'],['Sinh Tố Xoài','drink'],['Sinh Tố Dâu','drink'],['Cà Phê Đen','drink'],
    ['Cà Phê Sữa','drink'],['Bạc Xỉu','drink'],['Cà Phê Cốt Dừa','drink'],['Matcha Latte','drink'],['Socola Nóng','drink'],['Nước Ép Thơm','drink'],['Nước Ép Ổi','drink'],['Chanh Dây Đá Xay','drink'],['Dừa Tươi','drink'],['Nước Suối','drink'],
    ['Smoothie Detox Xanh','drink'],['Kombucha Gừng','drink'],['Kombucha Dâu','drink'],['Kombucha Việt Quất','drink'],['Nước Ép Cần Tây','drink'],['Nước Yến','drink'],['Sâm Bí Đao','drink'],['Trà Olong Mật Ong','drink'],['Trà Sen Vàng','drink'],['Trà Hoa Cúc Mật Ong','drink'],
    ['Bánh Bao Thịt','dim_sum'],['Bánh Bao Chay','dim_sum'],['Há Cảo Tôm','dim_sum'],['Xíu Mại Tôm Thịt','dim_sum'],['Bánh Cuốn Tôm Hẹ','dim_sum'],['Bánh Bột Lọc','dim_sum'],['Sủi Cảo Hấp','dim_sum'],['Sủi Cảo Chiên','dim_sum'],['Bột Chiên Trứng','dim_sum'],['Bánh Giò','dim_sum'],
    ['Cháo Ếch Singapore','special'],['Gà Quay Da Giòn','special'],['Heo Quay Da Giòn','special'],['Vịt Quay','special'],['Tôm Hùm Nướng Bơ Tỏi','special'],['Cua Rang Me','special'],['Cá Tầm Hấp Xì Dầu','special'],['Bò Wagyu Nướng','special'],['Lẩu Hải Sản Cao Cấp','special'],['Sashimi Thập Cẩm','special'],
    ['Sashimi Cá Hồi','special'],['Sashimi Cá Ngừ','special'],['Sashimi Bạch Tuộc','special'],['Sashimi Thanh Cua','special'],['Sashimi Tôm','special'],['Sushi Cuộn Cá Hồi','special'],['Sushi Cuộn Bơ','special'],['Sushi Cuộn Lươn','special'],['Sushi Trứng Cuộn','special'],['Nigiri Cá Hồi','special'],
    ['Nigiri Cá Ngừ','special'],['Nigiri Tôm','special'],['Nigiri Bạch Tuộc','special'],['Nigiri Trứng','special'],['Tempura Tôm','special'],['Tempura Rau','special'],['Cá Hồi Nướng Teriyaki','special'],['Cá Ngừ Áp Chảo','special'],['Bạch Tuộc Sốt Cay','special'],['Lẩu Sashimi Thả','special']
  ].map(d => ({ name: d[0], category: d[1] }))

  // 8. Tạo menu_items + recipes + recipe_ingredients
  let index = 0
  for (const d of dishes) {
    index++
    const menuItemId = uuidv4()
    const catId = categoryMap[d.category] ?? categoryMap['main']
    const price = new Prisma.Decimal( rand(30000, 250000) / 100 ).toFixed(2) // tạm logic
    await prisma.menu_items.create({
      data: {
        id: menuItemId,
        menu_id: menu.id,
        category_id: catId,
        name: d.name,
        description: `Món ${d.name} hấp dẫn #${index}`,
        price: new Prisma.Decimal(price),
        is_available: true,
        is_featured: index % 25 === 0
      }
    })

    // Recipe
    const recipeId = uuidv4()
    const baseIngredientsPool = Object.keys(inventoryMap)
    // Mỗi món 4-6 nguyên liệu ngẫu nhiên
    const ingredientCount = rand(4, 6)
    const picked = new Set<string>()
    while (picked.size < ingredientCount) {
      picked.add(baseIngredientsPool[rand(0, baseIngredientsPool.length - 1)])
    }
    await prisma.recipes.create({
      data: {
        id: recipeId,
        menu_item_id: menuItemId,
        name: `Công thức ${d.name}`,
        description: `Hướng dẫn sơ chế và nấu ${d.name}`,
        instructions: 'Chuẩn bị nguyên liệu, sơ chế, nấu theo thứ tự, nêm nếm và trình bày.',
        serving_size: 1
      }
    })

    // Recipe ingredients
    for (const ing of Array.from(picked)) {
      await prisma.recipe_ingredients.create({
        data: {
          id: uuidv4(),
            recipe_id: recipeId,
            inventory_item_id: inventoryMap[ing],
            quantity: new Prisma.Decimal(rand(5, 50)),
            unit: 'gram',
            notes: null
        }
      })
    }
  }

  // 9. Tables
  for (let t = 1; t <= 25; t++) {
    await prisma.tables.create({
      data: {
        id: uuidv4(),
        restaurant_id: restaurant.id,
        table_number: `T${t}`,
        capacity: t % 5 === 0 ? 8 : 4,
        status: 'available'
      }
    })
  }

  console.log('Seed hoàn tất.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

