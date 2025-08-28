import { PrismaClient, inventory_items, inventory_transactions, recipes, recipe_ingredients } from '@prisma/client';
import { 
  CreateInventoryItem, 
  UpdateInventoryItem, 
  InventoryQuery,
  BulkUpdateInventory,
  LowStockAlert,
  CreateInventoryTransaction,
  TransactionQuery,
  CreateRecipe,
  UpdateRecipe,
  RecipeQuery,
  UpdateRecipeIngredients,
  RecipeCostCalculation,
  InventoryStatsQuery,
  StockValuation,
  UsageForecast,
  WasteAnalysis,
  BatchStockAdjustment,
  ImportInventoryData,
  QRInventoryCheck,
  QuickStockUpdate
} from '@/schemas/inventorySchemas';

const prisma = new PrismaClient();

// ================================
// 🔧 HELPER FUNCTIONS
// ================================

const validateUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

const generateQRCode = (itemId: string, itemName: string): string => {
  return `INV_${itemId}_${itemName.toUpperCase().replace(/\s+/g, '_')}`;
};

// ================================
// 🏪 INVENTORY ITEM SERVICES
// ================================

// Tạo nguyên liệu mới
export const createInventoryItem = async (data: CreateInventoryItem) => {
  try {
    // Kiểm tra nhà hàng tồn tại
    const restaurant = await prisma.restaurants.findUnique({
      where: { id: data.restaurant_id }
    });

    if (!restaurant) {
      throw new Error('Nhà hàng không tồn tại');
    }

    // Kiểm tra tên nguyên liệu đã tồn tại trong nhà hàng
    const existingItem = await prisma.inventory_items.findFirst({
      where: {
        restaurant_id: data.restaurant_id,
        name: {
          equals: data.name,
          mode: 'insensitive'
        }
      }
    });

    if (existingItem) {
      throw new Error(`Nguyên liệu "${data.name}" đã tồn tại trong nhà hàng`);
    }

    const inventoryItem = await prisma.inventory_items.create({
      data: {
        ...data,
        expiry_date: data.expiry_date ? new Date(data.expiry_date) : null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        restaurants: {
          select: {
            id: true,
            name: true,
            code: true,
          }
        },
        _count: {
          select: {
            transactions: true,
            recipe_ingredients: true,
          }
        }
      }
    });

    return inventoryItem;
  } catch (error) {
    throw new Error(`Lỗi khi tạo nguyên liệu: ${error}`);
  }
};

