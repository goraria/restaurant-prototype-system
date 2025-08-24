// import { PrismaClient } from '@prisma/client'
// import { hash } from 'bcryptjs'

// const prisma = new PrismaClient()

// async function main() {
//   console.log('🌱 Starting database seeding...')

//   // 1. 👤 Create demo users
//   const hashedPassword = await hash('demo123456', 12)
  
//   const adminUser = await prisma.users.upsert({
//     where: { email: 'admin@restaurant.demo' },
//     update: {},
//     create: {
//       id: '550e8400-e29b-41d4-a716-446655440001',
//       username: 'admin_demo',
//       email: 'admin@restaurant.demo',
//       password_hash: hashedPassword,
//       first_name: 'Admin',
//       last_name: 'Demo',
//       full_name: 'Admin Demo',
//       phone_code: '+84',
//       phone_number: '0123456789',
//       role: 'admin',
//       status: 'active',
//       email_verified_at: new Date(),
//     },
//   })

//   const managerUser = await prisma.users.upsert({
//     where: { email: 'manager@restaurant.demo' },
//     update: {},
//     create: {
//       id: '550e8400-e29b-41d4-a716-446655440002',
//       username: 'manager_demo',
//       email: 'manager@restaurant.demo',
//       password_hash: hashedPassword,
//       first_name: 'Manager',
//       last_name: 'Demo',
//       full_name: 'Manager Demo',
//       phone_code: '+84',
//       phone_number: '0123456790',
//       role: 'user',
//       status: 'active',
//       email_verified_at: new Date(),
//     },
//   })

//   const customerUser = await prisma.users.upsert({
//     where: { email: 'customer@restaurant.demo' },
//     update: {},
//     create: {
//       id: '550e8400-e29b-41d4-a716-446655440003',
//       username: 'customer_demo',
//       email: 'customer@restaurant.demo',
//       password_hash: hashedPassword,
//       first_name: 'Khách Hàng',
//       last_name: 'Demo',
//       full_name: 'Khách Hàng Demo',
//       phone_code: '+84',
//       phone_number: '0123456791',
//       role: 'user',
//       status: 'active',
//       email_verified_at: new Date(),
//     },
//   })

//   console.log('✅ Users created')

//   // 2. 🏢 Create organization
//   const organization = await prisma.organizations.upsert({
//     where: { code: 'DEMO_ORG' },
//     update: {},
//     create: {
//       id: '550e8400-e29b-41d4-a716-446655440010',
//       name: 'Nhà Hàng Demo Corporation',
//       code: 'DEMO_ORG',
//       description: 'Tổ chức demo cho hệ thống quản lý nhà hàng',
//       owner_id: adminUser.id,
//     },
//   })

//   console.log('✅ Organization created')

//   // 3. 🍽️ Create restaurant chain
//   const restaurantChain = await prisma.restaurant_chains.upsert({
//     where: { id: '550e8400-e29b-41d4-a716-446655440011' },
//     update: {},
//     create: {
//       id: '550e8400-e29b-41d4-a716-446655440011',
//       name: 'Chuỗi Nhà Hàng Việt',
//       description: 'Chuỗi nhà hàng phục vụ món ăn Việt Nam',
//       owner_id: adminUser.id,
//     },
//   })

//   console.log('✅ Restaurant chain created')

//   // 4. 🏪 Create restaurants
//   const restaurant1 = await prisma.restaurants.upsert({
//     where: { id: '550e8400-e29b-41d4-a716-446655440020' },
//     update: {},
//     create: {
//       id: '550e8400-e29b-41d4-a716-446655440020',
//       organization_id: organization.id,
//       chain_id: restaurantChain.id,
//       code: 'HCM_001',
//       name: 'Nhà Hàng Sài Gòn',
//       address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
//       phone_number: '028-1234-5678',
//       description: 'Nhà hàng phục vụ món ăn truyền thống Việt Nam',
//       manager_id: managerUser.id,
//     },
//   })

//   const restaurant2 = await prisma.restaurants.upsert({
//     where: { id: '550e8400-e29b-41d4-a716-446655440021' },
//     update: {},
//     create: {
//       id: '550e8400-e29b-41d4-a716-446655440021',
//       organization_id: organization.id,
//       chain_id: restaurantChain.id,
//       code: 'HN_001',
//       name: 'Nhà Hàng Hà Nội',
//       address: '456 Hoàn Kiếm, Quận Hoàn Kiếm, Hà Nội',
//       phone_number: '024-1234-5678',
//       description: 'Nhà hàng phong cách Bắc Bộ',
//       manager_id: managerUser.id,
//     },
//   })

//   console.log('✅ Restaurants created')

//   // 5. 🪑 Create tables
//   const tables = []
//   for (let i = 1; i <= 10; i++) {
//     const table = await prisma.tables.create({
//       data: {
//         restaurant_id: restaurant1.id,
//         table_number: `T${i.toString().padStart(2, '0')}`,
//         capacity: i <= 4 ? 2 : i <= 8 ? 4 : 6,
//         location: i <= 5 ? 'Tầng 1' : 'Tầng 2',
//         status: 'available',
//         qr_code: `QR_${restaurant1.code}_T${i.toString().padStart(2, '0')}`,
//       },
//     })
//     tables.push(table)
//   }

//   console.log('✅ Tables created')

