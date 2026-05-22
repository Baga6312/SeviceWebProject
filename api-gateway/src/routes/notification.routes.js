const router = require('express').Router();
const { sendNotification, getNotifications, markAsRead } = require('../controllers/notification.controller');

router.post('/', sendNotification);
router.get('/:userId', getNotifications);
router.post('/read', markAsRead);

module.exports = router;