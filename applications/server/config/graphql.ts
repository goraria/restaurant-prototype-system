// ================================
// 🚀 GraphQL Schema Configuration
// ================================

import cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import { 
  GraphQLObjectType, 
  GraphQLString, 
  GraphQLList, 
  GraphQLSchema,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull
} from 'graphql';
import prisma from '@/config/prisma';

// Import GraphQL Types
import {
  UserType,
  AddressType,
  OrganizationType,
  RestaurantChainType,
  RestaurantType,
  CategoryType,
  MenuType,
  MenuItemType,
  TableType,
  TableOrderType,
  ReservationType,
  OrderType,
  OrderItemType,
  OrderStatusHistoryType,
  PaymentType,
  RestaurantStaffType,
  StaffScheduleType,
  StaffAttendanceType,
  InventoryItemType,
  InventoryTransactionType,
  RecipeType,
  RecipeIngredientType,
  VoucherType,
  VoucherUsageType,
  PromotionType,
  ReviewType,
  ConversationType,
  MessageType,
  RevenueReportType,
  DriverType,
  DeliveryType,
  NotificationType,
  UserSessionType,
  AuditLogType
} from '../constants/graphql';

// ================================
// 🔍 ENHANCED ROOT QUERY WITH COMPLETE DATABASE COVERAGE
// ================================

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // ================================
    // 🏠 SYSTEM QUERIES
    // ================================
    
    hello: {
      type: GraphQLString,
      resolve: () => 'Hello from GraphQL Restaurant API! 🚀🍽️'
    },

    // ================================
    // 👤 USER QUERIES
    // ================================
    
    users: {
      type: new GraphQLList(UserType),
      args: {
        role: { type: GraphQLString },
        status: { type: GraphQLString },
        search: { type: GraphQLString },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt }
      },
      resolve: async (parent, args) => {
        try {
          const whereClause: any = {};
          
          if (args.role) whereClause.role = args.role;
          if (args.status) whereClause.status = args.status;
          if (args.search) {
            whereClause.OR = [
              { username: { contains: args.search, mode: 'insensitive' } },
              { email: { contains: args.search, mode: 'insensitive' } },
              { full_name: { contains: args.search, mode: 'insensitive' } }
            ];
          }

          return await prisma.users.findMany({
            where: whereClause,
            orderBy: { created_at: 'desc' },
            take: args.limit || 50,
            skip: args.offset || 0
          });
        } catch (error) {
          console.error('GraphQL Users Query Error:', error);
          throw new Error('Không thể lấy danh sách người dùng');
        }
      }
    },

    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (parent, args) => {
        try {
          return await prisma.users.findUnique({
            where: { id: args.id }
          });
        } catch (error) {
          console.error('GraphQL User Query Error:', error);
          throw new Error('Không thể lấy thông tin người dùng');
        }
      }
    },

    // ================================
    // 🏢 ORGANIZATION QUERIES
    // ================================
    
    organizations: {
      type: new GraphQLList(OrganizationType),
      resolve: async () => {
        try {
          return await prisma.organizations.findMany({
            orderBy: { created_at: 'desc' }
          });
        } catch (error) {
          console.error('GraphQL Organizations Query Error:', error);
          throw new Error('Không thể lấy danh sách tổ chức');
        }
      }
    },

    organization: {
      type: OrganizationType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (parent, args) => {
        try {
          return await prisma.organizations.findUnique({
            where: { id: args.id }
          });
        } catch (error) {
          console.error('GraphQL Organization Query Error:', error);
          throw new Error('Không thể lấy thông tin tổ chức');
        }
      }
    },

    // ================================
    // 🏪 RESTAURANT QUERIES
    // ================================
    
    restaurants: {
      type: new GraphQLList(RestaurantType),
      args: {
        organization_id: { type: GraphQLID },
        status: { type: GraphQLString },
        search: { type: GraphQLString },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt }
      },
      resolve: async (parent, args) => {
        try {
          const whereClause: any = {};
          
          if (args.organization_id) whereClause.organization_id = args.organization_id;
          if (args.status) whereClause.status = args.status;
          if (args.search) {
            whereClause.OR = [
              { name: { contains: args.search, mode: 'insensitive' } },
              { address: { contains: args.search, mode: 'insensitive' } },
              { code: { contains: args.search, mode: 'insensitive' } }
            ];
          }

          return await prisma.restaurants.findMany({
            where: whereClause,
            orderBy: { created_at: 'desc' },
            take: args.limit || 50,
            skip: args.offset || 0
          });
        } catch (error) {
          console.error('GraphQL Restaurants Query Error:', error);
          throw new Error('Không thể lấy danh sách nhà hàng');
        }
      }
    },

    restaurant: {
      type: RestaurantType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (parent, args) => {
        try {
          return await prisma.restaurants.findUnique({
            where: { id: args.id }
          });
        } catch (error) {
          console.error('GraphQL Restaurant Query Error:', error);
          throw new Error('Không thể lấy thông tin nhà hàng');
        }
      }
    },

    // ================================
    // 🍽️ MENU QUERIES
    // ================================
    
    categories: {
      type: new GraphQLList(CategoryType),
      args: {
        parent_id: { type: GraphQLID },
        is_active: { type: GraphQLBoolean }
      },
      resolve: async (parent, args) => {
        try {
          const whereClause: any = {};
          if (args.parent_id !== undefined) whereClause.parent_id = args.parent_id;
          if (args.is_active !== undefined) whereClause.is_active = args.is_active;

          return await prisma.categories.findMany({
            where: whereClause,
            orderBy: { display_order: 'asc' }
          });
        } catch (error) {
          console.error('GraphQL Categories Query Error:', error);
          throw new Error('Không thể lấy danh sách danh mục');
        }
      }
    },

    menus: {
      type: new GraphQLList(MenuType),
      args: {
        restaurant_id: { type: new GraphQLNonNull(GraphQLID) },
        is_active: { type: GraphQLBoolean }
      },
      resolve: async (parent, args) => {
        try {
          const whereClause: any = { restaurant_id: args.restaurant_id };
          if (args.is_active !== undefined) whereClause.is_active = args.is_active;

          return await prisma.menus.findMany({
            where: whereClause,
            orderBy: { display_order: 'asc' }
          });
        } catch (error) {
          console.error('GraphQL Menus Query Error:', error);
          throw new Error('Không thể lấy danh sách menu');
        }
      }
    },

    menuItems: {
      type: new GraphQLList(MenuItemType),
      args: {
        menu_id: { type: GraphQLID },
        category_id: { type: GraphQLID },
        is_available: { type: GraphQLBoolean },
        is_featured: { type: GraphQLBoolean },
        search: { type: GraphQLString },
        min_price: { type: GraphQLFloat },
        max_price: { type: GraphQLFloat },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt }
      },
      resolve: async (parent, args) => {
        try {
          const whereClause: any = {};
          
          if (args.menu_id) whereClause.menu_id = args.menu_id;
          if (args.category_id) whereClause.category_id = args.category_id;
          if (args.is_available !== undefined) whereClause.is_available = args.is_available;
          if (args.is_featured !== undefined) whereClause.is_featured = args.is_featured;
          if (args.min_price !== undefined || args.max_price !== undefined) {
            whereClause.price = {};
            if (args.min_price !== undefined) whereClause.price.gte = args.min_price;
            if (args.max_price !== undefined) whereClause.price.lte = args.max_price;
          }
          if (args.search) {
            whereClause.OR = [
              { name: { contains: args.search, mode: 'insensitive' } },
              { description: { contains: args.search, mode: 'insensitive' } }
            ];
          }

          return await prisma.menu_items.findMany({
            where: whereClause,
            orderBy: { display_order: 'asc' },
            take: args.limit || 50,
            skip: args.offset || 0
          });
        } catch (error) {
          console.error('GraphQL MenuItems Query Error:', error);
          throw new Error('Không thể lấy danh sách món ăn');
        }
      }
    },

    // ================================
    // 🪑 TABLE & RESERVATION QUERIES
    // ================================
    
    tables: {
      type: new GraphQLList(TableType),
      args: {
        restaurant_id: { type: new GraphQLNonNull(GraphQLID) },
        status: { type: GraphQLString }
      },
      resolve: async (parent, args) => {
        try {
          const whereClause: any = { restaurant_id: args.restaurant_id };
          if (args.status) whereClause.status = args.status;

          return await prisma.tables.findMany({
            where: whereClause,
            orderBy: { table_number: 'asc' }
          });
        } catch (error) {
          console.error('GraphQL Tables Query Error:', error);
          throw new Error('Không thể lấy danh sách bàn');
        }
      }
    },

    reservations: {
      type: new GraphQLList(ReservationType),
      args: {
        restaurant_id: { type: GraphQLID },
        table_id: { type: GraphQLID },
        customer_id: { type: GraphQLID },
        status: { type: GraphQLString },
        date_from: { type: GraphQLString },
        date_to: { type: GraphQLString },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt }
      },
      resolve: async (parent, args) => {
        try {
          const whereClause: any = {};
          
          if (args.table_id) whereClause.table_id = args.table_id;
          if (args.customer_id) whereClause.customer_id = args.customer_id;
          if (args.status) whereClause.status = args.status;
          if (args.date_from || args.date_to) {
            whereClause.reservation_date = {};
            if (args.date_from) whereClause.reservation_date.gte = new Date(args.date_from);
            if (args.date_to) whereClause.reservation_date.lte = new Date(args.date_to);
          }

          // Filter by restaurant through table relationship
          if (args.restaurant_id) {
            whereClause.tables = {
              restaurant_id: args.restaurant_id
            };
          }

          return await prisma.reservations.findMany({
            where: whereClause,
            orderBy: { reservation_date: 'desc' },
            take: args.limit || 50,
            skip: args.offset || 0
          });
        } catch (error) {
          console.error('GraphQL Reservations Query Error:', error);
          throw new Error('Không thể lấy danh sách đặt bàn');
        }
      }
    },

    // ================================
    // 🛒 ORDER QUERIES
    // ================================
    
    orders: {
      type: new GraphQLList(OrderType),
      args: {
        restaurant_id: { type: GraphQLID },
        customer_id: { type: GraphQLID },
        status: { type: GraphQLString },
        order_type: { type: GraphQLString },
        payment_status: { type: GraphQLString },
        created_from: { type: GraphQLString },
        created_to: { type: GraphQLString },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt }
      },
      resolve: async (parent, args) => {
        try {
          const whereClause: any = {};
          
          if (args.restaurant_id) whereClause.restaurant_id = args.restaurant_id;
          if (args.customer_id) whereClause.customer_id = args.customer_id;
          if (args.status) whereClause.status = args.status;
          if (args.order_type) whereClause.order_type = args.order_type;
          if (args.payment_status) whereClause.payment_status = args.payment_status;
          if (args.created_from || args.created_to) {
            whereClause.created_at = {};
            if (args.created_from) whereClause.created_at.gte = new Date(args.created_from);
            if (args.created_to) whereClause.created_at.lte = new Date(args.created_to);
          }

          return await prisma.orders.findMany({
            where: whereClause,
            orderBy: { created_at: 'desc' },
            take: args.limit || 50,
            skip: args.offset || 0
          });
        } catch (error) {
          console.error('GraphQL Orders Query Error:', error);
          throw new Error('Không thể lấy danh sách đơn hàng');
        }
      }
    },

    order: {
      type: OrderType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (parent, args) => {
        try {
          return await prisma.orders.findUnique({
            where: { id: args.id }
          });
        } catch (error) {
          console.error('GraphQL Order Query Error:', error);
          throw new Error('Không thể lấy thông tin đơn hàng');
        }
      }
    },

    orderItems: {
      type: new GraphQLList(OrderItemType),
      args: { order_id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (parent, args) => {
        try {
          return await prisma.order_items.findMany({
            where: { order_id: args.order_id },
            orderBy: { created_at: 'asc' }
          });
        } catch (error) {
          console.error('GraphQL OrderItems Query Error:', error);
          throw new Error('Không thể lấy chi tiết đơn hàng');
        }
      }
    },

    // ================================
    // 💳 PAYMENT QUERIES
    // ================================
    
    payments: {
      type: new GraphQLList(PaymentType),
      args: {
        order_id: { type: GraphQLID },
        status: { type: GraphQLString },
        method: { type: GraphQLString },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt }
      },
      resolve: async (parent, args) => {
        try {
          const whereClause: any = {};
          
          if (args.order_id) whereClause.order_id = args.order_id;
          if (args.status) whereClause.status = args.status;
          if (args.method) whereClause.method = args.method;

          return await prisma.payments.findMany({
            where: whereClause,
            orderBy: { created_at: 'desc' },
            take: args.limit || 50,
            skip: args.offset || 0
          });
        } catch (error) {
          console.error('GraphQL Payments Query Error:', error);
          throw new Error('Không thể lấy danh sách thanh toán');
        }
      }
    },

    // ================================
    // 🏪 INVENTORY QUERIES
    // ================================
    
    inventoryItems: {
      type: new GraphQLList(InventoryItemType),
      args: {
        restaurant_id: { type: new GraphQLNonNull(GraphQLID) },
        low_stock: { type: GraphQLBoolean },
        search: { type: GraphQLString },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt }
      },
      resolve: async (parent, args) => {
        try {
          const whereClause: any = { restaurant_id: args.restaurant_id };
          
          if (args.search) {
            whereClause.OR = [
              { name: { contains: args.search, mode: 'insensitive' } },
              { supplier: { contains: args.search, mode: 'insensitive' } }
            ];
          }

          if (args.low_stock) {
            // Items where quantity <= min_quantity
            whereClause.AND = [
              { min_quantity: { not: null } },
              { quantity: { lte: prisma.inventory_items.fields.min_quantity } }
            ];
          }

          return await prisma.inventory_items.findMany({
            where: whereClause,
            orderBy: { name: 'asc' },
            take: args.limit || 50,
            skip: args.offset || 0
          });
        } catch (error) {
          console.error('GraphQL InventoryItems Query Error:', error);
          throw new Error('Không thể lấy danh sách tồn kho');
        }
      }
    },

    // ================================
    // 🎟️ VOUCHER & PROMOTION QUERIES
    // ================================
    
    vouchers: {
      type: new GraphQLList(VoucherType),
      args: {
        restaurant_id: { type: GraphQLID },
        is_active: { type: GraphQLBoolean },
        code: { type: GraphQLString },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt }
      },
      resolve: async (parent, args) => {
        try {
          const whereClause: any = {};
          
          if (args.restaurant_id) whereClause.restaurant_id = args.restaurant_id;
          if (args.is_active !== undefined) whereClause.is_active = args.is_active;
          if (args.code) whereClause.code = { contains: args.code, mode: 'insensitive' };

          return await prisma.vouchers.findMany({
            where: whereClause,
            orderBy: { created_at: 'desc' },
            take: args.limit || 50,
            skip: args.offset || 0
          });
        } catch (error) {
          console.error('GraphQL Vouchers Query Error:', error);
          throw new Error('Không thể lấy danh sách voucher');
        }
      }
    },

    promotions: {
      type: new GraphQLList(PromotionType),
      args: {
        restaurant_id: { type: new GraphQLNonNull(GraphQLID) },
        is_active: { type: GraphQLBoolean },
        type: { type: GraphQLString },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt }
      },
      resolve: async (parent, args) => {
        try {
          const whereClause: any = { restaurant_id: args.restaurant_id };
          
          if (args.is_active !== undefined) whereClause.is_active = args.is_active;
          if (args.type) whereClause.type = args.type;

          return await prisma.promotions.findMany({
            where: whereClause,
            orderBy: { created_at: 'desc' },
            take: args.limit || 50,
            skip: args.offset || 0
          });
        } catch (error) {
          console.error('GraphQL Promotions Query Error:', error);
          throw new Error('Không thể lấy danh sách khuyến mãi');
        }
      }
    },

    // ================================
    // ⭐ REVIEW QUERIES
    // ================================
    
    reviews: {
      type: new GraphQLList(ReviewType),
      args: {
        restaurant_id: { type: GraphQLID },
        customer_id: { type: GraphQLID },
        menu_item_id: { type: GraphQLID },
        rating: { type: GraphQLInt },
        status: { type: GraphQLString },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt }
      },
      resolve: async (parent, args) => {
        try {
          const whereClause: any = {};
          
          if (args.restaurant_id) whereClause.restaurant_id = args.restaurant_id;
          if (args.customer_id) whereClause.customer_id = args.customer_id;
          if (args.menu_item_id) whereClause.menu_item_id = args.menu_item_id;
          if (args.rating) whereClause.rating = args.rating;
          if (args.status) whereClause.status = args.status;

          return await prisma.reviews.findMany({
            where: whereClause,
            orderBy: { created_at: 'desc' },
            take: args.limit || 50,
            skip: args.offset || 0
          });
        } catch (error) {
          console.error('GraphQL Reviews Query Error:', error);
          throw new Error('Không thể lấy danh sách đánh giá');
        }
      }
    },

    // ================================
    // 💬 CHAT QUERIES
    // ================================
    
    conversations: {
      type: new GraphQLList(ConversationType),
      args: {
        userId: { type: GraphQLString },
        restaurant_id: { type: GraphQLID },
        type: { type: GraphQLString },
        status: { type: GraphQLString },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt }
      },
      resolve: async (parent, args) => {
        try {
          const whereClause: any = {};
          
          if (args.userId) {
            whereClause.OR = [
              { customer_id: args.userId },
              { staff_id: args.userId }
            ];
          }
          
          if (args.restaurant_id) whereClause.restaurant_id = args.restaurant_id;
          if (args.type) whereClause.type = args.type;
          if (args.status) whereClause.status = args.status;

          return await prisma.conversations.findMany({
            where: whereClause,
            orderBy: { updated_at: 'desc' },
            take: args.limit || 50,
            skip: args.offset || 0
          });
        } catch (error) {
          console.error('GraphQL Conversations Query Error:', error);
          throw new Error('Không thể lấy danh sách cuộc trò chuyện');
        }
      }
    },

    conversation: {
      type: ConversationType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (parent, args) => {
        try {
          return await prisma.conversations.findUnique({
            where: { id: args.id }
          });
        } catch (error) {
          console.error('GraphQL Conversation Query Error:', error);
          throw new Error('Không thể lấy thông tin cuộc trò chuyện');
        }
      }
    },

    messages: {
      type: new GraphQLList(MessageType),
      args: {
        conversationId: { type: new GraphQLNonNull(GraphQLID) },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt }
      },
      resolve: async (parent, args) => {
        try {
          return await prisma.messages.findMany({
            where: { conversation_id: args.conversationId },
            orderBy: { created_at: 'desc' },
            take: args.limit || 50,
            skip: args.offset || 0
          });
        } catch (error) {
          console.error('GraphQL Messages Query Error:', error);
          throw new Error('Không thể lấy danh sách tin nhắn');
        }
      }
    }
  }
});