//   // 6. 📚 Create categories
//   const categories = await Promise.all([
//     prisma.categories.upsert({
//       where: { slug: 'mon-chinh' },
//       update: {},
//       create: {
//         name: 'Món Chính',
//         slug: 'mon-chinh',
//         description: 'Các món ăn chính',
//       },
//     }),
//     prisma.categories.upsert({
//       where: { slug: 'do-uong' },
//       update: {},
//       create: {
//         name: 'Đồ Uống',
//         slug: 'do-uong',
//         description: 'Các loại nước uống',
//       },
//     }),
//     prisma.categories.upsert({
//       where: { slug: 'trang-mieng' },
//       update: {},
//       create: {
//         name: 'Tráng Miệng',
//         slug: 'trang-mieng',
//         description: 'Các món tráng miệng',
//       },
//     }),
//   ])

//   console.log('✅ Categories created')

//   // 7. 🍽️ Create menu
//   const menu = await prisma.menus.upsert({
//     where: { id: '550e8400-e29b-41d4-a716-446655440030' },
//     update: {},
//     create: {
//       id: '550e8400-e29b-41d4-a716-446655440030',
//       restaurant_id: restaurant1.id,
//       name: 'Thực Đơn Chính',
//       description: 'Thực đơn các món ăn truyền thống Việt Nam',
//       is_active: true,
//     },
//   })

//   // 8. 🍜 Create menu items
//   const menuItems = await Promise.all([
//     prisma.menu_items.create({
//       data: {
//         menu_id: menu.id,
//         name: 'Phở Bò Tái',
//         description: 'Phở bò tái thơm ngon với nước dùng đậm đà',
//         price: 85000,
//         image_url: '/images/pho-bo-tai.jpg',
//         is_available: true,
//         category_id: categories[0].id,
//       },
//     }),
//     prisma.menu_items.create({
//       data: {
//         menu_id: menu.id,
//         name: 'Bún Bò Huế',
//         description: 'Bún bò Huế cay nồng đặc trưng miền Trung',
//         price: 75000,
//         image_url: '/images/bun-bo-hue.jpg',
//         is_available: true,
//         category_id: categories[0].id,
//       },
//     }),
//     prisma.menu_items.create({
//       data: {
//         menu_id: menu.id,
//         name: 'Cơm Tấm Sườn Nướng',
//         description: 'Cơm tấm sườn nướng với chả trứng và bì',
//         price: 65000,
//         image_url: '/images/com-tam-suon-nuong.jpg',
//         is_available: true,
//         category_id: categories[0].id,
//       },
//     }),
//     prisma.menu_items.create({
//       data: {
//         menu_id: menu.id,
//         name: 'Cà Phê Sữa Đá',
//         description: 'Cà phê sữa đá truyền thống Việt Nam',
//         price: 25000,
//         image_url: '/images/ca-phe-sua-da.jpg',
//         is_available: true,
//         category_id: categories[1].id,
//       },
//     }),
//     prisma.menu_items.create({
//       data: {
//         menu_id: menu.id,
//         name: 'Chè Ba Màu',
//         description: 'Chè ba màu mát lạnh',
//         price: 30000,
//         image_url: '/images/che-ba-mau.jpg',
//         is_available: true,
//         category_id: categories[2].id,
//       },
//     }),
//   ])

//   console.log('✅ Menu items created')

//   // 9. 🏪 Create inventory items
//   const inventoryItems = await Promise.all([
//     prisma.inventory_items.create({
//       data: {
//         restaurant_id: restaurant1.id,
//         name: 'Thịt Bò',
//         description: 'Thịt bò tươi cho phở',
//         unit: 'kg',
//         quantity: 50,
//         min_quantity: 10,
//         max_quantity: 100,
//       },
//     }),
//     prisma.inventory_items.create({
//       data: {
//         restaurant_id: restaurant1.id,
//         name: 'Bánh Phở',
//         description: 'Bánh phở tươi',
//         unit: 'kg',
//         quantity: 30,
//         min_quantity: 5,
//         max_quantity: 50,
//       },
//     }),
//     prisma.inventory_items.create({
//       data: {
//         restaurant_id: restaurant1.id,
//         name: 'Cà Phê Rang Xay',
//         description: 'Cà phê rang xay nguyên chất',
//         unit: 'kg',
//         quantity: 20,
//         min_quantity: 3,
//         max_quantity: 30,
//       },
//     }),
//   ])

//   console.log('✅ Inventory items created')

//   // 10. 📝 Create recipes
//   const recipe1 = await prisma.recipes.create({
//     data: {
//       menu_item_id: menuItems[0].id, // Phở Bò Tái
//       name: 'Công Thức Phở Bò Tái',
//       description: 'Công thức nấu phở bò tái chuẩn vị',
//     },
//   })

//   await prisma.recipe_ingredients.createMany({
//     data: [
//       {
//         recipe_id: recipe1.id,
//         inventory_item_id: inventoryItems[0].id, // Thịt bò
//         quantity: 0.2,
//         unit: 'kg',
//       },
//       {
//         recipe_id: recipe1.id,
//         inventory_item_id: inventoryItems[1].id, // Bánh phở
//         quantity: 0.15,
//         unit: 'kg',
//       },
//     ],
//   })

//   console.log('✅ Recipes created')

