const axios = require('axios');
const io = require('socket.io-client');

// Configuration
const BASE_URL = 'http://localhost:8080';
const API_URL = `${BASE_URL}/chat`;

// Test data
const testData = {
  restaurant_id: '550e8400-e29b-41d4-a716-446655440000', // Replace with actual UUID
  customer_id: '550e8400-e29b-41d4-a716-446655440001',   // Replace with actual UUID
  staff_id: '550e8400-e29b-41d4-a716-446655440002',      // Replace with actual UUID
  token: 'your-clerk-token-here' // Replace with actual Clerk token
};

// Axios instance with auth
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${testData.token}`,
    'Content-Type': 'application/json'
  }
});

// Test functions
async function testConversations() {
  console.log('🧪 Testing Conversations API...\n');

  try {
    // 1. Create conversation
    console.log('1. Creating conversation...');
    const createResponse = await api.post('/conversations', {
      restaurant_id: testData.restaurant_id,
      customer_id: testData.customer_id,
      type: 'support',
      title: 'Test conversation'
    });
    console.log('✅ Conversation created:', createResponse.data.data.id);
    const conversationId = createResponse.data.data.id;

    // 2. Get conversations
    console.log('\n2. Getting conversations...');
    const listResponse = await api.get('/conversations');
    console.log('✅ Conversations retrieved:', listResponse.data.data.length);

    // 3. Get specific conversation
    console.log('\n3. Getting specific conversation...');
    const getResponse = await api.get(`/conversations/${conversationId}`);
    console.log('✅ Conversation retrieved:', getResponse.data.data.id);

    // 4. Update conversation
    console.log('\n4. Updating conversation...');
    const updateResponse = await api.put(`/conversations/${conversationId}`, {
      title: 'Updated test conversation'
    });
    console.log('✅ Conversation updated:', updateResponse.data.data.title);

    // 5. Assign staff
    console.log('\n5. Assigning staff...');
    const assignResponse = await api.post(`/conversations/${conversationId}/assign-staff`, {
      staff_id: testData.staff_id
    });
    console.log('✅ Staff assigned:', assignResponse.data.data.staff_id);

    return conversationId;
  } catch (error) {
    console.error('❌ Error testing conversations:', error.response?.data || error.message);
    return null;
  }
}

async function testMessages(conversationId) {
  console.log('\n🧪 Testing Messages API...\n');

  try {
    // 1. Send message
    console.log('1. Sending message...');
    const sendResponse = await api.post('/messages', {
      conversation_id: conversationId,
      content: 'Hello, this is a test message!',
      message_type: 'text'
    });
    console.log('✅ Message sent:', sendResponse.data.data.id);
    const messageId = sendResponse.data.data.id;

    // 2. Get messages
    console.log('\n2. Getting messages...');
    const messagesResponse = await api.get(`/conversations/${conversationId}/messages`);
    console.log('✅ Messages retrieved:', messagesResponse.data.data.length);

    // 3. Get specific message
    console.log('\n3. Getting specific message...');
    const getMessageResponse = await api.get(`/messages/${messageId}`);
    console.log('✅ Message retrieved:', getMessageResponse.data.data.id);

    // 4. Update message
    console.log('\n4. Updating message...');
    const updateMessageResponse = await api.put(`/messages/${messageId}`, {
      content: 'Updated test message!'
    });
    console.log('✅ Message updated:', updateMessageResponse.data.data.content);

    // 5. Mark as read
    console.log('\n5. Marking messages as read...');
    const markReadResponse = await api.post('/messages/mark-read', {
      message_ids: [messageId]
    });
    console.log('✅ Messages marked as read');

    return messageId;
  } catch (error) {
    console.error('❌ Error testing messages:', error.response?.data || error.message);
    return null;
  }
}

async function testUnreadCount(conversationId) {
  console.log('\n🧪 Testing Unread Count API...\n');

  try {
    // 1. Get unread count for conversation
    console.log('1. Getting unread count for conversation...');
    const conversationCountResponse = await api.get(`/conversations/${conversationId}/unread-count`);
    console.log('✅ Conversation unread count:', conversationCountResponse.data.data.unread_count);

    // 2. Get unread count for user
    console.log('\n2. Getting unread count for user...');
    const userCountResponse = await api.get('/unread-count');
    console.log('✅ User unread count:', userCountResponse.data.data.unread_count);

  } catch (error) {
    console.error('❌ Error testing unread count:', error.response?.data || error.message);
  }
}

async function testSocketIO(conversationId) {
  console.log('\n🧪 Testing Socket.IO...\n');

  return new Promise((resolve) => {
    // Connect to Socket.IO
    const socket = io(BASE_URL, {
      auth: {
        token: testData.token
      }
    });

    socket.on('connect', () => {
      console.log('✅ Connected to Socket.IO');
      
      // Join conversation
      socket.emit('join_conversation', {
        conversation_id: conversationId
      });
    });

    socket.on('conversation_joined', (data) => {
      console.log('✅ Joined conversation:', data.conversation_id);
      
      // Send a message
      socket.emit('send_message', {
        conversation_id: conversationId,
        content: 'Hello from Socket.IO!',
        message_type: 'text'
      });
    });

    socket.on('message_sent', (data) => {
      console.log('✅ Message sent via Socket.IO:', data.message_id);
      
      // Test typing indicator
      socket.emit('typing_start', {
        conversation_id: conversationId
      });
      
      setTimeout(() => {
        socket.emit('typing_stop', {
          conversation_id: conversationId
        });
        
        // Disconnect after testing
        setTimeout(() => {
          socket.disconnect();
          console.log('✅ Socket.IO test completed');
          resolve();
        }, 1000);
      }, 2000);
    });

    socket.on('new_message', (data) => {
      console.log('✅ New message received:', data.message.content);
    });

    socket.on('user_typing', (data) => {
      console.log('✅ User typing:', data.user.full_name, data.is_typing);
    });

    socket.on('error', (data) => {
      console.error('❌ Socket.IO error:', data.message);
    });

    socket.on('disconnect', () => {
      console.log('✅ Disconnected from Socket.IO');
    });

    // Timeout after 10 seconds
    setTimeout(() => {
      socket.disconnect();
      console.log('⏰ Socket.IO test timeout');
      resolve();
    }, 10000);
  });
}

async function cleanup(conversationId) {
  console.log('\n🧹 Cleaning up test data...\n');

  try {
    // Close conversation
    console.log('1. Closing conversation...');
    await api.post(`/conversations/${conversationId}/close`);
    console.log('✅ Conversation closed');

    // Delete conversation (if you have delete permission)
    console.log('\n2. Deleting conversation...');
    await api.delete(`/conversations/${conversationId}`);
    console.log('✅ Conversation deleted');

  } catch (error) {
    console.error('❌ Error cleaning up:', error.response?.data || error.message);
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting Chat API Tests...\n');

  try {
    // Test conversations
    const conversationId = await testConversations();
    
    if (conversationId) {
      // Test messages
      await testMessages(conversationId);
      
      // Test unread count
      await testUnreadCount(conversationId);
      
      // Test Socket.IO
      await testSocketIO(conversationId);
      
      // Cleanup
      await cleanup(conversationId);
    }

    console.log('\n🎉 All tests completed!');
  } catch (error) {
    console.error('\n💥 Test suite failed:', error);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  testConversations,
  testMessages,
  testUnreadCount,
  testSocketIO,
  cleanup,
  runTests
};
