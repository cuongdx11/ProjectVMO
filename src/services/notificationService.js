const Notification = require('../models/notificationModel')
const ErrorRes = require("../helpers/ErrorRes");



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

const getNotifications = async({
    page = 1,
    sortBy = null,
    filter = null,
    order = null,
    pageSize = null,
    search = null,
    ...query
  }) => {
    try {
        const offset = page <= 1 ? 0 : page - 1;
    const limit = +pageSize || +process.env.LIMIT || 10;
    const queries = {
      raw: false,
      nest: true,
      limit: limit,
      offset: offset * limit,
    };
    let sequelizeOrder = [];
    if (sortBy && order) {
      const orderDirection = order.toUpperCase() || "asc";
      sequelizeOrder.push([sortBy, orderDirection]);
      queries.order = sequelizeOrder;
    }

    if (search) query.name = { [Op.substring]: search };

    const where = { ...query };

    if (filter && typeof filter === "object") {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          where[key] = value;
        }
      });
    }
    const {count,rows } = await Notification.findAndCountAll({
      where,
      ...queries,
    });
    return {
      status: "success",
      total: count,
      notifications: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: +page,
    };
    } catch (error) {
        throw error
    }
}
const getNotificationById = async(id) => {
    try {
        const notification = await Notification.findByPk(id)
        if(!notification) {
            throw new ErrorRes(404,'Thông báo không tồn tại')
        }
        return {
            status: "success",
            notification
        }
    } catch (error) {
        throw error
    }
}
const updateNotification = async(id,notificationData) => {
    try {
        const notification = await Notification.findByPk(id)
        if(!notification) {
            throw new ErrorRes(404,'Thông báo không tồn tại')
        }
        const updateNotification = await notification.update(notificationData)
        return {
            status: "success",
            updateNotification
        }
    } catch (error) {
        throw error
    }
}
const deleteNotification = async(id) => {
    try {
        const notification = await Notification.findByPk(id)
        if(!notification) {
            throw new ErrorRes(404,'Thông báo không tồn tại')
        }
        await notification.destroy()
        return {
            status: "success",
            message: "Xoá thành công thông báo"
        }
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
    maskAllRead,
    getNotificationById,
    updateNotification,
    deleteNotification
}