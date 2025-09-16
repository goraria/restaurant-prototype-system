import { PrismaClient, recipes, recipe_ingredients } from '@prisma/client';
import { 
  CreateMenu, 
  UpdateMenu, 
  MenuQuery,
  CreateMenuItem, 
  UpdateMenuItem, 
  MenuItemQuery,
  BulkUpdateMenuItems,
  BulkToggleAvailability,
  FeaturedItemsQuery 
} from '@/schemas/menuSchemas';
import { validate } from 'uuid';

const prisma = new PrismaClient();

// ============================================================================
// RECIPES
// ============================================================================

export async function getAllRecipe() {
  try {
    const recipes = await prisma.recipes.findMany({
      include: {
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
        },
        menu_items: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            image_url: true,
            is_available: true,
            menus: {
              select: {
                id: true,
                name: true,
                restaurants: {
                  select: {
                    id: true,
                    name: true,
                    code: true,
                  }
                }
              }
            },
            categories: {
              select: {
                id: true,
                name: true,
                slug: true,
              }
            }
          }
        }
      }
    });

    if (!recipes) {
      throw new Error('Không tìm thấy recipe');
    }

    return {
      data: recipes,
      total: recipes.length,
      message: `Đã lấy ${recipes.length} công thức`
    };
  } catch (error) {
    throw new Error(`Lỗi khi lấy tất cả thông tin recipes: ${error}`);
  }
}

export async function getRecipeById(id: string) {
  try {
    if (!validate(id)) {
      throw new Error('ID recipe không hợp lệ');
    }

    const recipe = await prisma.recipes.findUnique({
      where: { id },
      include: {
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
        },
        menu_items: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            image_url: true,
            is_available: true,
            menus: {
              select: {
                id: true,
                name: true,
                restaurants: {
                  select: {
                    id: true,
                    name: true,
                    code: true,
                  }
                }
              }
            },
            categories: {
              select: {
                id: true,
                name: true,
                slug: true,
              }
            }
          }
        }
      }
    });

    if (!recipe) {
      throw new Error('Không tìm thấy recipe');
    }

    return recipe;
  } catch (error) {
    throw new Error(`Lỗi khi lấy thông tin recipe: ${error}`);
  }
}

export async function getRecipeByMenuItemId(id: string) {
  try {
    if (!validate(id)) {
      throw new Error('ID món ăn không hợp lệ');
    }

    const recipe = await prisma.recipes.findFirst({
      where: { menu_item_id: id },
      select: {
        id: true,
        name: true,
        description: true,
        created_at: true,
        updated_at: true,
        cook_time: true,
        instructions: true,
        prep_time: true,
        serving_size: true,
        ingredients: {
          select: {
            id: true,
            quantity: true,
            unit: true,
            notes: true,
            inventory_items: {
              select: {
                id: true,
                name: true,
                unit: true,
              }
            }
          }
        },
        // ingredients: {
        //   select: {
        //     id: true,
        //     quantity: true,
        //     unit: true,
        //     notes: true,
        //     inventory_items: {
        //       select: {
        //         id: true,
        //         name: true,
        //         unit: true,
        //       }
        //     }
        //   },
        // },
        menu_items: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            image_url: true,
            is_available: true,
            menus: {
              select: {
                id: true,
                name: true,
                restaurants: {
                  select: {
                    id: true,
                    name: true,
                    code: true,
                  }
                }
              }
            },
            categories: {
              select: {
                id: true,
                name: true,
                slug: true,
              }
            }
          }
        }
      }
    });

    return recipe;
  } catch (error) {
    throw new Error(`Lỗi khi lấy danh sách recipe: ${error}`);
  }
}

export async function getRecipeIngredients(id: string) {
  try {
    if (!validate(id)) {
      throw new Error('ID món ăn không hợp lệ');
    }

    const recipeIngredients = await prisma.recipe_ingredients.findMany({
      where: { recipe_id: id },
      include: {
        inventory_items: {
          select: {
            id: true,
            name: true,
            unit: true,
            description: true,
            unit_cost: true,
            supplier: true
          }
        },
      }
    });

    return recipeIngredients;
  } catch (error) {
    throw new Error(`Lỗi khi lấy danh sách recipe: ${error}`);
  }
}



