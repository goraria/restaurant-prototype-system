import { PrismaClient } from '@prisma/client';
import {
  CreateConversationInput,
  UpdateConversationInput,
  GetConversationsInput,
  CreateMessageInput,
  UpdateMessageInput,
  GetMessagesInput,
  ConversationResponse,
  MessageResponse,
  ChatListResponse,
  MessageListResponse,
} from '@/schemas/chatSchemas';

const prisma = new PrismaClient();

// ================================
// 💬 CONVERSATION FUNCTIONS
// ================================

export const createConversation = async (data: CreateConversationInput): Promise<ConversationResponse> => {
  const conversation = await prisma.conversations.create({
    data: {
      restaurant_id: data.restaurant_id,
      customer_id: data.customer_id,
      staff_id: data.staff_id,
      type: data.type,
      title: data.title,
    },
    include: {
      customers: {
        select: {
          id: true,
          full_name: true,
          avatar_url: true,
        },
      },
      staff: {
        select: {
          id: true,
          full_name: true,
          avatar_url: true,
        },
      },
    },
  });

  return {
    ...conversation,
    unread_count: 0,
  };
};

export const getConversation = async (id: string): Promise<ConversationResponse | null> => {
  const conversation = await prisma.conversations.findUnique({
    where: { id },
    include: {
      customers: {
        select: {
          id: true,
          full_name: true,
          avatar_url: true,
        },
      },
      staff: {
        select: {
          id: true,
          full_name: true,
          avatar_url: true,
        },
      },
      messages: {
        where: { is_read: false },
        select: { id: true },
      },
    },
  });

  if (!conversation) return null;

  return {
    ...conversation,
    unread_count: conversation.messages.length,
  };
};

export const getConversations = async (filters: GetConversationsInput): Promise<ChatListResponse> => {
  const { page, limit, ...where } = filters;
  const skip = (page - 1) * limit;

  const [conversations, total] = await Promise.all([
    prisma.conversations.findMany({
      where,
      include: {
        customers: {
          select: {
            id: true,
            full_name: true,
            avatar_url: true,
          },
        },
        staff: {
          select: {
            id: true,
            full_name: true,
            avatar_url: true,
          },
        },
        messages: {
          where: { is_read: false },
          select: { id: true },
        },
      },
      orderBy: { last_message_at: 'desc' },
      skip,
      take: limit,
    }),
    prisma.conversations.count({ where }),
  ]);

  const conversationsWithUnreadCount = conversations.map(conv => ({
    ...conv,
    unread_count: conv.messages.length,
  }));

  return {
    conversations: conversationsWithUnreadCount,
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    },
  };
};

export const updateConversation = async (id: string, data: UpdateConversationInput): Promise<ConversationResponse> => {
  const conversation = await prisma.conversations.update({
    where: { id },
    data,
    include: {
      customers: {
        select: {
          id: true,
          full_name: true,
          avatar_url: true,
        },
      },
      staff: {
        select: {
          id: true,
          full_name: true,
          avatar_url: true,
        },
      },
    },
  });

  return {
    ...conversation,
    unread_count: 0,
  };
};

export const deleteConversation = async (id: string): Promise<void> => {
  await prisma.conversations.delete({
    where: { id },
  });
};

// ================================
// 💬 MESSAGE FUNCTIONS
// ================================

export const createMessage = async (data: CreateMessageInput): Promise<MessageResponse> => {
  const [message, conversation] = await Promise.all([
    prisma.messages.create({
      data: {
        conversation_id: data.conversation_id,
        sender_id: data.sender_id,
        content: data.content,
        message_type: data.message_type,
        attachments: data.attachments || [],
      },
      include: {
        senders: {
          select: {
            id: true,
            full_name: true,
            avatar_url: true,
            role: true,
          },
        },
      },
    }),
    prisma.conversations.update({
      where: { id: data.conversation_id },
      data: { last_message_at: new Date() },
    }),
  ]);

  return message;
};

export const getMessage = async (id: string): Promise<MessageResponse | null> => {
  const message = await prisma.messages.findUnique({
    where: { id },
    include: {
      senders: {
        select: {
          id: true,
          full_name: true,
          avatar_url: true,
          role: true,
        },
      },
    },
  });

  return message;
};

export const getMessages = async (filters: GetMessagesInput): Promise<MessageListResponse> => {
  const { conversation_id, page, limit } = filters;
  const skip = (page - 1) * limit;

  const [messages, total] = await Promise.all([
    prisma.messages.findMany({
      where: { conversation_id },
      include: {
        senders: {
          select: {
            id: true,
            full_name: true,
            avatar_url: true,
            role: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
      skip,
      take: limit,
    }),
    prisma.messages.count({ where: { conversation_id } }),
  ]);

  return {
    messages: messages.reverse(), // Return in chronological order
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    },
  };
};

export const updateMessage = async (id: string, data: UpdateMessageInput): Promise<MessageResponse> => {
  const message = await prisma.messages.update({
    where: { id },
    data,
    include: {
      senders: {
        select: {
          id: true,
          full_name: true,
          avatar_url: true,
          role: true,
        },
      },
    },
  });

  return message;
};

export const deleteMessage = async (id: string): Promise<void> => {
  await prisma.messages.delete({
    where: { id },
  });
};

export const markMessagesAsRead = async (messageIds: string[]): Promise<void> => {
  await prisma.messages.updateMany({
    where: { id: { in: messageIds } },
    data: { is_read: true },
  });
};

// ================================
// 📊 UTILITY FUNCTIONS
// ================================

export const getUnreadCount = async (conversationId: string): Promise<number> => {
  return await prisma.messages.count({
    where: {
      conversation_id: conversationId,
      is_read: false,
    },
  });
};

export const getUnreadCountByUser = async (userId: string): Promise<number> => {
  return await prisma.messages.count({
    where: {
      conversations: {
        OR: [
          { customer_id: userId },
          { staff_id: userId },
        ],
      },
      is_read: false,
      sender_id: { not: userId },
    },
  });
};

export const userCanAccessConversation = async (userId: string, conversationId: string): Promise<boolean> => {
  const conversation = await prisma.conversations.findUnique({
    where: { id: conversationId },
    select: {
      customer_id: true,
      staff_id: true,
      restaurant_id: true,
    },
  });

  if (!conversation) return false;

  // User is customer or staff in this conversation
  if (conversation.customer_id === userId || conversation.staff_id === userId) {
    return true;
  }

  // Check if user is staff in the restaurant
  if (conversation.restaurant_id) {
    const staffMember = await prisma.restaurant_staffs.findFirst({
      where: {
        restaurant_id: conversation.restaurant_id,
        user_id: userId,
        status: 'active',
      },
    });
    return !!staffMember;
  }

  return false;
};

export const assignStaffToConversation = async (conversationId: string, staffId: string): Promise<ConversationResponse> => {
  return await updateConversation(conversationId, { staff_id: staffId });
};

export const closeConversation = async (conversationId: string): Promise<ConversationResponse> => {
  return await updateConversation(conversationId, { status: 'closed' });
};

export const resolveConversation = async (conversationId: string): Promise<ConversationResponse> => {
  return await updateConversation(conversationId, { status: 'resolved' });
};