//   // 11. 🎟️ Create vouchers
//   await prisma.vouchers.createMany({
//     data: [
//       {
//         code: 'WELCOME10',
//         description: 'Giảm 10% cho khách hàng mới',
//         discount_type: 'percent',
//         discount_value: 10,
//         min_order_value: 100000,
//         max_discount: 50000,
//         start_date: new Date(),
//         end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
//         usage_limit: 100,
//         restaurant_id: restaurant1.id,
//       },
//       {
//         code: 'FREESHIP',
//         description: 'Miễn phí giao hàng',
//         discount_type: 'fixed',
//         discount_value: 30000,
//         min_order_value: 200000,
//         start_date: new Date(),
//         end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
//         usage_limit: 50,
//         restaurant_id: restaurant1.id,
//       },
//     ],
//   })

//   console.log('✅ Vouchers created')

//   // 12. 👨‍💼 Create staff
//   const staffUser = await prisma.users.create({
//     data: {
//       username: 'staff_demo',
//       email: 'staff@restaurant.demo',
//       password_hash: hashedPassword,
//       first_name: 'Nhân Viên',
//       last_name: 'Demo',
//       full_name: 'Nhân Viên Demo',
//       phone_code: '+84',
//       phone_number: '0123456792',
//       role: 'user',
//       status: 'active',
//       email_verified_at: new Date(),
//     },
//   })

//   await prisma.restaurant_staffs.create({
//     data: {
//       restaurant_id: restaurant1.id,
//       user_id: staffUser.id,
//       role: 'staff',
//       status: 'active',
//     },
//   })

//   console.log('✅ Staff created')

//   // 13. 📅 Create staff schedule
//   const today = new Date()
//   const tomorrow = new Date(today)
//   tomorrow.setDate(tomorrow.getDate() + 1)

//   await prisma.staff_schedules.create({
//     data: {
//       staff_id: staffUser.id,
//       restaurant_id: restaurant1.id,
//       shift_date: tomorrow,
//       shift_type: 'morning',
//       start_time: new Date('2024-01-01T08:00:00Z'),
//       end_time: new Date('2024-01-01T16:00:00Z'),
//       status: 'scheduled',
//     },
//   })

//   console.log('✅ Staff schedule created')

//   // 14. 📊 Create sample reservation
//   await prisma.reservations.create({
//     data: {
//       table_id: tables[0].id,
//       customer_id: customerUser.id,
//       customer_name: 'Khách Hàng Demo',
//       customer_phone: '0123456791',
//       customer_email: 'customer@restaurant.demo',
//       party_size: 2,
//       reservation_date: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
//       duration_hours: 2,
//       status: 'confirmed',
//       special_requests: 'Chỗ ngồi gần cửa sổ',
//     },
//   })

//   console.log('✅ Sample reservation created')

//   // 15. 🎉 Create promotions
//   await prisma.promotions.create({
//     data: {
//       restaurant_id: restaurant1.id,
//       name: 'Happy Hour',
//       description: 'Giảm 20% tất cả đồ uống từ 14h-16h',
//       type: 'percentage',
//       discount_value: 20,
//       conditions: {
//         time_start: '14:00',
//         time_end: '16:00',
//         applicable_categories: ['đồ uống'],
//       },
//       applicable_tables: [],
//       time_restrictions: {
//         days_of_week: [1, 2, 3, 4, 5], // Monday to Friday
//       },
//       start_date: new Date(),
//       end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
//       is_active: true,
//     },
//   })

//   console.log('✅ Promotions created')

//   console.log('🎉 Database seeding completed successfully!')
//   console.log('\n📊 Summary:')
//   console.log('- 4 users created (admin, manager, customer, staff)')
//   console.log('- 1 organization with 1 restaurant chain')
//   console.log('- 2 restaurants (Sài Gòn & Hà Nội)')
//   console.log('- 10 tables in Sài Gòn restaurant')
//   console.log('- 5 menu items with categories')
//   console.log('- 3 inventory items with recipe connections')
//   console.log('- 2 vouchers for promotions')
//   console.log('- 1 staff member with schedule')
//   console.log('- 1 sample reservation')
//   console.log('- 1 happy hour promotion')
//   console.log('\n🔐 Login credentials:')
//   console.log('Admin: admin@restaurant.demo / demo123456')
//   console.log('Manager: manager@restaurant.demo / demo123456')
//   console.log('Customer: customer@restaurant.demo / demo123456')
//   console.log('Staff: staff@restaurant.demo / demo123456')
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error('❌ Seeding failed:', e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })


///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// /* prisma/seed.ts */
// import { PrismaClient, Prisma } from '@prisma/client'
// const prisma = new PrismaClient()

// // Helper random
// const rand = (min: number, max: number) =>
//   Math.floor(Math.random() * (max - min + 1)) + min

// // Cố định ID để tham chiếu (uuid giả ở đây bạn có thể thay bằng crypto/randomUUID khi chạy)
// import { randomUUID } from 'crypto'

// async function main() {
//   // 1. User tối thiểu (owner + manager giả lập)
//   const owner = await prisma.users.upsert({
//     where: { email: 'owner@example.com' },
//     update: {},
//     create: {
//       id: randomUUID(),
//       username: 'owner',
//       email: 'owner@example.com',
//       first_name: 'Owner',
//       last_name: 'System',
//       full_name: 'Owner System',
//       role: 'admin',
//       status: 'active'
//     }
//   })

