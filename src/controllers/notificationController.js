const notificationService = require('../services/notificationService')

const createNotification = async(req,res,next) => {
    try {
        const {message,type} = req.body
        const notification = await notificationService.createNotification(message,type)
        res.status(201).json(notification)
    } catch (error) {
        next(error)
    }
}

const getNotifications = async(req,res,next) => {
    try {
        const notifications = await notificationService.getNotifications(req.query)
        res.status(200).json(notifications)
    } catch (error) {
        next(error)
    }
} 
const getNotificationById = async(req,res,next) => {
    try {
        const {id} = req.params
        const notification = await notificationService.getNotificationById(id)
        res.status(200).json(notification)
    } catch (error) {
        next(error)
    }
}
const updateNotification = async(req,res,next) => {
    try {
        const {id} = req.params
        const notificationData = req.body
        const notification = await notificationService.updateNotification(id,notificationData)
        res.status(200).json(notification)
    } catch (error) {
       next(error) 
    }
}
const deleteNotification = async(req,res,next) => {
    try {
        const {id} = req.params
        const deleteNotification = await notificationService.deleteNotification(id)
        res.status(200).json(deleteNotification)
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
    maskAllNotifications,
    getNotificationById,
    createNotification,
    updateNotification,
    deleteNotification
}