// ================================
// 🔧 ROOT MUTATION WITH CRUD OPERATIONS
// ================================

const RootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    // ================================
    // 👤 USER MUTATIONS
    // ================================
    
    createUser: {
      type: UserType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        full_name: { type: GraphQLString },
        role: { type: GraphQLString, defaultValue: 'customer' },
        status: { type: GraphQLString, defaultValue: 'active' }
      },
      resolve: async (parent, args) => {
        try {
          return await prisma.users.create({
            data: args
          });
        } catch (error) {
          console.error('GraphQL Create User Error:', error);
          throw new Error('Không thể tạo người dùng mới');
        }
      }
    },

    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        full_name: { type: GraphQLString },
        role: { type: GraphQLString },
        status: { type: GraphQLString }
      },
      resolve: async (parent, args) => {
        try {
          const { id, ...updateData } = args;
          return await prisma.users.update({
            where: { id },
            data: updateData
          });
        } catch (error) {
          console.error('GraphQL Update User Error:', error);
          throw new Error('Không thể cập nhật người dùng');
        }
      }
    },

    deleteUser: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (parent, args) => {
        try {
          await prisma.users.delete({
            where: { id: args.id }
          });
          return 'Người dùng đã được xóa thành công';
        } catch (error) {
          console.error('GraphQL Delete User Error:', error);
          throw new Error('Không thể xóa người dùng');
        }
      }
    },

    // ================================
    // 🏪 RESTAURANT MUTATIONS
    // ================================
    
    createRestaurant: {
      type: RestaurantType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        address: { type: GraphQLString },
        phone: { type: GraphQLString },
        email: { type: GraphQLString },
        organization_id: { type: GraphQLID },
        status: { type: GraphQLString, defaultValue: 'active' }
      },
      resolve: async (parent, args) => {
        try {
          return await prisma.restaurants.create({
            data: args
          });
        } catch (error) {
          console.error('GraphQL Create Restaurant Error:', error);
          throw new Error('Không thể tạo nhà hàng mới');
        }
      }
    },

    updateRestaurant: {
      type: RestaurantType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        address: { type: GraphQLString },
        phone: { type: GraphQLString },
        email: { type: GraphQLString },
        status: { type: GraphQLString }
      },
      resolve: async (parent, args) => {
        try {
          const { id, ...updateData } = args;
          return await prisma.restaurants.update({
            where: { id },
            data: updateData
          });
        } catch (error) {
          console.error('GraphQL Update Restaurant Error:', error);
          throw new Error('Không thể cập nhật nhà hàng');
        }
      }
    },

    deleteRestaurant: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (parent, args) => {
        try {
          await prisma.restaurants.delete({
            where: { id: args.id }
          });
          return 'Nhà hàng đã được xóa thành công';
        } catch (error) {
          console.error('GraphQL Delete Restaurant Error:', error);
          throw new Error('Không thể xóa nhà hàng');
        }
      }
    },

    // ================================
    // 🍽️ MENU MUTATIONS
    // ================================
    
    createCategory: {
      type: CategoryType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        parent_id: { type: GraphQLID },
        is_active: { type: GraphQLBoolean, defaultValue: true },
        display_order: { type: GraphQLInt, defaultValue: 0 }
      },
      resolve: async (parent, args) => {
        try {
          return await prisma.categories.create({
            data: args
          });
        } catch (error) {
          console.error('GraphQL Create Category Error:', error);
          throw new Error('Không thể tạo danh mục mới');
        }
      }
    },

    updateCategory: {
      type: CategoryType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        is_active: { type: GraphQLBoolean },
        display_order: { type: GraphQLInt }
      },
      resolve: async (parent, args) => {
        try {
          const { id, ...updateData } = args;
          return await prisma.categories.update({
            where: { id },
            data: updateData
          });
        } catch (error) {
          console.error('GraphQL Update Category Error:', error);
          throw new Error('Không thể cập nhật danh mục');
        }
      }
    },

    createMenu: {
      type: MenuType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        restaurant_id: { type: new GraphQLNonNull(GraphQLID) },
        is_active: { type: GraphQLBoolean, defaultValue: true },
        display_order: { type: GraphQLInt, defaultValue: 0 }
      },
      resolve: async (parent, args) => {
        try {
          return await prisma.menus.create({
            data: args
          });
        } catch (error) {
          console.error('GraphQL Create Menu Error:', error);
          throw new Error('Không thể tạo menu mới');
        }
      }
    },

    createMenuItem: {
      type: MenuItemType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        price: { type: new GraphQLNonNull(GraphQLFloat) },
        menu_id: { type: new GraphQLNonNull(GraphQLID) },
        category_id: { type: GraphQLID },
        is_available: { type: GraphQLBoolean, defaultValue: true },
        is_featured: { type: GraphQLBoolean, defaultValue: false },
        display_order: { type: GraphQLInt, defaultValue: 0 }
      },
      resolve: async (parent, args) => {
        try {
          return await prisma.menu_items.create({
            data: args
          });
        } catch (error) {
          console.error('GraphQL Create MenuItem Error:', error);
          throw new Error('Không thể tạo món ăn mới');
        }
      }
    },

    updateMenuItem: {
      type: MenuItemType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLFloat },
        is_available: { type: GraphQLBoolean },
        is_featured: { type: GraphQLBoolean },
        display_order: { type: GraphQLInt }
      },
      resolve: async (parent, args) => {
        try {
          const { id, ...updateData } = args;
          return await prisma.menu_items.update({
            where: { id },
            data: updateData
          });
        } catch (error) {
          console.error('GraphQL Update MenuItem Error:', error);
          throw new Error('Không thể cập nhật món ăn');
        }
      }
    },

    deleteMenuItem: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (parent, args) => {
        try {
          await prisma.menu_items.delete({
            where: { id: args.id }
          });
          return 'Món ăn đã được xóa thành công';
        } catch (error) {
          console.error('GraphQL Delete MenuItem Error:', error);
          throw new Error('Không thể xóa món ăn');
        }
      }
    },

    // ================================
    // 🛒 ORDER MUTATIONS
    // ================================
    
    createOrder: {
      type: OrderType,
      args: {
        customer_id: { type: new GraphQLNonNull(GraphQLID) },
        restaurant_id: { type: new GraphQLNonNull(GraphQLID) },
        table_id: { type: GraphQLID },
        order_type: { type: GraphQLString, defaultValue: 'dine_in' },
        status: { type: GraphQLString, defaultValue: 'pending' },
        payment_status: { type: GraphQLString, defaultValue: 'pending' },
        total_amount: { type: new GraphQLNonNull(GraphQLFloat) },
        notes: { type: GraphQLString }
      },
      resolve: async (parent, args) => {
        try {
          return await prisma.orders.create({
            data: args
          });
        } catch (error) {
          console.error('GraphQL Create Order Error:', error);
          throw new Error('Không thể tạo đơn hàng mới');
        }
      }
    },

    updateOrderStatus: {
      type: OrderType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        status: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (parent, args) => {
        try {
          return await prisma.orders.update({
            where: { id: args.id },
            data: { status: args.status }
          });
        } catch (error) {
          console.error('GraphQL Update Order Status Error:', error);
          throw new Error('Không thể cập nhật trạng thái đơn hàng');
        }
      }
    },

    // ================================
    // 🪑 RESERVATION MUTATIONS
    // ================================
    
    createReservation: {
      type: ReservationType,
      args: {
        customer_id: { type: new GraphQLNonNull(GraphQLID) },
        table_id: { type: new GraphQLNonNull(GraphQLID) },
        reservation_date: { type: new GraphQLNonNull(GraphQLString) },
        party_size: { type: new GraphQLNonNull(GraphQLInt) },
        status: { type: GraphQLString, defaultValue: 'confirmed' },
        special_requests: { type: GraphQLString }
      },
      resolve: async (parent, args) => {
        try {
          return await prisma.reservations.create({
            data: {
              ...args,
              reservation_date: new Date(args.reservation_date)
            }
          });
        } catch (error) {
          console.error('GraphQL Create Reservation Error:', error);
          throw new Error('Không thể tạo đặt bàn mới');
        }
      }
    },

    updateReservationStatus: {
      type: ReservationType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        status: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (parent, args) => {
        try {
          return await prisma.reservations.update({
            where: { id: args.id },
            data: { status: args.status }
          });
        } catch (error) {
          console.error('GraphQL Update Reservation Status Error:', error);
          throw new Error('Không thể cập nhật trạng thái đặt bàn');
        }
      }
    }
  }
});