//   const manager = await prisma.users.upsert({
//     where: { email: 'manager@example.com' },
//     update: {},
//     create: {
//       id: randomUUID(),
//       username: 'manager',
//       email: 'manager@example.com',
//       first_name: 'Restaurant',
//       last_name: 'Manager',
//       full_name: 'Restaurant Manager',
//       role: 'manager',
//       status: 'active'
//     }
//   })

//   // 2. Organization
//   const org = await prisma.organizations.upsert({
//     where: { code: 'ORG_MAIN' },
//     update: {},
//     create: {
//       id: randomUUID(),
//       name: 'Tasty Group',
//       code: 'ORG_MAIN',
//       owner_id: owner.id
//     }
//   })

//   // 3. Restaurant
//   const restaurant = await prisma.restaurants.upsert({
//     where: { organization_id: { code: 'R001', organization_id: org.id } },
//     update: {},
//     create: {
//       id: randomUUID(),
//       organization_id: org.id,
//       code: 'R001',
//       name: 'Nhà Hàng Trung Tâm',
//       address: '123 Đường Ẩm Thực, Quận 1',
//       manager_id: manager.id,
//       status: 'active'
//     }
//   })

//   // 4. Menu chính
//   const menu = await prisma.menus.create({
//     data: {
//       id: randomUUID(),
//       restaurant_id: restaurant.id,
//       name: 'Menu Chính',
//       is_active: true
//     }
//   })

//   // 5. Categories
//   const categoryDefs = [
//     { code: 'soup', name: 'Món Nước' },
//     { code: 'appetizer', name: 'Khai Vị' },
//     { code: 'rice', name: 'Cơm' },
//     { code: 'noodle', name: 'Mì/Bún' },
//     { code: 'hotpot', name: 'Lẩu' },
//     { code: 'main', name: 'Món Chính' },
//     { code: 'salad', name: 'Salad' },
//     { code: 'western', name: 'Âu' },
//     { code: 'street', name: 'Đường Phố' },
//     { code: 'dessert', name: 'Tráng Miệng' },
//     { code: 'drink', name: 'Đồ Uống' },
//     { code: 'dim_sum', name: 'Dim Sum' },
//     { code: 'special', name: 'Đặc Biệt' }
//   ]

//   const categoryMap: Record<string, string> = {}
//   for (const c of categoryDefs) {
//     const cat = await prisma.categories.upsert({
//       where: { slug: c.code },
//       update: {},
//       create: {
//         id: randomUUID(),
//         name: c.name,
//         slug: c.code,
//         is_active: true
//       }
//     })
//     categoryMap[c.code] = cat.id
//   }

//   // 6. Inventory Items (nguyên liệu)
//   const inventoryDefs = [
//     'gao','banh_pho','bun_tuoi','mi_trung','thit_bo','thit_ga','suon_heo','thit_lon','tom_tuoi','muc_tuoi','ca_hoi','ca_ngu','ca_trang','ech','bach_tuoc','rau_thom','hanh_la','hanh_tay','toi','gung','sa','ot','ca_chua','khoai_tay','nam_rom','nam_dong_co','dau_hu','trung_ga','trung_cut','dau_nanh','dau_phong','me_den','dau_hao','nuoc_tuong','nuoc_mam','duong_cat','muoi','tieu_den','bot_ngot','bot_bap','bot_mi','dau_oliu','dau_me','dau_dieu','pho_mai','sua_tuoi','kem_tuoi','bot_ca_ri','la_chanh','la_qua_que','chanhsanh','chanh_day','xoai','dau_tay','bo','dua_dua','hat_sen','rong_bien','bot_tra_xanh','bot_ca_cao'
//   ]

//   const inventoryMap: Record<string,string> = {}
//   for (const name of inventoryDefs) {
//     const inv = await prisma.inventory_items.create({
//       data: {
//         id: randomUUID(),
//         restaurant_id: restaurant.id,
//         name,
//         unit: 'gram',
//         quantity: new Prisma.Decimal(rand(5000,12000)),
//         unit_cost: new Prisma.Decimal(rand(10,200)),
//       }
//     })
//     inventoryMap[name] = inv.id
//   }

