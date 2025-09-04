import jwt from 'jsonwebtoken';
import { environmentConfig } from './environment';

/**
 * JWT Authentication Configuration
 * Centralizes JWT token configuration and utilities
 */

export interface JWTConfig {
  secret: string;
  refreshSecret: string;
  issuer: string;
  audience: string;
  accessTokenExpiry: string | number;
  refreshTokenExpiry: string | number;
  algorithm: jwt.Algorithm;
}

// JWT Configuration
export const jwtConfig: JWTConfig = {
  secret: environmentConfig.JWT_SECRET,
  refreshSecret: environmentConfig.JWT_REFRESH_SECRET,
  issuer: 'eindrucksvoll-lieblings-haustier',
  audience: 'eindrucksvoll-lieblings-haustier-users',
  accessTokenExpiry: '15m', // 15 minutes
  refreshTokenExpiry: '7d', // 7 days
  algorithm: 'HS256',
};

// Token signing options
export const accessTokenOptions: jwt.SignOptions = {
  issuer: jwtConfig.issuer,
  audience: jwtConfig.audience,
  expiresIn: jwtConfig.accessTokenExpiry as any,
  algorithm: jwtConfig.algorithm,
};

export const refreshTokenOptions: jwt.SignOptions = {
  issuer: jwtConfig.issuer,
  audience: jwtConfig.audience,
  expiresIn: jwtConfig.refreshTokenExpiry as any,
  algorithm: jwtConfig.algorithm,
};

// Token verification options
export const verifyOptions: jwt.VerifyOptions = {
  issuer: jwtConfig.issuer,
  audience: jwtConfig.audience,
  algorithms: [jwtConfig.algorithm],
};

// JWT Utility Functions
export class JWTService {
  /**
   * Generate access token
   */
  static generateAccessToken(payload: object): string {
    return jwt.sign(payload, jwtConfig.secret, accessTokenOptions);
  }

  /**
   * Generate refresh token
   */
  static generateRefreshToken(payload: object): string {
    return jwt.sign(payload, jwtConfig.refreshSecret, refreshTokenOptions);
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token: string): any {
    try {
      return jwt.verify(token, jwtConfig.secret, verifyOptions);
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, jwtConfig.refreshSecret, {
        ...verifyOptions,
        // Refresh tokens might have different expiry handling
      });
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Decode token without verification (for inspection)
   */
  static decodeToken(token: string): any {
    return jwt.decode(token);
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) return null;
    
    if (authHeader.startsWith('Bearer ')) {
      return authHeader.slice(7).trim();
    }
    
    return authHeader;
  }

  /**
   * Generate token pair (access + refresh)
   */
  static generateTokenPair(payload: object): { accessToken: string; refreshToken: string } {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken(token) as any;
      if (!decoded || !decoded.exp) return true;
      
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  }

  /**
   * Get token expiry date
   */
  static getTokenExpiry(token: string): Date | null {
    try {
      const decoded = this.decodeToken(token) as any;
      if (!decoded || !decoded.exp) return null;
      
      return new Date(decoded.exp * 1000);
    } catch {
      return null;
    }
  }
}

// Socket.IO Authentication Configuration
export const socketAuthConfig = {
  timeout: 5000, // 5 seconds
  maxRetries: 3,
  allowAnonymous: false,
  
  // Token extraction from socket handshake
  extractToken: (socket: any): string | null => {
    return socket.handshake.auth.token || 
           socket.handshake.headers.authorization ||
           socket.handshake.query.token ||
           null;
  },
};

// Role-based access control
export const roles = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
  CUSTOMER: 'customer',
  GUEST: 'guest',
} as const;

export type UserRole = typeof roles[keyof typeof roles];

// Permission configuration
export const permissions = {
  // User management
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  
  // Order management
  ORDER_CREATE: 'order:create',
  ORDER_READ: 'order:read',
  ORDER_UPDATE: 'order:update',
  ORDER_DELETE: 'order:delete',
  
  // Product management
  PRODUCT_CREATE: 'product:create',
  PRODUCT_READ: 'product:read',
  PRODUCT_UPDATE: 'product:update',
  PRODUCT_DELETE: 'product:delete',
  
  // Payment management
  PAYMENT_CREATE: 'payment:create',
  PAYMENT_READ: 'payment:read',
  PAYMENT_UPDATE: 'payment:update',
  PAYMENT_REFUND: 'payment:refund',
  
  // Chat management
  CHAT_READ: 'chat:read',
  CHAT_WRITE: 'chat:write',
  CHAT_MODERATE: 'chat:moderate',
} as const;

// Role-permission mapping
export const rolePermissions: Record<UserRole, string[]> = {
  [roles.SUPER_ADMIN]: Object.values(permissions),
  [roles.ADMIN]: [
    permissions.USER_READ, permissions.USER_UPDATE,
    permissions.ORDER_READ, permissions.ORDER_UPDATE,
    permissions.PRODUCT_CREATE, permissions.PRODUCT_READ, permissions.PRODUCT_UPDATE,
    permissions.PAYMENT_READ, permissions.PAYMENT_UPDATE,
    permissions.CHAT_READ, permissions.CHAT_WRITE, permissions.CHAT_MODERATE,
  ],
  [roles.MANAGER]: [
    permissions.ORDER_READ, permissions.ORDER_UPDATE,
    permissions.PRODUCT_READ, permissions.PRODUCT_UPDATE,
    permissions.PAYMENT_READ,
    permissions.CHAT_READ, permissions.CHAT_WRITE,
  ],
  [roles.STAFF]: [
    permissions.ORDER_READ,
    permissions.PRODUCT_READ,
    permissions.CHAT_READ, permissions.CHAT_WRITE,
  ],
  [roles.CUSTOMER]: [
    permissions.ORDER_CREATE, permissions.ORDER_READ,
    permissions.PRODUCT_READ,
    permissions.PAYMENT_CREATE,
    permissions.CHAT_READ, permissions.CHAT_WRITE,
  ],
  [roles.GUEST]: [
    permissions.PRODUCT_READ,
  ],
};

// Export the complete authentication configuration
export const authConfig = {
  jwt: jwtConfig,
  socket: socketAuthConfig,
  roles,
  permissions,
  rolePermissions,
};

export default authConfig;