// ================================
// 📡 ROOT SUBSCRIPTION FOR REALTIME UPDATES
// ================================

const RootSubscription = new GraphQLObjectType({
  name: 'RootSubscriptionType',
  fields: {
    // ================================
    // 🛒 ORDER SUBSCRIPTIONS
    // ================================
    
    orderUpdated: {
      type: OrderType,
      args: {
        restaurant_id: { type: GraphQLID }
      },
      subscribe: async function* (parent, args) {
        // This is a placeholder for real-time order updates
        // In a real implementation, you would use WebSocket or Server-Sent Events
        // For now, we'll return a simple generator that yields updates
        while (true) {
          // Simulate real-time updates
          yield {
            id: 'example-order-id',
            status: 'updated',
            updated_at: new Date().toISOString()
          };
          
          // Wait before next update
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
    },

    newOrder: {
      type: OrderType,
      args: {
        restaurant_id: { type: GraphQLID }
      },
      subscribe: async function* (parent, args) {
        // Placeholder for new order notifications
        while (true) {
          yield {
            id: 'new-order-id',
            status: 'pending',
            created_at: new Date().toISOString()
          };
          
          await new Promise(resolve => setTimeout(resolve, 10000));
        }
      }
    },

    // ================================
    // 🪑 RESERVATION SUBSCRIPTIONS
    // ================================
    
    reservationUpdated: {
      type: ReservationType,
      args: {
        restaurant_id: { type: GraphQLID }
      },
      subscribe: async function* (parent, args) {
        while (true) {
          yield {
            id: 'example-reservation-id',
            status: 'updated',
            updated_at: new Date().toISOString()
          };
          
          await new Promise(resolve => setTimeout(resolve, 8000));
        }
      }
    },

    // ================================
    // 💬 CHAT SUBSCRIPTIONS
    // ================================
    
    newMessage: {
      type: MessageType,
      args: {
        conversation_id: { type: GraphQLID }
      },
      subscribe: async function* (parent, args) {
        while (true) {
          yield {
            id: 'new-message-id',
            content: 'New message received',
            created_at: new Date().toISOString()
          };
          
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }
    }
  }
});

// GraphQL Schema
export const graphqlSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
  subscription: RootSubscription
});

/**
 * Create GraphQL HTTP middleware
 * @returns GraphQL HTTP middleware
 */
export const createGraphQLMiddleware = () => {
  return [
    cors({
      origin: [
        process.env.EXPRESS_CLIENT_URL!,
        process.env.EXPRESS_MOBILE_URL!,
      ],
      credentials: true,
    }),
    graphqlHTTP({
      schema: graphqlSchema,
      graphiql: process.env.EXPRESS_ENV !== 'production', // Enable GraphQL Playground in development
      customFormatErrorFn: (error) => {
        console.error('GraphQL Error:', error);
        return {
          message: error.message,
          locations: error.locations,
          path: error.path,
        };
      }
    })
  ];
};