//   // 7. Danh sách 200 món (tên + category code) – nén vào mảng
//   const dishes: { name: string; category: string }[] = [
//     // (đưa đúng thứ tự 1..200 như đã liệt kê trên)
//     ['Phở Bò Truyền Thống','soup'],['Phở Gà Ta','soup'],['Bún Bò Huế','soup'],['Hủ Tiếu Nam Vang','soup'],['Miến Gà Nấm','soup'],['Cháo Sườn Non','soup'],['Cháo Hải Sản','soup'],['Canh Chua Cá','soup'],['Canh Rau Củ','soup'],['Canh Kim Chi Đậu Phụ','soup'],
//     ['Gỏi Cuốn Tôm Thịt','appetizer'],['Chả Giò Rế','appetizer'],['Đậu Hũ Chiên Sả','appetizer'],['Bánh Gạo Lắc Phô Mai','appetizer'],['Khoai Tây Chiên Tỏi','appetizer'],['Cánh Gà Chiên Nước Mắm','appetizer'],['Bánh Xèo Tôm','appetizer'],['Gỏi Bò Rau Thơm','appetizer'],['Bánh Cuốn Thịt','appetizer'],['Bánh Khọt Tôm','appetizer'],
//     ['Cơm Tấm Sườn Bì Chả','rice'],['Cơm Gà Hải Nam','rice'],['Cơm Chiên Dương Châu','rice'],['Cơm Chiên Trứng','rice'],['Cơm Rang Thịt Bò','rice'],['Cơm Rang Hải Sản','rice'],['Cơm Sườn Nướng','rice'],['Cơm Thịt Kho Trứng','rice'],['Cơm Cá Kho Tộ','rice'],['Cơm Chay Thập Cẩm','rice'],
//     ['Bún Thịt Nướng','noodle'],['Bún Chả Hà Nội','noodle'],['Bún Đậu Mắm Tôm','noodle'],['Bún Cá Nha Trang','noodle'],['Bún Riêu Cua','noodle'],['Bún Nghêu Sả Ớt','noodle'],['Mì Xào Bò','noodle'],['Mì Xào Hải Sản','noodle'],['Mì Udon Xào Gà','noodle'],['Mì Trộn Sa Tế','noodle'],
//     ['Lẩu Thái Hải Sản','hotpot'],['Lẩu Gà Lá É','hotpot'],['Lẩu Bò Nhúng Dấm','hotpot'],['Lẩu Nấm Chay','hotpot'],['Lẩu Cá Măng Chua','hotpot'],['Lẩu Riêu Cua','hotpot'],['Lẩu Ếch Măng Cay','hotpot'],['Lẩu Kim Chi Thịt Bò','hotpot'],['Lẩu Tứ Xuyên','hotpot'],['Lẩu Thập Cẩm','hotpot'],
//     ['Bò Lúc Lắc','main'],['Bò Kho Bánh Mì','main'],['Thịt Kho Trứng Cút','main'],['Gà Kho Gừng','main'],['Gà Rang Muối','main'],['Gà Nướng Mật Ong','main'],['Cá Kho Lạt','main'],['Cá Chiên Sốt Chanh','main'],['Tôm Rang Me','main'],['Mực Xào Cần','main'],
//     ['Sườn Nướng BBQ','main'],['Sườn Rim Mặn','main'],['Ba Chỉ Rim Mắm','main'],['Thịt Bằm Sốt Cà','main'],['Thịt Viên Sốt Tiêu','main'],['Đậu Hũ Kho Nấm','main'],['Đậu Hũ Sốt Tứ Xuyên','main'],['Nấm Kho Tiêu','main'],['Chả Cá Thì Là','main'],['Tôm Hấp Sả','main'],
//     ['Gà Hấp Hành','main'],['Cá Hấp Gừng','main'],['Nghêu Hấp Thái','main'],['Sò Lụa Xào Tỏi','main'],['Hàu Nướng Phô Mai','main'],['Bạch Tuộc Nướng Sa Tế','main'],['Ếch Xào Sả Ớt','main'],['Lườn Ngỗng Xông Khói','main'],['Bò Cuộn Phô Mai','main'],['Thịt Xiên Nướng','main'],
//     ['Salad Rau Trộn Dầu Giấm','salad'],['Salad Gà Xé','salad'],['Salad Hải Sản','salad'],['Salad Trứng','salad'],['Salad Đậu Hũ Rong Biển','salad'],['Salad Bò Nướng','salad'],['Salad Xoài Tôm','salad'],['Salad Dưa Leo Chanh Muối','salad'],['Salad Ngũ Sắc','salad'],['Salad Bơ Trứng','salad'],
//     ['Pizza Hải Sản','western'],['Pizza Bò Phô Mai','western'],['Pizza Gà BBQ','western'],['Pizza Chay Nấm','western'],['Mì Ý Sốt Cà Bò','western'],['Mì Ý Sốt Kem Nấm','western'],['Mì Ý Sốt Pesto','western'],['Bò Beefsteak','western'],['Cá Hồi Áp Chảo','western'],['Gà Đút Lò Thảo Mộc','western'],
//     ['Bánh Mì Bò Nướng','street'],['Bánh Mì Gà Xé','street'],['Bánh Mì Chả Lụa','street'],['Bánh Mì Thịt Nguội','street'],['Bánh Mì Xíu Mại','street'],['Bánh Mì Cá','street'],['Bánh Mì Trứng Ốp','street'],['Bánh Mì Chay','street'],['Bánh Tráng Trộn','street'],['Xoài Lắc Muối Ớt','street'],
//     ['Sữa Chua Nếp Cẩm','dessert'],['Chè Ba Màu','dessert'],['Chè Đậu Xanh','dessert'],['Chè Khúc Bạch','dessert'],['Rau Câu Dừa','dessert'],['Bánh Flan Caramel','dessert'],['Bánh Su Kem','dessert'],['Tiramisu Việt','dessert'],['Bánh Chuối Nướng','dessert'],['Bánh Da Lợn','dessert'],
//     ['Kem Dừa','dessert'],['Kem Xoài','dessert'],['Kem Dâu','dessert'],['Kem Matcha','dessert'],['Bánh Brownie','dessert'],['Pudding Xoài','dessert'],['Pudding Socola','dessert'],['Bánh Mousse Chanh Dây','dessert'],['Chè Thái','dessert'],['Chè Hạt Sen','dessert'],
//     ['Trà Đào Cam Sả','drink'],['Trà Sữa Trân Châu','drink'],['Nước Chanh Sả','drink'],['Nước Cam Ép','drink'],['Nước Dưa Hấu','drink'],['Nước Ép Cà Rốt','drink'],['Sinh Tố Bơ','drink'],['Sinh Tố Xoài','drink'],['Sinh Tố Dâu','drink'],['Cà Phê Đen','drink'],
//     ['Cà Phê Sữa','drink'],['Bạc Xỉu','drink'],['Cà Phê Cốt Dừa','drink'],['Matcha Latte','drink'],['Socola Nóng','drink'],['Nước Ép Thơm','drink'],['Nước Ép Ổi','drink'],['Chanh Dây Đá Xay','drink'],['Dừa Tươi','drink'],['Nước Suối','drink'],
//     ['Smoothie Detox Xanh','drink'],['Kombucha Gừng','drink'],['Kombucha Dâu','drink'],['Kombucha Việt Quất','drink'],['Nước Ép Cần Tây','drink'],['Nước Yến','drink'],['Sâm Bí Đao','drink'],['Trà Olong Mật Ong','drink'],['Trà Sen Vàng','drink'],['Trà Hoa Cúc Mật Ong','drink'],
//     ['Bánh Bao Thịt','dim_sum'],['Bánh Bao Chay','dim_sum'],['Há Cảo Tôm','dim_sum'],['Xíu Mại Tôm Thịt','dim_sum'],['Bánh Cuốn Tôm Hẹ','dim_sum'],['Bánh Bột Lọc','dim_sum'],['Sủi Cảo Hấp','dim_sum'],['Sủi Cảo Chiên','dim_sum'],['Bột Chiên Trứng','dim_sum'],['Bánh Giò','dim_sum'],
//     ['Cháo Ếch Singapore','special'],['Gà Quay Da Giòn','special'],['Heo Quay Da Giòn','special'],['Vịt Quay','special'],['Tôm Hùm Nướng Bơ Tỏi','special'],['Cua Rang Me','special'],['Cá Tầm Hấp Xì Dầu','special'],['Bò Wagyu Nướng','special'],['Lẩu Hải Sản Cao Cấp','special'],['Sashimi Thập Cẩm','special'],
//     ['Sashimi Cá Hồi','special'],['Sashimi Cá Ngừ','special'],['Sashimi Bạch Tuộc','special'],['Sashimi Thanh Cua','special'],['Sashimi Tôm','special'],['Sushi Cuộn Cá Hồi','special'],['Sushi Cuộn Bơ','special'],['Sushi Cuộn Lươn','special'],['Sushi Trứng Cuộn','special'],['Nigiri Cá Hồi','special'],
//     ['Nigiri Cá Ngừ','special'],['Nigiri Tôm','special'],['Nigiri Bạch Tuộc','special'],['Nigiri Trứng','special'],['Tempura Tôm','special'],['Tempura Rau','special'],['Cá Hồi Nướng Teriyaki','special'],['Cá Ngừ Áp Chảo','special'],['Bạch Tuộc Sốt Cay','special'],['Lẩu Sashimi Thả','special']
//   ].map(d => ({ name: d[0], category: d[1] }))

