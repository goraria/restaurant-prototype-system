import { Router } from 'express';
import multer from 'multer';
import { 
  uploadFileController, 
  uploadFilesController, 
  deleteFileController, 
  listFilesController, 
  getFileInfoController, 
  healthCheckController 
} from '@/controllers/uploadController';

const router = Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types for now, validation happens in service
    cb(null, true);
  }
});

/**
 * @route POST /upload
 * @desc Upload single file
 * @access Public
 */
router.post('/', upload.single('file'), uploadFileController);

/**
 * @route POST /upload/multiple
 * @desc Upload multiple files
 * @access Public
 */
router.post('/multiple', upload.array('files', 10), uploadFilesController);

/**
 * @route DELETE /upload/:path
 * @desc Delete file by path
 * @access Public
 */
router.delete('/:path', deleteFileController);

/**
 * @route GET /upload/list
 * @desc List files in folder
 * @access Public
 */
router.get('/list', listFilesController);

/**
 * @route GET /upload/info/:path
 * @desc Get file info by path
 * @access Public
 */
router.get('/info/:path', getFileInfoController);

/**
 * @route GET /upload/health
 * @desc Health check
 * @access Public
 */
router.get('/health', healthCheckController);

export default router;

// import { Router } from 'express';
// import path from 'path';
// import fs from 'fs';
// import multer from 'multer';
// import { uploadAvatar, uploadFile, uploadCategoryImage, uploadMenuImage, uploadMenuItemImage, uploadRestaurantLogo, uploadRestaurantCover } from '@/controllers/uploadControllers';

// const router = Router();

// // Tạo storage riêng cho avatar và files để vào thư mục con
// const PUBLIC_DIR = path.resolve(__dirname, '..', 'public');
// const IMAGES_DIR = path.resolve(PUBLIC_DIR, 'images');
// const FILES_DIR = path.resolve(PUBLIC_DIR, 'file');
// const AVATAR_DIR = path.resolve(PUBLIC_DIR, 'avatar');
// const CATEGORIES_DIR = path.resolve(IMAGES_DIR, 'categories');
// const MENUS_DIR = path.resolve(IMAGES_DIR, 'menus');
// const MENU_ITEMS_DIR = path.resolve(IMAGES_DIR, 'menu-items');
// const REST_LOGO_DIR = path.resolve(IMAGES_DIR, 'restaurants', 'logo');
// const REST_COVER_DIR = path.resolve(IMAGES_DIR, 'restaurants', 'cover');

// [PUBLIC_DIR, IMAGES_DIR, FILES_DIR, AVATAR_DIR, CATEGORIES_DIR, MENUS_DIR, MENU_ITEMS_DIR, REST_LOGO_DIR, REST_COVER_DIR].forEach((dir) => {
//   if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
// });

// function safeName(originalname: string) {
//   const safeBase = path.basename(originalname).replace(/[^a-zA-Z0-9._-]/g, '_');
//   const ext = path.extname(safeBase);
//   const name = path.basename(safeBase, ext);
//   return `${name}_${Date.now()}_${Math.random().toString(36).slice(2,8)}${ext}`;
// }

// const avatarStorage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, AVATAR_DIR),
//   filename: (req, file, cb) => cb(null, safeName(file.originalname))
// });

// const filesStorage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, FILES_DIR),
//   filename: (req, file, cb) => cb(null, safeName(file.originalname))
// });

// const imageOnly = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
//   if (!file.mimetype || !file.mimetype.startsWith('image/')) return cb(new Error('Chỉ hỗ trợ file ảnh'));
//   cb(null, true);
// };

// const uploadAvatarMw = multer({ storage: avatarStorage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: imageOnly });
// const uploadFileMw = multer({ storage: filesStorage, limits: { fileSize: 20 * 1024 * 1024 } });

// const categoriesStorage = multer.diskStorage({ destination: (req, file, cb) => cb(null, CATEGORIES_DIR), filename: (req, file, cb) => cb(null, safeName(file.originalname)) });
// const menusStorage = multer.diskStorage({ destination: (req, file, cb) => cb(null, MENUS_DIR), filename: (req, file, cb) => cb(null, safeName(file.originalname)) });
// const menuItemsStorage = multer.diskStorage({ destination: (req, file, cb) => cb(null, MENU_ITEMS_DIR), filename: (req, file, cb) => cb(null, safeName(file.originalname)) });
// const restLogoStorage = multer.diskStorage({ destination: (req, file, cb) => cb(null, REST_LOGO_DIR), filename: (req, file, cb) => cb(null, safeName(file.originalname)) });
// const restCoverStorage = multer.diskStorage({ destination: (req, file, cb) => cb(null, REST_COVER_DIR), filename: (req, file, cb) => cb(null, safeName(file.originalname)) });

// const uploadCategoryImageMw = multer({ storage: categoriesStorage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: imageOnly });
// const uploadMenuImageMw = multer({ storage: menusStorage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: imageOnly });
// const uploadMenuItemImageMw = multer({ storage: menuItemsStorage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: imageOnly });
// const uploadRestaurantLogoMw = multer({ storage: restLogoStorage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: imageOnly });
// const uploadRestaurantCoverMw = multer({ storage: restCoverStorage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: imageOnly });

// router.post('/avatar', uploadAvatarMw.single('avatar'), uploadAvatar);
// router.post('/file', uploadFileMw.single('file'), uploadFile);

// // Entity-specific image uploads
// router.post('/images/categories', uploadCategoryImageMw.single('image'), uploadCategoryImage);
// router.post('/images/menus', uploadMenuImageMw.single('image'), uploadMenuImage);
// router.post('/images/menu-items', uploadMenuItemImageMw.single('image'), uploadMenuItemImage);
// router.post('/images/restaurants/logo', uploadRestaurantLogoMw.single('image'), uploadRestaurantLogo);
// router.post('/images/restaurants/cover', uploadRestaurantCoverMw.single('image'), uploadRestaurantCover);

// export default router;