// Lấy nguyên liệu theo ID
export const getInventoryItemById = async (id: string) => {
  try {
    if (!validateUUID(id)) {
      throw new Error('ID nguyên liệu không hợp lệ');
    }

    const item = await prisma.inventory_items.findUnique({
      where: { id },
      include: {
        restaurants: {
          select: {
            id: true,
            name: true,
            code: true,
          }
        },
        transactions: {
          orderBy: { created_at: 'desc' },
          take: 10,
          select: {
            id: true,
            type: true,
            quantity: true,
            unit_cost: true,
            total_cost: true,
            supplier: true,
            created_at: true,
          }
        },
        recipe_ingredients: {
          include: {
            recipes: {
              include: {
                menu_items: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!item) {
      throw new Error('Không tìm thấy nguyên liệu');
    }

    return item;
  } catch (error) {
    throw new Error(`Lỗi khi lấy thông tin nguyên liệu: ${error}`);
  }
};

// Lấy danh sách nguyên liệu với filter
export const getInventoryItems = async (filters: InventoryQuery) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort_by = 'name', 
      sort_order = 'asc', 
      ...whereFilters 
    } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (whereFilters.restaurant_id) {
      where.restaurant_id = whereFilters.restaurant_id;
    }

    if (whereFilters.name) {
      where.name = {
        contains: whereFilters.name,
        mode: 'insensitive'
      };
    }

    if (whereFilters.supplier) {
      where.supplier = {
        contains: whereFilters.supplier,
        mode: 'insensitive'
      };
    }

    if (whereFilters.unit) {
      where.unit = {
        contains: whereFilters.unit,
        mode: 'insensitive'
      };
    }

    // Low stock filter
    if (whereFilters.low_stock) {
      where.AND = where.AND || [];
      where.AND.push({
        OR: [
          { 
            AND: [
              { min_quantity: { not: null } },
              { quantity: { lte: prisma.inventory_items.fields.min_quantity } }
            ]
          },
          { 
            AND: [
              { min_quantity: null }, 
              { quantity: { lte: 10 } }
            ] 
          }
        ]
      });
    }

    // Expiring soon filter (7 days)
    if (whereFilters.expiring_soon) {
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
      
      where.expiry_date = {
        lte: sevenDaysFromNow,
        gte: new Date()
      };
    }

    // Expired filter
    if (whereFilters.expired) {
      where.expiry_date = {
        lt: new Date()
      };
    }

    if (whereFilters.min_quantity || whereFilters.max_quantity) {
      where.quantity = {};
      if (whereFilters.min_quantity) where.quantity.gte = whereFilters.min_quantity;
      if (whereFilters.max_quantity) where.quantity.lte = whereFilters.max_quantity;
    }

    if (whereFilters.min_cost || whereFilters.max_cost) {
      where.unit_cost = {};
      if (whereFilters.min_cost) where.unit_cost.gte = whereFilters.min_cost;
      if (whereFilters.max_cost) where.unit_cost.lte = whereFilters.max_cost;
    }

    if (whereFilters.expiry_from || whereFilters.expiry_to) {
      where.expiry_date = {};
      if (whereFilters.expiry_from) where.expiry_date.gte = new Date(whereFilters.expiry_from);
      if (whereFilters.expiry_to) where.expiry_date.lte = new Date(whereFilters.expiry_to);
    }

    const [items, total] = await Promise.all([
      prisma.inventory_items.findMany({
        where,
        include: {
          restaurants: {
            select: {
              id: true,
              name: true,
              code: true,
            }
          },
          _count: {
            select: {
              transactions: true,
              recipe_ingredients: true,
            }
          }
        },
        orderBy: { [sort_by]: sort_order },
        skip,
        take: limit,
      }),
      prisma.inventory_items.count({ where })
    ]);

    return {
      data: items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw new Error(`Lỗi khi lấy danh sách nguyên liệu: ${error}`);
  }
};

// Lấy nguyên liệu theo nhà hàng
export const getInventoryItemsByRestaurantId = async (restaurantId: string) => {
  try {
    if (!validateUUID(restaurantId)) {
      throw new Error('ID nhà hàng không hợp lệ');
    }

    const items = await prisma.inventory_items.findMany({
      where: { restaurant_id: restaurantId },
      include: {
        _count: {
          select: {
            transactions: true,
            recipe_ingredients: true,
          }
        }
      },
      orderBy: { name: 'asc' },
    });

    return items;
  } catch (error) {
    throw new Error(`Lỗi khi lấy nguyên liệu của nhà hàng: ${error}`);
  }
};

// Cập nhật nguyên liệu
export const updateInventoryItem = async (id: string, data: UpdateInventoryItem) => {
  try {
    if (!validateUUID(id)) {
      throw new Error('ID nguyên liệu không hợp lệ');
    }

    const existingItem = await prisma.inventory_items.findUnique({
      where: { id }
    });

    if (!existingItem) {
      throw new Error('Không tìm thấy nguyên liệu');
    }

    // Kiểm tra tên trùng lặp nếu có thay đổi
    if (data.name && data.name !== existingItem.name) {
      const duplicateItem = await prisma.inventory_items.findFirst({
        where: {
          restaurant_id: existingItem.restaurant_id,
          name: {
            equals: data.name,
            mode: 'insensitive'
          },
          id: { not: id }
        }
      });

      if (duplicateItem) {
        throw new Error(`Nguyên liệu "${data.name}" đã tồn tại trong nhà hàng`);
      }
    }

    const updateData: any = {
      ...data,
      updated_at: new Date(),
    };

    if (data.expiry_date) {
      updateData.expiry_date = new Date(data.expiry_date);
    }

    const updatedItem = await prisma.inventory_items.update({
      where: { id },
      data: updateData,
      include: {
        restaurants: {
          select: {
            id: true,
            name: true,
            code: true,
          }
        }
      }
    });

    return updatedItem;
  } catch (error) {
    throw new Error(`Lỗi khi cập nhật nguyên liệu: ${error}`);
  }
};

// Xóa nguyên liệu
export const deleteInventoryItem = async (id: string) => {
  try {
    if (!validateUUID(id)) {
      throw new Error('ID nguyên liệu không hợp lệ');
    }

    const existingItem = await prisma.inventory_items.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            transactions: true,
            recipe_ingredients: true,
          }
        }
      }
    });

    if (!existingItem) {
      throw new Error('Không tìm thấy nguyên liệu');
    }

    if (existingItem._count.transactions > 0 || existingItem._count.recipe_ingredients > 0) {
      throw new Error('Không thể xóa nguyên liệu đã có giao dịch hoặc được sử dụng trong công thức');
    }

    await prisma.inventory_items.delete({
      where: { id }
    });

    return { message: 'Xóa nguyên liệu thành công' };
  } catch (error) {
    throw new Error(`Lỗi khi xóa nguyên liệu: ${error}`);
  }
};

