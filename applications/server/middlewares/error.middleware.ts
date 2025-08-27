import { Request, Response, NextFunction } from 'express';
import { ValidationError, AuthError, NotFoundError, ForbiddenError } from '@controllers/baseControllers';

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: string[];
  stack?: string;
}

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Lỗi server nội bộ';
  let errors: string[] | undefined;

  // Validation Error
  if (error instanceof ValidationError) {
    statusCode = 400;
    message = error.message;
    errors = error.errors;
  }
  // Auth Error
  else if (error instanceof AuthError) {
    statusCode = 401;
    message = error.message;
  }
  // Not Found Error
  else if (error instanceof NotFoundError) {
    statusCode = 404;
    message = error.message;
  }
  // Forbidden Error
  else if (error instanceof ForbiddenError) {
    statusCode = 403;
    message = error.message;
  }
  // Prisma Errors
  else if (error.code === 'P2002') {
    statusCode = 409;
    message = 'Dữ liệu đã tồn tại trong hệ thống';
  }
  else if (error.code === 'P2025') {
    statusCode = 404;
    message = 'Không tìm thấy dữ liệu';
  }
  else if (error.code === 'P2003') {
    statusCode = 400;
    message = 'Không thể thực hiện do ràng buộc dữ liệu';
  }
  // JWT Errors
  else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token không hợp lệ';
  }
  else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token đã hết hạn';
  }
  // Multer Errors
  else if (error.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File quá lớn';
  }
  else if (error.code === 'LIMIT_FILE_COUNT') {
    statusCode = 400;
    message = 'Quá nhiều file';
  }
  // Other known errors
  else if (error.message) {
    message = error.message;
  }

  // Log error for debugging
  console.error('Error occurred:', {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    error: error.message,
    stack: error.stack,
    body: req.body,
    params: req.params,
    query: req.query
  });

  const response: ErrorResponse = {
    success: false,
    message,
    errors
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} không tồn tại`,
    path: req.originalUrl,
    method: req.method
  });
};