//   // 8. Tạo menu_items + recipes + recipe_ingredients
//   let index = 0
//   for (const d of dishes) {
//     index++
//     const menuItemId = randomUUID()
//     const catId = categoryMap[d.category] ?? categoryMap['main']
//     const price = new Prisma.Decimal( rand(30000, 250000) / 100 ).toFixed(2) // tạm logic
//     await prisma.menu_items.create({
//       data: {
//         id: menuItemId,
//         menu_id: menu.id,
//         category_id: catId,
//         name: d.name,
//         description: `Món ${d.name} hấp dẫn #${index}`,
//         price: new Prisma.Decimal(price),
//         is_available: true,
//         is_featured: index % 25 === 0
//       }
//     })

//     // Recipe
//     const recipeId = randomUUID()
//     const baseIngredientsPool = Object.keys(inventoryMap)
//     // Mỗi món 4-6 nguyên liệu ngẫu nhiên
//     const ingredientCount = rand(4, 6)
//     const picked = new Set<string>()
//     while (picked.size < ingredientCount) {
//       picked.add(baseIngredientsPool[rand(0, baseIngredientsPool.length - 1)])
//     }
//     await prisma.recipes.create({
//       data: {
//         id: recipeId,
//         menu_item_id: menuItemId,
//         name: `Công thức ${d.name}`,
//         description: `Hướng dẫn sơ chế và nấu ${d.name}`,
//         instructions: 'Chuẩn bị nguyên liệu, sơ chế, nấu theo thứ tự, nêm nếm và trình bày.',
//         serving_size: 1
//       }
//     })

//     // Recipe ingredients
//     for (const ing of picked) {
//       await prisma.recipe_ingredients.create({
//         data: {
//           id: randomUUID(),
//             recipe_id: recipeId,
//             inventory_item_id: inventoryMap[ing],
//             quantity: new Prisma.Decimal(rand(5, 50)),
//             unit: 'gram',
//             notes: null
//         }
//       })
//     }
//   }

//   // 9. Tables
//   for (let t = 1; t <= 25; t++) {
//     await prisma.tables.create({
//       data: {
//         id: randomUUID(),
//         restaurant_id: restaurant.id,
//         table_number: `T${t}`,
//         capacity: t % 5 === 0 ? 8 : 4,
//         status: 'available'
//       }
//     })
//   }

