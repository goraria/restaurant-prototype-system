"use client"

import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Phone, 
  Video, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  Send,
  Star,
  Archive,
  Trash2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Types
interface User {
  id: string
  name: string
  avatar: string
  status: 'online' | 'offline' | 'away'
  lastSeen?: string
}

interface Message {
  id: string
  senderId: string
  content: string
  timestamp: Date
  type: 'text' | 'image' | 'file'
  isRead?: boolean
}

interface ChatConversation {
  id: string
  participants: User[]
  lastMessage: Message
  unreadCount: number
}

// Sample Data
const currentUser: User = {
  id: 'current-user',
  name: 'Bạn',
  avatar: '/avatars/shadcn.jpg',
  status: 'online'
}

const users: User[] = [
  {
    id: 'user-1',
    name: 'Nguyễn Văn A',
    avatar: '/avatars/suit-black.jpeg',
    status: 'online'
  },
  {
    id: 'user-2', 
    name: 'Trần Thị B',
    avatar: '/avatars/suit-colorful.jpeg',
    status: 'offline',
    lastSeen: '2 giờ trước'
  },
  {
    id: 'user-3',
    name: 'Lê Văn C',
    avatar: '/avatars/suit-gradient.jpeg',
    status: 'away'
  },
  {
    id: 'user-4',
    name: 'Phạm Thị D',
    avatar: '/avatars/suit-white.jpeg',
    status: 'online'
  }
]

const conversations: ChatConversation[] = [
  {
    id: 'conv-1',
    participants: [currentUser, users[0]],
    lastMessage: {
      id: 'msg-1',
      senderId: 'user-1',
      content: 'Chào bạn! Có khỏe không?',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      type: 'text'
    },
    unreadCount: 2
  },
  {
    id: 'conv-2',
    participants: [currentUser, users[1]],
    lastMessage: {
      id: 'msg-2',
      senderId: 'current-user',
      content: 'Cảm ơn bạn nhé!',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      type: 'text'
    },
    unreadCount: 0
  },
  {
    id: 'conv-3',
    participants: [currentUser, users[2]],
    lastMessage: {
      id: 'msg-3',
      senderId: 'user-3',
      content: 'Hẹn gặp lại sau nhé!',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'text'
    },
    unreadCount: 0
  },
  {
    id: 'conv-4',
    participants: [currentUser, users[3]],
    lastMessage: {
      id: 'msg-4',
      senderId: 'user-4',
      content: 'Bạn có rảnh không?',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      type: 'text'
    },
    unreadCount: 1
  }
]

