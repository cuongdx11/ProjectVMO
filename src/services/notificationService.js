const Notification = require('../models/notificationModel')



const createNotification = async(message,type) => {
    try {
        return await Notification.create({
            message: message,
            type: type
        })
    } catch (error) {
        throw error
    }
}

const getNotifications = async() => {
    try {
        return await Notification.findAll()
    } catch (error) {
        throw error
    }
}
const maskAllRead = async() => {
    try {
        await Notification.update({is_read: true},{where: {is_read: false}})
        return {
            status: true,
            message: 'Đã đánh dấu đã đọc tất cả thông báo'
        }
    } catch (error) {
        throw error
    }
}
module.exports = {
    createNotification,
    getNotifications,
    maskAllRead
}