const redis = require('redis');
const Notification = require('../models/notificationModel')
const subscriber = redis.createClient();
const User = require('../models/userModel');
const UserNotification = require('../models/userNotifications');

subscriber.on('error', (err) => {
  console.error('Redis error:', err);
});

const handleNotification = async (message) => {
  try {
    const notification = JSON.parse(message);
    const user = await User.findByPk(notification.userId);
    await Notification.create({
      related_id: notification.related_id,
      message: `${notification.message} ${user.full_name}`,
      type: notification.type,
    });
    console.log('Received notification:', notification);
  } catch (error) {
    console.error('Error processing notification:', error);
  }
};

const handleUserNotification = async (message) => {
  try {
    const newsNotification = JSON.parse(message);
    await UserNotification.create({
      user_id: newsNotification.userId,
      content: `${newsNotification.content}`,
      type: newsNotification.type,
    })
    console.log('Received news update:', newsNotification);
  } catch (error) {
    console.error('Error processing news update:', error);
  }
};

const connectSubscriber = async () => {
  try {
    await subscriber.connect();
    await subscriber.subscribe('notifications', handleNotification);
    await subscriber.subscribe('userNotifications', handleUserNotification);
  } catch (error) {
    console.error('Failed to connect or subscribe:', error);
  }
}

connectSubscriber();

module.exports = subscriber;
