import { Request, Response } from 'express';
import path from 'path';
import prisma from '@/config/prisma';

// POST /upload/avatar  (multipart/form-data, field: avatar)
// Lưu file vào /public/avatar và cập nhật users.avatar_url = /public/avatar/<filename>
export async function uploadAvatar(req: Request, res: Response) {
  try {
    const userId = (req as any).auth?.userId || req.body.user_id;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'user_id là bắt buộc' });
    }

    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file) {
      return res.status(400).json({ success: false, message: 'Thiếu file upload (avatar)' });
    }

    // Xây URL công khai
    const relativeUrl = path.posix.join('/public', 'avatar', file.filename);

    // Cập nhật DB
    await prisma.users.update({
      where: { id: userId },
      data: { avatar_url: relativeUrl, updated_at: new Date() },
    });

    return res.status(200).json({ success: true, url: relativeUrl });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Lỗi upload avatar' });
  }
}

// POST /upload/file  (multipart/form-data, field: file)
// Lưu file vào /public/files và trả về URL để client lưu vào DB (nếu cần)
export async function uploadFile(req: Request, res: Response) {
  try {
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file) {
      return res.status(400).json({ success: false, message: 'Thiếu file upload' });
    }

    const relativeUrl = path.posix.join('/public', 'files', file.filename);
    return res.status(200).json({ success: true, url: relativeUrl });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Lỗi upload file' });
  }
}

// ============ ENTITY-SPECIFIC UPLOADS ============

// POST /upload/images/categories  (field: image)
export async function uploadCategoryImage(req: Request, res: Response) {
  try {
    const { id } = req.body; // category id
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!id || !file) return res.status(400).json({ success: false, message: 'Thiếu id hoặc file' });

    const url = `/public/images/categories/${file.filename}`;
    await prisma.categories.update({ where: { id }, data: { image_url: url, updated_at: new Date() } });
    return res.status(200).json({ success: true, url });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e.message || 'Lỗi upload ảnh category' });
  }
}

// POST /upload/images/menus  (field: image)
export async function uploadMenuImage(req: Request, res: Response) {
  try {
    const { id } = req.body; // menu id
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!id || !file) return res.status(400).json({ success: false, message: 'Thiếu id hoặc file' });

    const url = `/public/images/menus/${file.filename}`;
    await prisma.menus.update({ where: { id }, data: { image_url: url, updated_at: new Date() } });
    return res.status(200).json({ success: true, url });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e.message || 'Lỗi upload ảnh menu' });
  }
}

// POST /upload/images/menu-items  (field: image)
export async function uploadMenuItemImage(req: Request, res: Response) {
  try {
    const { id } = req.body; // menu_items id
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!id || !file) return res.status(400).json({ success: false, message: 'Thiếu id hoặc file' });

    const url = `/public/images/menu-items/${file.filename}`;
    await prisma.menu_items.update({ where: { id }, data: { image_url: url, updated_at: new Date() } });
    return res.status(200).json({ success: true, url });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e.message || 'Lỗi upload ảnh menu item' });
  }
}

// POST /upload/images/restaurants/logo  (field: image)
export async function uploadRestaurantLogo(req: Request, res: Response) {
  try {
    const { id } = req.body; // restaurant id
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!id || !file) return res.status(400).json({ success: false, message: 'Thiếu id hoặc file' });

    const url = `/public/images/restaurants/logo/${file.filename}`;
    await prisma.restaurants.update({ where: { id }, data: { logo_url: url, updated_at: new Date() } });
    return res.status(200).json({ success: true, url });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e.message || 'Lỗi upload logo restaurant' });
  }
}

// POST /upload/images/restaurants/cover  (field: image)
export async function uploadRestaurantCover(req: Request, res: Response) {
  try {
    const { id } = req.body; // restaurant id
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!id || !file) return res.status(400).json({ success: false, message: 'Thiếu id hoặc file' });

    const url = `/public/images/restaurants/cover/${file.filename}`;
    await prisma.restaurants.update({ where: { id }, data: { cover_url: url, updated_at: new Date() } });
    return res.status(200).json({ success: true, url });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e.message || 'Lỗi upload cover restaurant' });
  }
}


