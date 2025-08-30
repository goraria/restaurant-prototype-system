import { z } from 'zod';

// Conversation schemas
export const createConversationSchema = z.object({
  restaurant_id: z.string().uuid().optional(),
  customer_id: z.string().uuid().optional(),
  staff_id: z.string().uuid().optional(),
  type: z.enum(['support', 'feedback', 'complaint', 'inquiry']).default('support'),
  title: z.string().max(255).optional(),
});

export const updateConversationSchema = z.object({
  status: z.enum(['active', 'resolved', 'closed']).optional(),
  title: z.string().max(255).optional(),
  staff_id: z.string().uuid().optional(),
});

export const getConversationsSchema = z.object({
  restaurant_id: z.string().uuid().optional(),
  customer_id: z.string().uuid().optional(),
  staff_id: z.string().uuid().optional(),
  status: z.enum(['active', 'resolved', 'closed']).optional(),
  type: z.enum(['support', 'feedback', 'complaint', 'inquiry']).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

// Message schemas
export const createMessageSchema = z.object({
  conversation_id: z.string().uuid(),
  sender_id: z.string().uuid(),
  content: z.string().min(1).max(5000),
  message_type: z.enum(['text', 'image', 'file', 'system']).default('text'),
  attachments: z.array(z.string().url()).optional(),
});

export const updateMessageSchema = z.object({
  content: z.string().min(1).max(5000).optional(),
  is_read: z.boolean().optional(),
});

export const getMessagesSchema = z.object({
  conversation_id: z.string().uuid(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(50),
});

// Socket event schemas
export const joinConversationSchema = z.object({
  conversation_id: z.string().uuid(),
  user_id: z.string().uuid(),
});

export const sendMessageSchema = z.object({
  conversation_id: z.string().uuid(),
  content: z.string().min(1).max(5000),
  message_type: z.enum(['text', 'image', 'file', 'system']).default('text'),
  attachments: z.array(z.string().url()).optional(),
});

export const markAsReadSchema = z.object({
  conversation_id: z.string().uuid(),
  message_ids: z.array(z.string().uuid()),
});

// Response schemas
export const conversationResponseSchema = z.object({
  id: z.string().uuid(),
  restaurant_id: z.string().uuid().nullable(),
  customer_id: z.string().uuid().nullable(),
  staff_id: z.string().uuid().nullable(),
  type: z.enum(['support', 'feedback', 'complaint', 'inquiry']),
  status: z.enum(['active', 'resolved', 'closed']),
  title: z.string().nullable(),
  last_message_at: z.date().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
  customers: z.object({
    id: z.string().uuid(),
    full_name: z.string(),
    avatar_url: z.string().nullable(),
  }).nullable(),
  staff: z.object({
    id: z.string().uuid(),
    full_name: z.string(),
    avatar_url: z.string().nullable(),
  }).nullable(),
  unread_count: z.number().default(0),
});

export const messageResponseSchema = z.object({
  id: z.string().uuid(),
  conversation_id: z.string().uuid(),
  sender_id: z.string().uuid(),
  content: z.string(),
  message_type: z.enum(['text', 'image', 'file', 'system']),
  attachments: z.array(z.string()),
  is_read: z.boolean(),
  created_at: z.date(),
  senders: z.object({
    id: z.string().uuid(),
    full_name: z.string(),
    avatar_url: z.string().nullable(),
    role: z.enum(['customer', 'staff', 'manager', 'admin', 'super_admin']),
  }),
});

export const chatListResponseSchema = z.object({
  conversations: z.array(conversationResponseSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    total_pages: z.number(),
  }),
});

export const messageListResponseSchema = z.object({
  messages: z.array(messageResponseSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    total_pages: z.number(),
  }),
});

export type CreateConversationInput = z.infer<typeof createConversationSchema>;
export type UpdateConversationInput = z.infer<typeof updateConversationSchema>;
export type GetConversationsInput = z.infer<typeof getConversationsSchema>;
export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type UpdateMessageInput = z.infer<typeof updateMessageSchema>;
export type GetMessagesInput = z.infer<typeof getMessagesSchema>;
export type JoinConversationInput = z.infer<typeof joinConversationSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type MarkAsReadInput = z.infer<typeof markAsReadSchema>;
export type ConversationResponse = z.infer<typeof conversationResponseSchema>;
export type MessageResponse = z.infer<typeof messageResponseSchema>;
export type ChatListResponse = z.infer<typeof chatListResponseSchema>;
export type MessageListResponse = z.infer<typeof messageListResponseSchema>;
