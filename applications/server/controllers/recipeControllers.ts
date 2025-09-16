import { Request, Response } from 'express';
import {
  getRecipeByMenuItemId as getRecipeByMenuItemIdService
} from "@/services/recipeServices"

// ============================================================================
// RECIPES CONTROLLERS
// ============================================================================

export async function getRecipeByMenuItemId(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID menu item là bắt buộc'
      });
    }

    const recipe = await getRecipeByMenuItemIdService(id);

    res.status(200).json({
      success: true,
      message: 'Lấy thông tin recipe thành công',
      data: recipe
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Lỗi khi lấy thông tin recipe';

    if (errorMessage.includes('không tìm thấy') || errorMessage.includes('không hợp lệ')) {
      return res.status(404).json({
        success: false,
        message: errorMessage
      });
    }

    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
}