// Cập nhật số lượng hàng loạt
export const bulkUpdateInventory = async (data: BulkUpdateInventory) => {
  try {
    const { items } = data;

    // Kiểm tra tất cả IDs hợp lệ
    for (const item of items) {
      if (!validateUUID(item.id)) {
        throw new Error(`ID nguyên liệu không hợp lệ: ${item.id}`);
      }
    }

    const updatePromises = items.map(item => 
      prisma.inventory_items.update({
        where: { id: item.id },
        data: {
          ...item,
          updated_at: new Date(),
        }
      })
    );

    const updatedItems = await Promise.all(updatePromises);

    return {
      message: `Đã cập nhật ${updatedItems.length} nguyên liệu thành công`,
      count: updatedItems.length,
      items: updatedItems
    };
  } catch (error) {
    throw new Error(`Lỗi khi cập nhật hàng loạt: ${error}`);
  }
};

// Cảnh báo tồn kho thấp
export const getLowStockAlert = async (data: LowStockAlert) => {
  try {
    const { restaurant_id, threshold_days } = data;

    if (!validateUUID(restaurant_id)) {
      throw new Error('ID nhà hàng không hợp lệ');
    }

    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + threshold_days);

    const [lowStockItems, expiringSoonItems] = await Promise.all([
      // Items below minimum quantity
      prisma.inventory_items.findMany({
        where: {
          restaurant_id,
          AND: [
            { min_quantity: null }, 
            { quantity: { lte: 10 } }
          ]
        },
        orderBy: { quantity: 'asc' }
      }),
      // Items expiring soon
      prisma.inventory_items.findMany({
        where: {
          restaurant_id,
          expiry_date: {
            lte: thresholdDate,
            gte: new Date()
          }
        },
        orderBy: { expiry_date: 'asc' }
      })
    ]);

    return {
      low_stock_items: lowStockItems,
      expiring_soon_items: expiringSoonItems,
      total_alerts: lowStockItems.length + expiringSoonItems.length
    };
  } catch (error) {
    throw new Error(`Lỗi khi lấy cảnh báo tồn kho: ${error}`);
  }
};

// ================================
// 📦 INVENTORY TRANSACTION SERVICES
// ================================

// Tạo giao dịch kho
export const createInventoryTransaction = async (data: CreateInventoryTransaction) => {
  try {
    // Kiểm tra nguyên liệu tồn tại
    const inventoryItem = await prisma.inventory_items.findUnique({
      where: { id: data.inventory_item_id }
    });

    if (!inventoryItem) {
      throw new Error('Nguyên liệu không tồn tại');
    }

    // Tính toán total_cost nếu không được cung cấp
    let totalCost = data.total_cost;
    if (!totalCost && data.unit_cost) {
      totalCost = data.unit_cost * Math.abs(data.quantity);
    }

    // Tạo transaction
    const transaction = await prisma.inventory_transactions.create({
      data: {
        ...data,
        total_cost: totalCost,
        created_at: new Date(),
      },
      include: {
        inventory_items: {
          select: {
            id: true,
            name: true,
            unit: true,
            quantity: true,
          }
        }
      }
    });

    // Cập nhật số lượng trong kho
    const currentQuantity = Number(inventoryItem.quantity);
    const transactionQuantity = Math.abs(data.quantity);
    
    const newQuantity = data.type === 'purchase' || (data.type === 'adjustment' && data.quantity > 0)
      ? currentQuantity + transactionQuantity
      : currentQuantity - transactionQuantity;

    await prisma.inventory_items.update({
      where: { id: data.inventory_item_id },
      data: {
        quantity: Math.max(0, newQuantity),
        updated_at: new Date(),
      }
    });

    return transaction;
  } catch (error) {
    throw new Error(`Lỗi khi tạo giao dịch kho: ${error}`);
  }
};

