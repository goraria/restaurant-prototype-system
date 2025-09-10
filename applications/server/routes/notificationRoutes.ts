import express from 'express';
import * as notificationControllers from '../controllers/notificationControllers';

const router = express.Router();

/**
 * @route   POST /api/notifications
 * @desc    Create a new notification
 * @access  Protected
 */
router.post('/', notificationControllers.createNotification);

/**
 * @route   GET /api/notifications
 * @desc    Get notifications for current user with pagination and filters
 * @access  Protected
 */
router.get('/', notificationControllers.getUserNotifications);

/**
 * @route   GET /api/notifications/unread-count
 * @desc    Get unread notifications count for current user
 * @access  Protected
 */
router.get('/unread-count', notificationControllers.getUnreadCount);

/**
 * @route   GET /api/notifications/preferences
 * @desc    Get notification preferences for current user
 * @access  Protected
 */
router.get('/preferences', notificationControllers.getNotificationPreferences);

/**
 * @route   PUT /api/notifications/preferences
 * @desc    Update notification preferences for current user
 * @access  Protected
 */
router.put('/preferences', notificationControllers.updateNotificationPreferences);

/**
 * @route   PATCH /api/notifications/read-all
 * @desc    Mark all notifications as read for current user
 * @access  Protected
 */
router.patch('/read-all', notificationControllers.markAllAsRead);

/**
 * @route   POST /api/notifications/bulk
 * @desc    Bulk operations on notifications (mark read/unread, archive, delete)
 * @access  Protected
 */
router.post('/bulk', notificationControllers.bulkNotificationAction);

/**
 * @route   POST /api/notifications/broadcast
 * @desc    Broadcast notification to multiple users (Admin only)
 * @access  Protected, Admin
 */
router.post('/broadcast', notificationControllers.broadcastNotification);

/**
 * @route   GET /api/notifications/:id
 * @desc    Get notification by ID
 * @access  Protected
 */
router.get('/:id', notificationControllers.getNotificationById);

/**
 * @route   PUT /api/notifications/:id
 * @desc    Update notification
 * @access  Protected
 */
router.put('/:id', notificationControllers.updateNotification);

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete notification
 * @access  Protected
 */
router.delete('/:id', notificationControllers.deleteNotification);

/**
 * @route   PATCH /api/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Protected
 */
router.patch('/:id/read', notificationControllers.markAsRead);

// ================================
// 🔴 REALTIME NOTIFICATION ROUTES
// ================================

/**
 * @route   POST /api/notifications/realtime/join-user
 * @desc    Join user notification room for realtime updates
 * @access  Protected
 */
router.post('/realtime/join-user', notificationControllers.joinUserNotificationRoom);

/**
 * @route   POST /api/notifications/realtime/join-restaurant
 * @desc    Join restaurant notification room for realtime updates
 * @access  Protected
 */
router.post('/realtime/join-restaurant', notificationControllers.joinRestaurantNotificationRoom);

/**
 * @route   POST /api/notifications/realtime/join-organization
 * @desc    Join organization notification room for realtime updates
 * @access  Protected
 */
router.post('/realtime/join-organization', notificationControllers.joinOrganizationNotificationRoom);

/**
 * @route   GET /api/notifications/realtime/status
 * @desc    Get realtime notification connection status and info
 * @access  Protected
 */
router.get('/realtime/status', notificationControllers.getRealtimeStatus);

export default router;
