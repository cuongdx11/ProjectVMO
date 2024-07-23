const redis = require('redis');

const subscriber = redis.createClient();

subscriber.on('error', (err) => {
  console.error('Redis error:', err);
});

const connectSubscriber = async() => {
  try {
    await subscriber.connect();
    await subscriber.subscribe('notifications', (message) => {
      try {
        const notification = JSON.parse(message);
        // Xử lý thông báo, ví dụ như lưu vào database, gửi tới client, v.v.
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