// Lấy danh sách giao dịch
export const getInventoryTransactions = async (filters: TransactionQuery) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort_by = 'created_at', 
      sort_order = 'desc', 
      ...whereFilters 
    } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (whereFilters.inventory_item_id) {
      where.inventory_item_id = whereFilters.inventory_item_id;
    }

    if (whereFilters.restaurant_id) {
      where.inventory_items = {
        restaurant_id: whereFilters.restaurant_id
      };
    }

    if (whereFilters.type) {
      where.type = whereFilters.type;
    }

    if (whereFilters.supplier) {
      where.supplier = {
        contains: whereFilters.supplier,
        mode: 'insensitive'
      };
    }

    if (whereFilters.invoice_number) {
      where.invoice_number = {
        contains: whereFilters.invoice_number,
        mode: 'insensitive'
      };
    }

    if (whereFilters.date_from || whereFilters.date_to) {
      where.created_at = {};
      if (whereFilters.date_from) where.created_at.gte = new Date(whereFilters.date_from);
      if (whereFilters.date_to) where.created_at.lte = new Date(whereFilters.date_to);
    }

    if (whereFilters.min_amount || whereFilters.max_amount) {
      where.total_cost = {};
      if (whereFilters.min_amount) where.total_cost.gte = whereFilters.min_amount;
      if (whereFilters.max_amount) where.total_cost.lte = whereFilters.max_amount;
    }

    const [transactions, total] = await Promise.all([
      prisma.inventory_transactions.findMany({
        where,
        include: {
          inventory_items: {
            select: {
              id: true,
              name: true,
              unit: true,
              restaurants: {
                select: {
                  id: true,
                  name: true,
                }
              }
            }
          }
        },
        orderBy: { [sort_by]: sort_order },
        skip,
        take: limit,
      }),
      prisma.inventory_transactions.count({ where })
    ]);

    return {
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw new Error(`Lỗi khi lấy danh sách giao dịch: ${error}`);
  }
};

// ================================
// 👨‍🍳 RECIPE SERVICES
// ================================

// Tạo công thức mới
export const createRecipe = async (data: CreateRecipe) => {
  try {
    // Kiểm tra món ăn tồn tại
    const menuItem = await prisma.menu_items.findUnique({
      where: { id: data.menu_item_id }
    });

    if (!menuItem) {
      throw new Error('Món ăn không tồn tại');
    }

    // Kiểm tra công thức đã tồn tại cho món ăn này
    const existingRecipe = await prisma.recipes.findFirst({
      where: { menu_item_id: data.menu_item_id }
    });

    if (existingRecipe) {
      throw new Error('Món ăn này đã có công thức');
    }

    // Kiểm tra tất cả nguyên liệu tồn tại
    const ingredientIds = data.ingredients.map(ing => ing.inventory_item_id);
    const existingIngredients = await prisma.inventory_items.findMany({
      where: { id: { in: ingredientIds } }
    });

    if (existingIngredients.length !== ingredientIds.length) {
      throw new Error('Một số nguyên liệu không tồn tại');
    }

    // Tạo công thức và nguyên liệu
    const recipe = await prisma.recipes.create({
      data: {
        menu_item_id: data.menu_item_id,
        name: data.name,
        description: data.description,
        instructions: data.instructions,
        prep_time: data.prep_time,
        cook_time: data.cook_time,
        serving_size: data.serving_size,
        created_at: new Date(),
        updated_at: new Date(),
        ingredients: {
          create: data.ingredients.map(ingredient => ({
            inventory_item_id: ingredient.inventory_item_id,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            notes: ingredient.notes,
          }))
        }
      },
      include: {
        menu_items: {
          select: {
            id: true,
            name: true,
            price: true,
          }
        },
        ingredients: {
          include: {
            inventory_items: {
              select: {
                id: true,
                name: true,
                unit: true,
                unit_cost: true,
              }
            }
          }
        }
      }
    });

    return recipe;
  } catch (error) {
    throw new Error(`Lỗi khi tạo công thức: ${error}`);
  }
};

// Lấy công thức theo ID
export const getRecipeById = async (id: string) => {
  try {
    if (!validateUUID(id)) {
      throw new Error('ID công thức không hợp lệ');
    }

    const recipe = await prisma.recipes.findUnique({
      where: { id },
      include: {
        menu_items: {
          select: {
            id: true,
            name: true,
            price: true,
            menus: {
              select: {
                id: true,
                name: true,
                restaurants: {
                  select: {
                    id: true,
                    name: true,
                  }
                }
              }
            }
          }
        },
        ingredients: {
          include: {
            inventory_items: {
              select: {
                id: true,
                name: true,
                unit: true,
                unit_cost: true,
                quantity: true,
              }
            }
          }
        }
      }
    });

    if (!recipe) {
      throw new Error('Không tìm thấy công thức');
    }

    return recipe;
  } catch (error) {
    throw new Error(`Lỗi khi lấy thông tin công thức: ${error}`);
  }
};

// Lấy danh sách công thức
export const getRecipes = async (filters: RecipeQuery) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort_by = 'name', 
      sort_order = 'asc', 
      ...whereFilters 
    } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (whereFilters.menu_item_id) {
      where.menu_item_id = whereFilters.menu_item_id;
    }

    if (whereFilters.restaurant_id) {
      where.menu_items = {
        menus: {
          restaurant_id: whereFilters.restaurant_id
        }
      };
    }

    if (whereFilters.name) {
      where.name = {
        contains: whereFilters.name,
        mode: 'insensitive'
      };
    }

    if (whereFilters.ingredient_id) {
      where.ingredients = {
        some: {
          inventory_item_id: whereFilters.ingredient_id
        }
      };
    }

    if (whereFilters.min_prep_time || whereFilters.max_prep_time) {
      where.prep_time = {};
      if (whereFilters.min_prep_time) where.prep_time.gte = whereFilters.min_prep_time;
      if (whereFilters.max_prep_time) where.prep_time.lte = whereFilters.max_prep_time;
    }

    if (whereFilters.min_cook_time || whereFilters.max_cook_time) {
      where.cook_time = {};
      if (whereFilters.min_cook_time) where.cook_time.gte = whereFilters.min_cook_time;
      if (whereFilters.max_cook_time) where.cook_time.lte = whereFilters.max_cook_time;
    }

    const [recipes, total] = await Promise.all([
      prisma.recipes.findMany({
        where,
        include: {
          menu_items: {
            select: {
              id: true,
              name: true,
              price: true,
            }
          },
          ingredients: {
            include: {
              inventory_items: {
                select: {
                  id: true,
                  name: true,
                  unit: true,
                }
              }
            }
          }
        },
        orderBy: { [sort_by]: sort_order },
        skip,
        take: limit,
      }),
      prisma.recipes.count({ where })
    ]);

    return {
      data: recipes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw new Error(`Lỗi khi lấy danh sách công thức: ${error}`);
  }
};

// Cập nhật công thức
export const updateRecipe = async (id: string, data: UpdateRecipe) => {
  try {
    if (!validateUUID(id)) {
      throw new Error('ID công thức không hợp lệ');
    }

    const existingRecipe = await prisma.recipes.findUnique({
      where: { id }
    });

    if (!existingRecipe) {
      throw new Error('Không tìm thấy công thức');
    }

    const updatedRecipe = await prisma.recipes.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
      include: {
        menu_items: {
          select: {
            id: true,
            name: true,
            price: true,
          }
        },
        ingredients: {
          include: {
            inventory_items: {
              select: {
                id: true,
                name: true,
                unit: true,
              }
            }
          }
        }
      }
    });

    return updatedRecipe;
  } catch (error) {
    throw new Error(`Lỗi khi cập nhật công thức: ${error}`);
  }
};

// Tính chi phí công thức
export const calculateRecipeCost = async (data: RecipeCostCalculation) => {
  try {
    const { recipe_id, serving_size } = data;

    if (!validateUUID(recipe_id)) {
      throw new Error('ID công thức không hợp lệ');
    }

    const recipe = await prisma.recipes.findUnique({
      where: { id: recipe_id },
      include: {
        ingredients: {
          include: {
            inventory_items: {
              select: {
                id: true,
                name: true,
                unit: true,
                unit_cost: true,
              }
            }
          }
        }
      }
    });

    if (!recipe) {
      throw new Error('Không tìm thấy công thức');
    }

    let totalCost = 0;
    const costBreakdown = [];

    for (const ingredient of recipe.ingredients) {
      const unitCost = Number(ingredient.inventory_items.unit_cost || 0);
      const quantity = Number(ingredient.quantity);
      const ingredientCost = unitCost * quantity;
      totalCost += ingredientCost;

      costBreakdown.push({
        ingredient_name: ingredient.inventory_items.name,
        quantity: quantity,
        unit: ingredient.unit,
        unit_cost: unitCost,
        total_cost: ingredientCost,
      });
    }

    // Tính theo serving size nếu khác với recipe gốc
    const actualServingSize = serving_size || recipe.serving_size || 1;
    const recipeServingSize = recipe.serving_size || 1;
    const adjustedTotalCost = (totalCost / recipeServingSize) * actualServingSize;

    return {
      recipe_id: recipe_id,
      recipe_name: recipe.name,
      original_serving_size: recipeServingSize,
      calculated_serving_size: actualServingSize,
      total_cost: adjustedTotalCost,
      cost_per_serving: adjustedTotalCost / actualServingSize,
      cost_breakdown: costBreakdown,
    };
  } catch (error) {
    throw new Error(`Lỗi khi tính chi phí công thức: ${error}`);
  }
};

// ================================
// 📊 ANALYTICS & REPORTING
// ================================

// Thống kê tồn kho
export const getInventoryStats = async (data: InventoryStatsQuery) => {
  try {
    const { restaurant_id, date_from, date_to } = data;

    if (!validateUUID(restaurant_id)) {
      throw new Error('ID nhà hàng không hợp lệ');
    }

    const dateFilter = date_from && date_to ? {
      gte: new Date(date_from),
      lte: new Date(date_to)
    } : undefined;

    const [
      totalItems,
      lowStockItems,
      expiredItems,
      expiringSoonItems,
      totalValue,
      recentTransactions,
      topUsedIngredients
    ] = await Promise.all([
      prisma.inventory_items.count({
        where: { restaurant_id }
      }),
      prisma.inventory_items.count({
        where: {
          restaurant_id,
          AND: [
            { min_quantity: null }, 
            { quantity: { lte: 10 } }
          ]
        }
      }),
      prisma.inventory_items.count({
        where: {
          restaurant_id,
          expiry_date: { lt: new Date() }
        }
      }),
      prisma.inventory_items.count({
        where: {
          restaurant_id,
          expiry_date: {
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            gte: new Date()
          }
        }
      }),
      prisma.inventory_items.aggregate({
        where: { restaurant_id },
        _sum: {
          quantity: true,
        }
      }),
      prisma.inventory_transactions.count({
        where: {
          inventory_items: { restaurant_id },
          ...(dateFilter && { created_at: dateFilter })
        }
      }),
      prisma.inventory_transactions.groupBy({
        by: ['inventory_item_id'],
        where: {
          inventory_items: { restaurant_id },
          type: 'usage',
          ...(dateFilter && { created_at: dateFilter })
        },
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 10
      })
    ]);

    return {
      total_items: totalItems,
      low_stock_items: lowStockItems,
      expired_items: expiredItems,
      expiring_soon_items: expiringSoonItems,
      total_quantity: totalValue._sum.quantity || 0,
      recent_transactions: recentTransactions,
      low_stock_percentage: totalItems > 0 ? (lowStockItems / totalItems * 100) : 0,
      top_used_ingredients_count: topUsedIngredients.length,
    };
  } catch (error) {
    throw new Error(`Lỗi khi lấy thống kê tồn kho: ${error}`);
  }
};
