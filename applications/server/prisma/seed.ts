import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // 1. 👤 Create demo users
  const hashedPassword = await hash('demo123456', 12)
  
  const adminUser = await prisma.users.upsert({
    where: { email: 'admin@restaurant.demo' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440001',
      username: 'admin_demo',
      email: 'admin@restaurant.demo',
      password_hash: hashedPassword,
      first_name: 'Admin',
      last_name: 'Demo',
      full_name: 'Admin Demo',
      phone_code: '+84',
      phone_number: '0123456789',
      role: 'admin',
      status: 'active',
      email_verified_at: new Date(),
    },
  })

  const managerUser = await prisma.users.upsert({
    where: { email: 'manager@restaurant.demo' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440002',
      username: 'manager_demo',
      email: 'manager@restaurant.demo',
      password_hash: hashedPassword,
      first_name: 'Manager',
      last_name: 'Demo',
      full_name: 'Manager Demo',
      phone_code: '+84',
      phone_number: '0123456790',
      role: 'user',
      status: 'active',
      email_verified_at: new Date(),
    },
  })

  const customerUser = await prisma.users.upsert({
    where: { email: 'customer@restaurant.demo' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440003',
      username: 'customer_demo',
      email: 'customer@restaurant.demo',
      password_hash: hashedPassword,
      first_name: 'Khách Hàng',
      last_name: 'Demo',
      full_name: 'Khách Hàng Demo',
      phone_code: '+84',
      phone_number: '0123456791',
      role: 'user',
      status: 'active',
      email_verified_at: new Date(),
    },
  })

  console.log('✅ Users created')

  // 2. 🏢 Create organization
  const organization = await prisma.organizations.upsert({
    where: { code: 'DEMO_ORG' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440010',
      name: 'Nhà Hàng Demo Corporation',
      code: 'DEMO_ORG',
      description: 'Tổ chức demo cho hệ thống quản lý nhà hàng',
      owner_id: adminUser.id,
    },
  })

  console.log('✅ Organization created')

  // 3. 🍽️ Create restaurant chain
  const restaurantChain = await prisma.restaurant_chains.upsert({
    where: { id: '550e8400-e29b-41d4-a716-446655440011' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440011',
      name: 'Chuỗi Nhà Hàng Việt',
      description: 'Chuỗi nhà hàng phục vụ món ăn Việt Nam',
      owner_id: adminUser.id,
    },
  })

  console.log('✅ Restaurant chain created')

  // 4. 🏪 Create restaurants
  const restaurant1 = await prisma.restaurants.upsert({
    where: { id: '550e8400-e29b-41d4-a716-446655440020' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440020',
      organization_id: organization.id,
      chain_id: restaurantChain.id,
      code: 'HCM_001',
      name: 'Nhà Hàng Sài Gòn',
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
      phone_number: '028-1234-5678',
      description: 'Nhà hàng phục vụ món ăn truyền thống Việt Nam',
      manager_id: managerUser.id,
    },
  })

  const restaurant2 = await prisma.restaurants.upsert({
    where: { id: '550e8400-e29b-41d4-a716-446655440021' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440021',
      organization_id: organization.id,
      chain_id: restaurantChain.id,
      code: 'HN_001',
      name: 'Nhà Hàng Hà Nội',
      address: '456 Hoàn Kiếm, Quận Hoàn Kiếm, Hà Nội',
      phone_number: '024-1234-5678',
      description: 'Nhà hàng phong cách Bắc Bộ',
      manager_id: managerUser.id,
    },
  })

  console.log('✅ Restaurants created')

  // 5. 🪑 Create tables
  const tables = []
  for (let i = 1; i <= 10; i++) {
    const table = await prisma.tables.create({
      data: {
        restaurant_id: restaurant1.id,
        table_number: `T${i.toString().padStart(2, '0')}`,
        capacity: i <= 4 ? 2 : i <= 8 ? 4 : 6,
        location: i <= 5 ? 'Tầng 1' : 'Tầng 2',
        status: 'available',
        qr_code: `QR_${restaurant1.code}_T${i.toString().padStart(2, '0')}`,
      },
    })
    tables.push(table)
  }

  console.log('✅ Tables created')

  // 6. 📚 Create categories
  const categories = await Promise.all([
    prisma.categories.upsert({
      where: { slug: 'mon-chinh' },
      update: {},
      create: {
        name: 'Món Chính',
        slug: 'mon-chinh',
        description: 'Các món ăn chính',
      },
    }),
    prisma.categories.upsert({
      where: { slug: 'do-uong' },
      update: {},
      create: {
        name: 'Đồ Uống',
        slug: 'do-uong',
        description: 'Các loại nước uống',
      },
    }),
    prisma.categories.upsert({
      where: { slug: 'trang-mieng' },
      update: {},
      create: {
        name: 'Tráng Miệng',
        slug: 'trang-mieng',
        description: 'Các món tráng miệng',
      },
    }),
  ])

  console.log('✅ Categories created')

  // 7. 🍽️ Create menu
  const menu = await prisma.menus.upsert({
    where: { id: '550e8400-e29b-41d4-a716-446655440030' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440030',
      restaurant_id: restaurant1.id,
      name: 'Thực Đơn Chính',
      description: 'Thực đơn các món ăn truyền thống Việt Nam',
      is_active: true,
    },
  })

  // 8. 🍜 Create menu items
  const menuItems = await Promise.all([
    prisma.menu_items.create({
      data: {
        menu_id: menu.id,
        name: 'Phở Bò Tái',
        description: 'Phở bò tái thơm ngon với nước dùng đậm đà',
        price: 85000,
        image_url: '/images/pho-bo-tai.jpg',
        is_available: true,
        category_id: categories[0].id,
      },
    }),
    prisma.menu_items.create({
      data: {
        menu_id: menu.id,
        name: 'Bún Bò Huế',
        description: 'Bún bò Huế cay nồng đặc trưng miền Trung',
        price: 75000,
        image_url: '/images/bun-bo-hue.jpg',
        is_available: true,
        category_id: categories[0].id,
      },
    }),
    prisma.menu_items.create({
      data: {
        menu_id: menu.id,
        name: 'Cơm Tấm Sườn Nướng',
        description: 'Cơm tấm sườn nướng với chả trứng và bì',
        price: 65000,
        image_url: '/images/com-tam-suon-nuong.jpg',
        is_available: true,
        category_id: categories[0].id,
      },
    }),
    prisma.menu_items.create({
      data: {
        menu_id: menu.id,
        name: 'Cà Phê Sữa Đá',
        description: 'Cà phê sữa đá truyền thống Việt Nam',
        price: 25000,
        image_url: '/images/ca-phe-sua-da.jpg',
        is_available: true,
        category_id: categories[1].id,
      },
    }),
    prisma.menu_items.create({
      data: {
        menu_id: menu.id,
        name: 'Chè Ba Màu',
        description: 'Chè ba màu mát lạnh',
        price: 30000,
        image_url: '/images/che-ba-mau.jpg',
        is_available: true,
        category_id: categories[2].id,
      },
    }),
  ])

  console.log('✅ Menu items created')

  // 9. 🏪 Create inventory items
  const inventoryItems = await Promise.all([
    prisma.inventory_items.create({
      data: {
        restaurant_id: restaurant1.id,
        name: 'Thịt Bò',
        description: 'Thịt bò tươi cho phở',
        unit: 'kg',
        quantity: 50,
        min_quantity: 10,
        max_quantity: 100,
      },
    }),
    prisma.inventory_items.create({
      data: {
        restaurant_id: restaurant1.id,
        name: 'Bánh Phở',
        description: 'Bánh phở tươi',
        unit: 'kg',
        quantity: 30,
        min_quantity: 5,
        max_quantity: 50,
      },
    }),
    prisma.inventory_items.create({
      data: {
        restaurant_id: restaurant1.id,
        name: 'Cà Phê Rang Xay',
        description: 'Cà phê rang xay nguyên chất',
        unit: 'kg',
        quantity: 20,
        min_quantity: 3,
        max_quantity: 30,
      },
    }),
  ])

  console.log('✅ Inventory items created')

  // 10. 📝 Create recipes
  const recipe1 = await prisma.recipes.create({
    data: {
      menu_item_id: menuItems[0].id, // Phở Bò Tái
      name: 'Công Thức Phở Bò Tái',
      description: 'Công thức nấu phở bò tái chuẩn vị',
    },
  })

  await prisma.recipe_ingredients.createMany({
    data: [
      {
        recipe_id: recipe1.id,
        inventory_item_id: inventoryItems[0].id, // Thịt bò
        quantity: 0.2,
        unit: 'kg',
      },
      {
        recipe_id: recipe1.id,
        inventory_item_id: inventoryItems[1].id, // Bánh phở
        quantity: 0.15,
        unit: 'kg',
      },
    ],
  })

  console.log('✅ Recipes created')

  // 11. 🎟️ Create vouchers
  await prisma.vouchers.createMany({
    data: [
      {
        code: 'WELCOME10',
        description: 'Giảm 10% cho khách hàng mới',
        discount_type: 'percent',
        discount_value: 10,
        min_order_value: 100000,
        max_discount: 50000,
        start_date: new Date(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        usage_limit: 100,
        restaurant_id: restaurant1.id,
      },
      {
        code: 'FREESHIP',
        description: 'Miễn phí giao hàng',
        discount_type: 'fixed',
        discount_value: 30000,
        min_order_value: 200000,
        start_date: new Date(),
        end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        usage_limit: 50,
        restaurant_id: restaurant1.id,
      },
    ],
  })

  console.log('✅ Vouchers created')

  // 12. 👨‍💼 Create staff
  const staffUser = await prisma.users.create({
    data: {
      username: 'staff_demo',
      email: 'staff@restaurant.demo',
      password_hash: hashedPassword,
      first_name: 'Nhân Viên',
      last_name: 'Demo',
      full_name: 'Nhân Viên Demo',
      phone_code: '+84',
      phone_number: '0123456792',
      role: 'user',
      status: 'active',
      email_verified_at: new Date(),
    },
  })

  await prisma.restaurant_staffs.create({
    data: {
      restaurant_id: restaurant1.id,
      user_id: staffUser.id,
      role: 'staff',
      status: 'active',
    },
  })

  console.log('✅ Staff created')

  // 13. 📅 Create staff schedule
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  await prisma.staff_schedules.create({
    data: {
      staff_id: staffUser.id,
      restaurant_id: restaurant1.id,
      shift_date: tomorrow,
      shift_type: 'morning',
      start_time: new Date('2024-01-01T08:00:00Z'),
      end_time: new Date('2024-01-01T16:00:00Z'),
      status: 'scheduled',
    },
  })

  console.log('✅ Staff schedule created')

  // 14. 📊 Create sample reservation
  await prisma.reservations.create({
    data: {
      table_id: tables[0].id,
      customer_id: customerUser.id,
      customer_name: 'Khách Hàng Demo',
      customer_phone: '0123456791',
      customer_email: 'customer@restaurant.demo',
      party_size: 2,
      reservation_date: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      duration_hours: 2,
      status: 'confirmed',
      special_requests: 'Chỗ ngồi gần cửa sổ',
    },
  })

  console.log('✅ Sample reservation created')

  // 15. 🎉 Create promotions
  await prisma.promotions.create({
    data: {
      restaurant_id: restaurant1.id,
      name: 'Happy Hour',
      description: 'Giảm 20% tất cả đồ uống từ 14h-16h',
      type: 'percentage',
      discount_value: 20,
      conditions: {
        time_start: '14:00',
        time_end: '16:00',
        applicable_categories: ['đồ uống'],
      },
      applicable_tables: [],
      time_restrictions: {
        days_of_week: [1, 2, 3, 4, 5], // Monday to Friday
      },
      start_date: new Date(),
      end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      is_active: true,
    },
  })

  console.log('✅ Promotions created')

  console.log('🎉 Database seeding completed successfully!')
  console.log('\n📊 Summary:')
  console.log('- 4 users created (admin, manager, customer, staff)')
  console.log('- 1 organization with 1 restaurant chain')
  console.log('- 2 restaurants (Sài Gòn & Hà Nội)')
  console.log('- 10 tables in Sài Gòn restaurant')
  console.log('- 5 menu items with categories')
  console.log('- 3 inventory items with recipe connections')
  console.log('- 2 vouchers for promotions')
  console.log('- 1 staff member with schedule')
  console.log('- 1 sample reservation')
  console.log('- 1 happy hour promotion')
  console.log('\n🔐 Login credentials:')
  console.log('Admin: admin@restaurant.demo / demo123456')
  console.log('Manager: manager@restaurant.demo / demo123456')
  console.log('Customer: customer@restaurant.demo / demo123456')
  console.log('Staff: staff@restaurant.demo / demo123456')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