const chatMessages: { [key: string]: Message[] } = {
  'conv-1': [
    {
      id: 'msg-1-1',
      senderId: 'user-1',
      content: 'Xin chào! Bạn có khỏe không?',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      type: 'text'
    },
    {
      id: 'msg-1-2',
      senderId: 'current-user',
      content: 'Chào bạn! Mình khỏe, cảm ơn bạn đã hỏi thăm.',
      timestamp: new Date(Date.now() - 58 * 60 * 1000),
      type: 'text'
    },
    {
      id: 'msg-1-3',
      senderId: 'user-1',
      content: 'Tuyệt quá! Hôm nay bạn có kế hoạch gì không?',
      timestamp: new Date(Date.now() - 55 * 60 * 1000),
      type: 'text'
    },
    {
      id: 'msg-1-4',
      senderId: 'current-user',
      content: 'Mình đang làm việc ở văn phòng. Còn bạn thì sao?',
      timestamp: new Date(Date.now() - 50 * 60 * 1000),
      type: 'text'
    },
    {
      id: 'msg-1-5',
      senderId: 'user-1',
      content: 'Mình cũng vậy. Chiều nay có muốn đi cà phê không?',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      type: 'text'
    },
    {
      id: 'msg-1-6',
      senderId: 'current-user',
      content: 'Được rồi! Mình rảnh sau 5 giờ chiều. Hẹn gặp bạn ở quán cũ nhé?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: 'text'
    }
  ],
  'conv-2': [
    {
      id: 'msg-2-1',
      senderId: 'user-2',
      content: 'Bạn ơi, hôm qua cảm ơn bạn đã giúp mình nhé!',
      timestamp: new Date(Date.now() - 120 * 60 * 1000),
      type: 'text'
    },
    {
      id: 'msg-2-2',
      senderId: 'current-user',
      content: 'Không có gì đâu! Chúng ta là bạn mà.',
      timestamp: new Date(Date.now() - 118 * 60 * 1000),
      type: 'text'
    },
    {
      id: 'msg-2-3',
      senderId: 'current-user',
      content: 'Cảm ơn bạn nhé! 😊',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      type: 'text'
    }
  ],
  'conv-3': [
    {
      id: 'msg-3-1',
      senderId: 'user-3',
      content: 'Project của chúng ta đã hoàn thành rồi đấy!',
      timestamp: new Date(Date.now() - 180 * 60 * 1000),
      type: 'text'
    },
    {
      id: 'msg-3-2',
      senderId: 'current-user',
      content: 'Tuyệt vời! Khi nào demo cho khách hàng?',
      timestamp: new Date(Date.now() - 175 * 60 * 1000),
      type: 'text'
    },
    {
      id: 'msg-3-3',
      senderId: 'user-3',
      content: 'Có lẽ là thứ 5 tuần sau. Mình sẽ chuẩn bị presentation.',
      timestamp: new Date(Date.now() - 170 * 60 * 1000),
      type: 'text'
    },
    {
      id: 'msg-3-4',
      senderId: 'user-3',
      content: 'Hẹn gặp lại sau nhé!',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'text'
    }
  ],
  'conv-4': [
    {
      id: 'msg-4-1',
      senderId: 'user-4',
      content: 'Bạn có rảnh không? Mình muốn hỏi về công việc.',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      type: 'text'
    }
  ]
}

// Helper Functions
const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor(diff / (1000 * 60))
  
  if (minutes < 1) return 'Vừa xong'
  if (minutes < 60) return `${minutes} phút trước`
  if (hours < 24) return `${hours} giờ trước`
  return date.toLocaleDateString('vi-VN')
}