//   console.log('Seed hoàn tất.')
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })





///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


/* eslint-disable */
import { PrismaClient, Prisma } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

function uuid() { return crypto.randomUUID(); }

const CATEGORY_DEFS = [
  'Khai Vị','Salad','Soup','Món Chính - Thịt','Món Chính - Hải Sản',
  'Món Chính - Chay','Mì & Pasta','Cơm & Lẩu','Đồ Nướng','Đồ Chiên',
  'Bánh & Tráng Miệng','Thức Uống - Cà Phê','Thức Uống - Trà','Nước Ép & Sinh Tố',
  'Cocktail','Mocktail','Bia','Rượu Vang','Set Combo','Món Đặc Biệt Theo Mùa'
];

const BASE_INGREDIENTS = (() => {
  // 120 nguyên liệu kho (ví dụ)
  const groups = {
    Thit: ['Thịt bò','Thịt heo','Thịt gà','Thịt vịt','Thịt cừu','Bacon','Xúc xích','Giò sống','Sườn non','Ức gà','Đùi gà','Gan gà'],
    HaiSan: ['Tôm sú','Tôm thẻ','Mực ống','Mực lá','Bạch tuộc','Cá hồi','Cá ngừ','Cá thu','Ngao','Sò điệp','Hàu sống','Cua biển'],
    RauCu: ['Cà rốt','Khoai tây','Khoai lang','Bí ngòi','Ớt chuông đỏ','Ớt chuông vàng','Cà chua','Dưa leo','Bắp cải tím','Xà lách lolo','Xà lách romaine','Rau mùi'],
    TinhBot: ['Gạo thơm','Gạo nếp','Bún gạo','Miến dong','Spaghetti','Fettuccine','Mì trứng','Bánh mì baguette','Bột mì đa dụng','Bột gạo','Bột bắp','Yến mạch'],
    GiaVi: ['Muối tinh','Đường cát','Đường nâu','Tiêu đen','Tiêu sọ','Ớt bột','Hạt nêm','Nước mắm','Nước tương','Dầu hào','Dầu mè','Bột ngọt'],
    Khac: ['Phô mai parmesan','Phô mai mozzarella','Kem tươi','Sữa tươi','Sữa đặc','Bơ lạt','Dầu olive','Dầu đậu nành','Tỏi','Hành tím','Gừng','Sả',
           'Lá chanh','Lá nguyệt quế','Húng quế','Húng lủi','Thì là','Rau thơm hỗn hợp','Nấm hương','Nấm kim châm','Nấm bào ngư','Trứng gà','Trứng cút','Đậu hũ','Đậu đỏ','Đậu nành','Vừng rang','Lạc rang','Mè đen','Mật ong','Chanh vàng','Chanh xanh','Cam vàng','Táo đỏ','Dứa tươi','Xoài cát','Dâu tây','Việt quất','Chuối tiêu','Sầu riêng','Bơ sáp','Rau câu bột','Bột gelatin','Bột cacao','Bột matcha','Syrup dâu','Syrup bạc hà','Syrup caramel','Cà phê rang xay','Bột cà phê hoà tan','Trà đen','Trà xanh','Trà olong','Lá bạc hà']
  };
  const arr: { name: string; unit: string }[] = [];
  Object.values(groups).forEach(g => g.forEach(n => arr.push({ name: n, unit: inferUnit(n) })));
  return arr.slice(0,120);
})();

function inferUnit(name: string) {
  if (/sữa|syrup|dầu|nước|cà phê|trà/i.test(name)) return 'ml';
  if (/bột|đường|muối|bột|cacao|matcha|yến mạch/i.test(name)) return 'g';
  if (/trứng|hàu|tôm|mực|bạch tuộc|cua|sò|hến|ngao/i.test(name)) return 'cái';
  if (/lá|rau|nấm|phô mai|bơ|thịt|cá|đậu hũ|đậu/i.test(name)) return 'g';
  return 'g';
}

async function main() {
  console.time('seed');

  // 1. Organization + Restaurant + Menu
  const orgId = uuid();
  const restId = uuid();
  const menuId = uuid();

  await prisma.organizations.create({
    data: {
      id: orgId,
      name: 'Công Ty Ẩm Thực Demo',
      code: 'DEMOORG',
      description: 'Tổ chức mẫu',
      owner: {
        create: {
          id: uuid(),
          username: 'owner_demo',
            email: 'owner@example.com',
          first_name: 'Owner',
          last_name: 'Demo',
          full_name: 'Owner Demo',
        }
      }
    }
  });

  await prisma.restaurants.create({
    data: {
      id: restId,
      organization_id: orgId,
      code: 'REST01',
      name: 'Nhà Hàng Demo Trung Tâm',
      address: '123 Đường Mẫu, Quận 1, TP.HCM',
      opening_hours: {
        mon: { open: '08:00', close: '22:00' },
        tue: { open: '08:00', close: '22:00' },
        wed: { open: '08:00', close: '22:00' },
        thu: { open: '08:00', close: '22:00' },
        fri: { open: '08:00', close: '23:00' },
        sat: { open: '08:00', close: '23:00' },
        sun: { open: '08:00', close: '22:00' }
      }
    }
  });

  await prisma.menus.create({
    data: {
      id: menuId,
      restaurant_id: restId,
      name: 'Menu Chính',
      description: 'Menu tổng hợp 500 món'
    }
  });

  // 2. Categories
  const categoryRecords = CATEGORY_DEFS.map((name, idx) => ({
    id: uuid(),
    name,
    slug: name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]/g,'')
      .replace(/-+/g,'-'),
    display_order: idx
  }));
  await prisma.categories.createMany({ data: categoryRecords });

  // 3. Tables (40 bàn)
  const tableRecords = Array.from({ length: 40 }).map((_, i) => ({
    id: uuid(),
    restaurant_id: restId,
    table_number: `T${(i+1).toString().padStart(2,'0')}`,
    capacity: 2 + (i % 5) * 2, // 2,4,6,8,10
    location: i < 10 ? 'Tầng 1' : i < 20 ? 'Tầng 2' : i < 30 ? 'Sân vườn' : 'Ban công',
  }));
  await prisma.tables.createMany({ data: tableRecords });

  // 4. Inventory Items (120 nguyên liệu)
  const inventoryRecords = BASE_INGREDIENTS.map((ing, idx) => ({
    id: uuid(),
    restaurant_id: restId,
    name: ing.name,
    unit: ing.unit,
    quantity: new Prisma.Decimal((5000 + idx * 15).toFixed(2)), // g hoặc ml hoặc cái
    unit_cost: new Prisma.Decimal(((idx % 40) + 5) * 1000),
  }));
  await prisma.inventory_items.createMany({ data: inventoryRecords });

  // Map nhanh để chọn ingredients
  const inventoryIds = inventoryRecords.map(r => r.id);

  // 5. Menu Items (500 món) + 6. Recipes + 7. Recipe_Ingredients
  const menuItems: any[] = [];
  const recipes: any[] = [];
  const recipeIngredients: any[] = [];

  const itemsPerCategory = Math.ceil(500 / categoryRecords.length); // = 25
  let counter = 0;

  for (let c = 0; c < categoryRecords.length; c++) {
    for (let k = 0; k < itemsPerCategory && counter < 500; k++) {
      counter++;
      const cat = categoryRecords[c];
      const itemId = uuid();
      const recipeId = uuid();
      const basePrice = 70000 + (counter % 50) * 3500; // 70k -> ~245k

      const name = `${cat.name} #${counter}`;
      const allergens: string[] = [];
      if (/(Phô mai|Sữa|Kem)/i.test(name) || (counter % 17 === 0)) allergens.push('dairy');
      if (/(Bột|Mì|Spaghetti)/i.test(name) || (counter % 23 === 0)) allergens.push('gluten');
      if (counter % 41 === 0) allergens.push('nuts');

      const dietary: string[] = [];
      if (/Chay/i.test(cat.name)) dietary.push('vegetarian');
      if (/Salad/i.test(cat.name) && counter % 2 === 0) dietary.push('vegan');

      menuItems.push({
        id: itemId,
        menu_id: menuId,
        category_id: cat.id,
        name,
        price: new Prisma.Decimal(basePrice),
        is_available: true,
        is_featured: counter % 47 === 0,
        preparation_time: 10 + (counter % 25),
        calories: 120 + (counter % 400),
        allergens,
        dietary_info: dietary
      });

      recipes.push({
        id: recipeId,
        menu_item_id: itemId,
        name: `Công thức ${name}`,
        instructions: `1. Chuẩn bị nguyên liệu.\n2. Sơ chế.\n3. Nấu chính theo quy trình chuẩn.\n4. Trình bày & hoàn thiện.\n(Món số ${counter})`,
        prep_time: 5 + (counter % 15),
        cook_time: 8 + (counter % 20),
        serving_size: 1
      });

      // Chọn 4 nguyên liệu “xoay vòng” để đảm bảo tính deterministic
      const ingStart = (counter * 7) % (inventoryIds.length - 10);
      const selected = [
        inventoryIds[ingStart],
        inventoryIds[ingStart + 3],
        inventoryIds[ingStart + 5],
        inventoryIds[ingStart + 9],
      ];

      selected.forEach((invId, idxSel) => {
        recipeIngredients.push({
          id: uuid(),
          recipe_id: recipeId,
          inventory_item_id: invId,
          quantity: new Prisma.Decimal((50 + ((counter + idxSel) % 60) * 2).toFixed(2)),
          unit: 'g',
          notes: idxSel === 0 ? 'Nguyên liệu chính' : undefined
        });
      });
    }
  }

  // Batch insert để tránh quá nhiều tham số
  const batchInsert = async (arr: any[], modelName: keyof PrismaClient, batchSize = 300) => {
    for (let i = 0; i < arr.length; i += batchSize) {
      // @ts-ignore
      await prisma[modelName].createMany({ data: arr.slice(i, i + batchSize) });
    }
  };

  await batchInsert(menuItems, 'menu_items');
  await batchInsert(recipes, 'recipes');
  await batchInsert(recipeIngredients, 'recipe_ingredients', 500);

  console.timeEnd('seed');

  console.log({
    categories: categoryRecords.length,
    tables: tableRecords.length,
    inventory_items: inventoryRecords.length,
    menu_items: menuItems.length,
    recipes: recipes.length,
    recipe_ingredients: recipeIngredients.length
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(()=> prisma.$disconnect());