// ============================================================================

// ================================
// 🍳 Prisma Recipe Queries với Recipe Ingredients
// ================================

// ================================
// 🔧 Utility Functions
// ================================

// ================================
// 📋 Recipe Types
// ================================

export interface RecipeWithIngredients {
  id: string;
  menu_item_id: string;
  name: string;
  description?: string;
  instructions?: string;
  prep_time?: number;
  cook_time?: number;
  servings?: number;
  difficulty_level?: string;
  created_at: Date;
  updated_at: Date;
  
  // Relationships
  ingredients: Array<{
    id: string;
    recipe_id: string;
    inventory_item_id: string;
    quantity: number;
    unit?: string;
    notes?: string;
    is_optional: boolean;
    
    // Nested relationship
    inventory_items: {
      id: string;
      name: string;
      unit?: string;
      category?: string;
      cost_per_unit?: number;
    };
  }>;
  
  menu_items: {
    id: string;
    name: string;
    description?: string;
    price: number;
    image_url?: string;
    is_available: boolean;
    categories?: {
      id: string;
      name: string;
      slug?: string;
    };
  };
}

// ================================
// 🔍 Recipe Queries
// ================================

/**
 * Lấy recipe theo menu item ID với đầy đủ thông tin ingredients
 */
// export async function getRecipeByMenuItemId(id: string): Promise<RecipeWithIngredients | null> {
//   try {
//     // Validate input
//     if (!validate(id)) {
//       throw new Error('ID món ăn không hợp lệ');
//     }

//     const recipe = await prisma.recipes.findFirst({
//       where: { 
//         menu_item_id: id,
//         // Có thể thêm điều kiện khác nếu cần
//         // is_active: true
//       },
//       include: {
//         // Include recipe_ingredients với inventory_items
//         ingredients: {
//           include: {
//             inventory_items: {
//               select: {
//                 id: true,
//                 name: true,
//                 unit: true,
//                 category: true,
//                 cost_per_unit: true,
//                 supplier: true,
//                 // Thêm các field khác nếu cần
//               }
//             }
//           },
//           // Sắp xếp ingredients theo thứ tự
//           orderBy: {
//             created_at: 'asc'
//           }
//         },
        
//         // Include menu item với category
//         menu_items: {
//           select: {
//             id: true,
//             name: true,
//             description: true,
//             price: true,
//             image_url: true,
//             is_available: true,
//             preparation_time: true,
//             calories: true,
//             is_vegetarian: true,
//             is_vegan: true,
//             is_spicy: true,
            
//             // Include category nếu có relationship
//             categories: {
//               select: {
//                 id: true,
//                 name: true,
//                 slug: true,
//                 description: true,
//               }
//             }
//           }
//         }
//       }
//     });

//     return recipe;
    
//   } catch (error) {
//     console.error('Error in getRecipeByMenuItemId:', error);
//     throw new Error(`Lỗi khi lấy recipe: ${error instanceof Error ? error.message : 'Unknown error'}`);
//   }
// }

/**
 * Lấy tất cả recipes với ingredients
//  */
// export async function getAllRecipesWithIngredients(filters?: {
//   restaurant_id?: string;
//   difficulty_level?: string;
//   max_prep_time?: number;
//   is_vegetarian?: boolean;
//   limit?: number;
//   offset?: number;
// }) {
//   try {
//     const whereClause: any = {};
    
//     // Build where clause từ filters
//     if (filters?.restaurant_id) {
//       whereClause.menu_items = {
//         menus: {
//           restaurant_id: filters.restaurant_id
//         }
//       };
//     }
    
//     if (filters?.difficulty_level) {
//       whereClause.difficulty_level = filters.difficulty_level;
//     }
    
//     if (filters?.max_prep_time) {
//       whereClause.prep_time = {
//         lte: filters.max_prep_time
//       };
//     }
    
//     if (filters?.is_vegetarian !== undefined) {
//       whereClause.menu_items = {
//         ...whereClause.menu_items,
//         is_vegetarian: filters.is_vegetarian
//       };
//     }

