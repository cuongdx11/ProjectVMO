const notificationService = require('../services/notificationService')


const getNotifications = async(req,res,next) => {
    try {
        const notifications = await notificationService.getNotifications()
        res.status(200).json(notifications)
    } catch (error) {
        next(error)
    }
} 


const maskAllNotifications = async(req,res,next) => {
    try {
        const mask = await notificationService.maskAllRead()
        res.status(200).json(mask)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getNotifications,
    maskAllNotifications
}