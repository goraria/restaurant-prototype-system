import { Request, Response } from 'express';
import { z, ZodError } from 'zod';
import { AuthenticatedRequest } from '@/types/auth';
import { 
  createValidationError, 
  createNotFoundError, 
  createAuthError, 
  createForbiddenError,
  sendSuccess, 
  sendPaginatedSuccess, 
  asyncHandler, 
  validateBody, 
  validateQuery, 
  validateIdParam, 
  getCurrentUserId 
} from './baseControllers';
import {
  createConversationSchema,
  updateConversationSchema,
  getConversationsSchema,
  createMessageSchema,
  updateMessageSchema,
  getMessagesSchema,
} from '@/schemas/chatSchemas';
import {
  createConversation,
  getConversation,
  getConversations,
  updateConversation,
  deleteConversation,
  createMessage,
  getMessage,
  getMessages,
  updateMessage,
  deleteMessage,
  markMessagesAsRead,
  userCanAccessConversation
} from '@/services/chatService';

// Universal error handler function
const handleError = (error: any, res: Response) => {
  console.error('Chat Controller Error:', error);

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: error.message,
      errors: (error as any).errors
    });
  }

  if (error.name === 'NotFoundError') {
    return res.status(404).json({
      success: false,
      message: error.message
    });
  }

  if (error.name === 'AuthError') {
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }

  if (error instanceof ZodError) {
    const errors = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`);
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors
    });
  }

  // Default server error
  return res.status(500).json({
    success: false,
    message: 'Lỗi server không xác định'
  });
};

// ================================
// 💬 CHAT CONTROLLERS
// ================================

/**
 * Tạo cuộc trò chuyện mới
 */
export const createConversationController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedData = validateBody(req, createConversationSchema) as any;
    const userId = getCurrentUserId(req);
    
    const result = await createConversation({
      ...validatedData,
      created_by: userId
    });

    sendSuccess(res, result, 'Tạo cuộc trò chuyện thành công', 201);
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Lấy thông tin cuộc trò chuyện theo ID
 */
export const getConversationController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = validateIdParam(req);
    const userId = getCurrentUserId(req);
    
    // Kiểm tra quyền truy cập
    const canAccess = await userCanAccessConversation(userId, id);
    if (!canAccess) {
      throw createForbiddenError('Không có quyền truy cập cuộc trò chuyện này');
    }

    const result = await getConversation(id);

    if (!result) {
      throw createNotFoundError('Không tìm thấy cuộc trò chuyện');
    }

    sendSuccess(res, result);
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Lấy danh sách cuộc trò chuyện
 */
export const getConversationsController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedQuery = validateQuery(req, getConversationsSchema) as any;
    const userId = getCurrentUserId(req);
    
    const result = await getConversations({
      ...validatedQuery,
      user_id: userId
    });

    sendPaginatedSuccess(res, result.conversations || [], result.pagination);
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Cập nhật cuộc trò chuyện
 */
export const updateConversationController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = validateIdParam(req);
    const validatedData = validateBody(req, updateConversationSchema) as any;
    const userId = getCurrentUserId(req);
    
    // Kiểm tra quyền truy cập
    const canAccess = await userCanAccessConversation(userId, id);
    if (!canAccess) {
      throw createForbiddenError('Không có quyền truy cập cuộc trò chuyện này');
    }

    const result = await updateConversation(id, validatedData);

    sendSuccess(res, result, 'Cập nhật cuộc trò chuyện thành công');
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Xóa cuộc trò chuyện
 */
export const deleteConversationController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = validateIdParam(req);
    const userId = getCurrentUserId(req);
    
    // Kiểm tra quyền truy cập
    const canAccess = await userCanAccessConversation(userId, id);
    if (!canAccess) {
      throw createForbiddenError('Không có quyền truy cập cuộc trò chuyện này');
    }

    await deleteConversation(id);

    sendSuccess(res, null, 'Xóa cuộc trò chuyện thành công');
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Tạo tin nhắn mới
 */
export const createMessageController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedData = validateBody(req, createMessageSchema) as any;
    const userId = getCurrentUserId(req);
    
    // Kiểm tra quyền truy cập cuộc trò chuyện
    const canAccess = await userCanAccessConversation(userId, validatedData.conversation_id);
    if (!canAccess) {
      throw createForbiddenError('Không có quyền truy cập cuộc trò chuyện này');
    }

    const result = await createMessage({
      ...validatedData,
      sender_id: userId
    });

    sendSuccess(res, result, 'Gửi tin nhắn thành công', 201);
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Lấy thông tin tin nhắn theo ID
 */
export const getMessageController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = validateIdParam(req);
    const userId = getCurrentUserId(req);
    
    const result = await getMessage(id);

    if (!result) {
      throw createNotFoundError('Không tìm thấy tin nhắn');
    }

    // Kiểm tra quyền truy cập cuộc trò chuyện
    const canAccess = await userCanAccessConversation(userId, result.conversation_id);
    if (!canAccess) {
      throw createForbiddenError('Không có quyền truy cập tin nhắn này');
    }

    sendSuccess(res, result);
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Lấy danh sách tin nhắn
 */
export const getMessagesController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedQuery = validateQuery(req, getMessagesSchema) as any;
    const userId = getCurrentUserId(req);
    
    // Kiểm tra quyền truy cập cuộc trò chuyện
    const canAccess = await userCanAccessConversation(userId, validatedQuery.conversation_id);
    if (!canAccess) {
      throw createForbiddenError('Không có quyền truy cập cuộc trò chuyện này');
    }

    const result = await getMessages(validatedQuery);

    sendPaginatedSuccess(res, result.messages || [], result.pagination);
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Cập nhật tin nhắn
 */
export const updateMessageController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = validateIdParam(req);
    const validatedData = validateBody(req, updateMessageSchema) as any;
    const userId = getCurrentUserId(req);
    
    const result = await updateMessage(id, validatedData);

    if (!result) {
      throw createNotFoundError('Không tìm thấy tin nhắn');
    }

    // Kiểm tra quyền truy cập cuộc trò chuyện
    const canAccess = await userCanAccessConversation(userId, result.conversation_id);
    if (!canAccess) {
      throw createForbiddenError('Không có quyền truy cập tin nhắn này');
    }

    // Chỉ cho phép người gửi cập nhật tin nhắn của mình
    if (result.sender_id !== userId) {
      throw createForbiddenError('Chỉ có thể cập nhật tin nhắn của mình');
    }

    sendSuccess(res, result, 'Cập nhật tin nhắn thành công');
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Xóa tin nhắn
 */
export const deleteMessageController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = validateIdParam(req);
    const userId = getCurrentUserId(req);
    
    // Lấy thông tin tin nhắn trước khi xóa để kiểm tra quyền
    const message = await getMessage(id);
    if (!message) {
      throw createNotFoundError('Không tìm thấy tin nhắn');
    }

    // Kiểm tra quyền truy cập cuộc trò chuyện
    const canAccess = await userCanAccessConversation(userId, message.conversation_id);
    if (!canAccess) {
      throw createForbiddenError('Không có quyền truy cập tin nhắn này');
    }

    // Chỉ cho phép người gửi xóa tin nhắn của mình
    if (message.sender_id !== userId) {
      throw createForbiddenError('Chỉ có thể xóa tin nhắn của mình');
    }

    await deleteMessage(id);

    sendSuccess(res, null, 'Xóa tin nhắn thành công');
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * Đánh dấu tin nhắn đã đọc
 */
export const markMessagesAsReadController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedData = validateBody(req, z.object({
      conversation_id: z.string().uuid(),
      message_ids: z.array(z.string().uuid()).optional()
    })) as any;
    const userId = getCurrentUserId(req);
    
    // Kiểm tra quyền truy cập cuộc trò chuyện
    const canAccess = await userCanAccessConversation(userId, validatedData.conversation_id);
    if (!canAccess) {
      throw createForbiddenError('Không có quyền truy cập cuộc trò chuyện này');
    }

    await markMessagesAsRead(validatedData.message_ids || []);

    sendSuccess(res, null, 'Đánh dấu tin nhắn đã đọc thành công');
  } catch (error) {
    handleError(error, res);
  }
});