//     const recipes = await prisma.recipes.findMany({
//       where: whereClause,
//       include: {
//         ingredients: {
//           include: {
//             inventory_items: {
//               select: {
//                 id: true,
//                 name: true,
//                 unit: true,
//                 category: true,
//                 cost_per_unit: true,
//               }
//             }
//           },
//           orderBy: {
//             created_at: 'asc'
//           }
//         },
//         menu_items: {
//           select: {
//             id: true,
//             name: true,
//             price: true,
//             image_url: true,
//             is_available: true,
//           }
//         }
//       },
//       orderBy: {
//         created_at: 'desc'
//       },
//       take: filters?.limit || 50,
//       skip: filters?.offset || 0,
//     });

//     return recipes;
    
//   } catch (error) {
//     console.error('Error in getAllRecipesWithIngredients:', error);
//     throw new Error(`Lỗi khi lấy danh sách recipes: ${error instanceof Error ? error.message : 'Unknown error'}`);
//   }
// }

/**
 * Lấy recipe theo ID với thông tin chi tiết
 */
// export async function getRecipeById(recipeId: string): Promise<RecipeWithIngredients | null> {
//   try {
//     if (!validate(recipeId)) {
//       throw new Error('ID recipe không hợp lệ');
//     }

//     const recipe = await prisma.recipes.findUnique({
//       where: { id: recipeId },
//       include: {
//         ingredients: {
//           include: {
//             inventory_items: {
//               select: {
//                 id: true,
//                 name: true,
//                 unit: true,
//                 category: true,
//                 cost_per_unit: true,
//                 quantity: true, // Số lượng tồn kho
//                 min_quantity: true,
//                 supplier: true,
//               }
//             }
//           },
//           orderBy: [
//             { is_optional: 'asc' }, // Nguyên liệu bắt buộc trước
//             { created_at: 'asc' }
//           ]
//         },
//         menu_items: {
//           select: {
//             id: true,
//             name: true,
//             description: true,
//             price: true,
//             image_url: true,
//             is_available: true,
//             preparation_time: true,
//             calories: true,
//             allergens: true,
//             is_vegetarian: true,
//             is_vegan: true,
//             is_spicy: true,
//             categories: {
//               select: {
//                 id: true,
//                 name: true,
//                 slug: true,
//               }
//             }
//           }
//         }
//       }
//     });

//     return recipe;
    
//   } catch (error) {
//     console.error('Error in getRecipeById:', error);
//     throw new Error(`Lỗi khi lấy recipe: ${error instanceof Error ? error.message : 'Unknown error'}`);
//   }
// }

/**
 * Tính tổng chi phí nguyên liệu của recipe
 */
// export async function calculateRecipeCost(recipeId: string): Promise<{
//   totalCost: number;
//   breakdown: Array<{
//     ingredient_name: string;
//     quantity: number;
//     unit: string;
//     cost_per_unit: number;
//     total_cost: number;
//   }>;
// }> {
//   try {
//     const recipe = await prisma.recipes.findUnique({
//       where: { id: recipeId },
//       include: {
//         ingredients: {
//           include: {
//             inventory_items: {
//               select: {
//                 name: true,
//                 unit: true,
//                 unit_cost: true,
//               }
//             }
//           }
//         }
//       }
//     });

//     if (!recipe) {
//       throw new Error('Không tìm thấy recipe');
//     }

//     const breakdown = recipe.ingredients.map(ingredient => {
//       const costPerUnit = ingredient.inventory_items.unit_cost || 0;
//       const totalCost = ingredient.quantity * costPerUnit;
      
//       return {
//         ingredient_name: ingredient.inventory_items.name,
//         quantity: ingredient.quantity,
//         unit: ingredient.unit || ingredient.inventory_items.unit || 'unit',
//         cost_per_unit: costPerUnit,
//         total_cost: totalCost
//       };
//     });

//     const totalCost = breakdown.reduce((sum, item) => sum + item.total_cost, 0);

//     return {
//       totalCost,
//       breakdown
//     };
    
//   } catch (error) {
//     console.error('Error in calculateRecipeCost:', error);
//     throw new Error(`Lỗi khi tính chi phí recipe: ${error instanceof Error ? error.message : 'Unknown error'}`);
//   }
// }

/**
 * Kiểm tra tính khả dụng của recipe (dựa trên tồn kho)
 */
