const router = require('express').Router();
const { sendNotification, getNotifications, markAsRead } = require('../controllers/notification.controller');
const { authenticate, requireRole } = require('../middleware/auth.middleware');

router.post('/', authenticate, requireRole('ADMIN'), sendNotification);
router.get('/:userId', authenticate, getNotifications);
router.post('/read', authenticate, markAsRead);

module.exports = router;