const formatMessageTime = (date: Date) => {
  return date.toLocaleTimeString('vi-VN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// Components
const StatusIndicator = ({ status }: { status: User['status'] }) => {
  const colors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500'
  }
  
  return (
    <div className={`w-3 h-3 rounded-full ${colors[status]} border-2 border-white absolute -bottom-0.5 -right-0.5`} />
  )
}

const ConversationItem = ({ 
  conversation, 
  isActive, 
  onClick 
}: { 
  conversation: ChatConversation
  isActive: boolean
  onClick: () => void 
}) => {
  const otherUser = conversation.participants.find(p => p.id !== currentUser.id)
  
  return (
    <div
      className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
        isActive ? 'bg-blue-50 border-r-2 border-blue-500' : ''
      }`}
      onClick={onClick}
    >
      <div className="relative">
        <Avatar className="w-12 h-12">
          <AvatarImage src={otherUser?.avatar} alt={otherUser?.name} />
          <AvatarFallback>{otherUser?.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <StatusIndicator status={otherUser?.status || 'offline'} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm truncate">{otherUser?.name}</h4>
          <span className="text-xs text-gray-500">
            {formatTime(conversation.lastMessage.timestamp)}
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-gray-600 truncate">
            {conversation.lastMessage.senderId === currentUser.id ? 'Bạn: ' : ''}
            {conversation.lastMessage.content}
          </p>
          {conversation.unreadCount > 0 && (
            <Badge variant="default" className="ml-2 px-2 py-0.5 text-xs">
              {conversation.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}

const MessageBubble = ({ 
  message, 
  isOwn, 
  user 
}: { 
  message: Message
  isOwn: boolean
  user?: User 
}) => {
  return (
    <div className={`flex gap-2 mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      {!isOwn && (
        <Avatar className="w-8 h-8 mt-1">
          <AvatarImage src={user?.avatar} alt={user?.name} />
          <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-1' : 'order-2'}`}>
        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwn
              ? 'bg-blue-500 text-white rounded-br-md'
              : 'bg-gray-100 text-gray-900 rounded-bl-md'
          }`}
        >
          <p className="text-sm">{message.content}</p>
        </div>
        <div className={`flex items-center gap-2 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-gray-500">
            {formatMessageTime(message.timestamp)}
          </span>
          {isOwn && (
            <div className="flex">
              <div className="w-4 h-4 text-blue-500">
                <svg viewBox="0 0 16 16" fill="currentColor">
                  <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {isOwn && (
        <Avatar className="w-8 h-8 mt-1 order-2">
          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
          <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}

const ChatHeader = ({ user }: { user?: User }) => {
  if (!user) return null
  
  return (
    <div className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <StatusIndicator status={user.status} />
        </div>
        <div>
          <h3 className="font-medium">{user.name}</h3>
          <p className="text-sm text-gray-500">
            {user.status === 'online' ? 'Đang hoạt động' : user.lastSeen || 'Không hoạt động'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Phone className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Video className="w-4 h-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Star className="w-4 h-4 mr-2" />
              Đánh dấu quan trọng
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Archive className="w-4 h-4 mr-2" />
              Lưu trữ
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa cuộc trò chuyện
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

const MessageInput = ({ onSend }: { onSend: (message: string) => void }) => {
  const [message, setMessage] = useState('')
  
  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim())
      setMessage('')
    }
  }
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }
  
  return (
    <div className="p-4 border-t bg-white">
      <div className="flex items-end gap-2">
        <Button variant="ghost" size="icon">
          <Paperclip className="w-4 h-4" />
        </Button>
        
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            className="pr-10"
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-1 top-1/2 -translate-y-1/2"
          >
            <Smile className="w-4 h-4" />
          </Button>
        </div>
        
        <Button onClick={handleSend} disabled={!message.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

// Main Component
export const MessageApp = ({ initialConversationId }: { initialConversationId?: string }) => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    initialConversationId || 'conv-1'
  )
  const [searchQuery, setSearchQuery] = useState('')
  
  const filteredConversations = conversations.filter(conv => {
    const otherUser = conv.participants.find(p => p.id !== currentUser.id)
    return otherUser?.name.toLowerCase().includes(searchQuery.toLowerCase())
  })
  
  const currentConversation = conversations.find(conv => conv.id === selectedConversation)
  const currentMessages = selectedConversation ? chatMessages[selectedConversation] || [] : []
  const otherUser = currentConversation?.participants.find(p => p.id !== currentUser.id)
  
  const handleSendMessage = (content: string) => {
    if (!selectedConversation) return
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      content,
      timestamp: new Date(),
      type: 'text'
    }
    
    // In a real app, you would update the state/database here
    console.log('Sending message:', newMessage)
  }
  
  return (
    <div className="flex h-full bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Sidebar - Danh sách cuộc trò chuyện */}
      <div className="w-80 border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Tin nhắn</h2>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm cuộc trò chuyện..."
              className="pl-9"
            />
          </div>
        </div>
        
        {/* Conversation List */}
        <ScrollArea className="flex-1">
          <div className="divide-y">
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={selectedConversation === conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <ChatHeader user={otherUser} />
            
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-1">
                {currentMessages.map((message) => {
                  const messageUser = message.senderId === currentUser.id 
                    ? currentUser 
                    : otherUser
                  
                  return (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isOwn={message.senderId === currentUser.id}
                      user={messageUser}
                    />
                  )
                })}
              </div>
            </ScrollArea>
            
            {/* Message Input */}
            <MessageInput onSend={handleSendMessage} />
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chọn một cuộc trò chuyện
              </h3>
              <p className="text-gray-500">
                Chọn cuộc trò chuyện từ danh sách bên trái để bắt đầu nhắn tin
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageApp
