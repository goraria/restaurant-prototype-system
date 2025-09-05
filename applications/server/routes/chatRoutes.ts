import { Router } from 'express';
import {
	createConversationController,
	getConversationController,
	getConversationsController,
	updateConversationController,
	deleteConversationController,
	createMessageController,
	getMessageController,
	getMessagesController,
	updateMessageController,
	deleteMessageController,
	markMessagesAsReadController
} from '@/controllers/chatControllers';

const router = Router();

// Conversation routes
router.post('/conversations', createConversationController);
router.get('/conversations', getConversationsController);
router.get('/conversations/:id', getConversationController);
router.put('/conversations/:id', updateConversationController);
router.delete('/conversations/:id', deleteConversationController);

// Conversation management routes
// router.post('/conversations/:id/assign-staff', assignStaffToConversationController);
// router.post('/conversations/:id/close', closeConversationController);
// router.post('/conversations/:id/resolve', resolveConversationController);

// Message routes
router.post('/messages', createMessageController);
router.get('/messages/:id', getMessageController);
router.put('/messages/:id', updateMessageController);
router.delete('/messages/:id', deleteMessageController);

// Message management routes
router.post('/messages/mark-read', markMessagesAsReadController);

// Conversation messages
router.get('/conversations/:conversation_id/messages', getMessagesController);

// Unread count routes
// router.get('/conversations/:conversation_id/unread-count', getUnreadCountController);
// router.get('/unread-count', getUserUnreadCountController);

export default router;