// export async function checkRecipeAvailability(recipeId: string): Promise<{
//   isAvailable: boolean;
//   missingIngredients: Array<{
//     name: string;
//     required: number;
//     available: number;
//     unit: string;
//   }>;
// }> {
//   try {
//     const recipe = await prisma.recipes.findUnique({
//       where: { id: recipeId },
//       include: {
//         ingredients: {
//           where: {
//             is_optional: false // Chỉ check nguyên liệu bắt buộc
//           },
//           include: {
//             inventory_items: {
//               select: {
//                 name: true,
//                 unit: true,
//                 quantity: true,
//               }
//             }
//           }
//         }
//       }
//     });

//     if (!recipe) {
//       throw new Error('Không tìm thấy recipe');
//     }

//     const missingIngredients = recipe.ingredients
//       .filter(ingredient => {
//         const available = ingredient.inventory_items.quantity || 0;
//         return available < ingredient.quantity;
//       })
//       .map(ingredient => ({
//         name: ingredient.inventory_items.name,
//         required: ingredient.quantity,
//         available: ingredient.inventory_items.quantity || 0,
//         unit: ingredient.unit || ingredient.inventory_items.unit || 'unit'
//       }));

//     return {
//       isAvailable: missingIngredients.length === 0,
//       missingIngredients
//     };
    
//   } catch (error) {
//     console.error('Error in checkRecipeAvailability:', error);
//     throw new Error(`Lỗi khi kiểm tra tính khả dụng: ${error instanceof Error ? error.message : 'Unknown error'}`);
//   }
// }

/**
 * Tìm kiếm recipes theo nguyên liệu
 */
export async function searchRecipesByIngredient(ingredientName: string) {
  try {
    const recipes = await prisma.recipes.findMany({
      where: {
        ingredients: {
          some: {
            inventory_items: {
              name: {
                contains: ingredientName,
                mode: 'insensitive'
              }
            }
          }
        }
      },
      include: {
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
        },
        menu_items: {
          select: {
            id: true,
            name: true,
            price: true,
            image_url: true,
          }
        }
      }
    });

    return recipes;
    
  } catch (error) {
    console.error('Error in searchRecipesByIngredient:', error);
    throw new Error(`Lỗi khi tìm kiếm recipes: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ================================
// 📝 CRUD Operations cho Recipe Ingredients
// ================================

/**
 * Thêm nguyên liệu vào recipe
 */
// export async function addIngredientToRecipe(data: {
//   recipe_id: string;
//   inventory_item_id: string;
//   quantity: number;
//   unit?: string;
//   notes?: string;
//   is_optional?: boolean;
// }) {
//   try {
//     const ingredient = await prisma.recipe_ingredients.create({
//       data: {
//         ...data,
//         is_optional: data.is_optional || false
//       },
//       include: {
//         inventory_items: {
//           select: {
//             id: true,
//             name: true,
//             unit: true,
//             unit_cost: true,
//           }
//         }
//       }
//     });

//     return ingredient;
    
//   } catch (error) {
//     console.error('Error in addIngredientToRecipe:', error);
//     throw new Error(`Lỗi khi thêm nguyên liệu: ${error instanceof Error ? error.message : 'Unknown error'}`);
//   }
// }

/**
 * Cập nhật nguyên liệu trong recipe
 */
export async function updateRecipeIngredient(
  ingredientId: string,
  data: {
    quantity?: number;
    unit?: string;
    notes?: string;
    is_optional?: boolean;
  }
) {
  try {
    const ingredient = await prisma.recipe_ingredients.update({
      where: { id: ingredientId },
      data,
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
    });

    return ingredient;
    
  } catch (error) {
    console.error('Error in updateRecipeIngredient:', error);
    throw new Error(`Lỗi khi cập nhật nguyên liệu: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Xóa nguyên liệu khỏi recipe
 */
export async function removeIngredientFromRecipe(ingredientId: string) {
  try {
    await prisma.recipe_ingredients.delete({
      where: { id: ingredientId }
    });

    return { success: true, message: 'Đã xóa nguyên liệu khỏi recipe' };
    
  } catch (error) {
    console.error('Error in removeIngredientFromRecipe:', error);
    throw new Error(`Lỗi khi xóa nguyên liệu: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ================================
// 🏗️ Export Functions
// ================================