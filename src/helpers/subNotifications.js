const redis = require('redis');
const Notification = require('../models/notificationModel')
const subscriber = redis.createClient();

subscriber.on('error', (err) => {
  console.error('Redis error:', err);
});

const connectSubscriber = async() => {
  try {
    await subscriber.connect();
    await subscriber.subscribe('notifications', async(message) => {
      try {
        const notification = JSON.parse(message);
        // Xử lý thông báo lưu vào database
        await Notification.create({
          related_id: notification.related_id,
          message: notification.message,
          type: notification.type,
        })
        console.log('Received notification:', notification);
      } catch (error) {
        console.error('Error processing notification:', error);
      }
    });
  } catch (error) {
    console.error('Failed to connect or subscribe:', error);
  }
}

connectSubscriber();

module.exports = subscriber;