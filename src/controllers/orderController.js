const orderService = require('../services/orderService')
require('dotenv').config();
const jwt = require('jsonwebtoken');

const getOrders = async(req,res,next) => {
    try {
        const orders = await orderService.getOrders(req.query)
        res.status(200).json(orders)
    } catch (error) {
        next(error)
    }
}
const createOrder = async(req,res,next) => {
    try {
        const orderData = req.body
        const user = req.user
        orderData.creatorId = user.userId
        const newOrder = await orderService.createOrder(orderData)
        res.status(201).json(newOrder)
    } catch (error) {
        next(error)
    }
}
const createOrderByUser = async(req,res,next) => {
    try {
        const user = req.user
        const orderData = req.body
        const newOrder = await orderService.createOrderByUser(user.userId,orderData)
        res.status(201).json(newOrder)
    } catch (error) {
        next(error)
    }
}
const getOrderById = async(req,res,next) => {
    try {
        const {id}  = req.params
        const order = await orderService.getOrderById(id)
        res.status(200).json(order)
    } catch (error) {
        next(error)
    }
}
const updateOrder = async(req,res,next) => {
    try {
        const {id} = req.params
        const orderData = req.body
        const updateOrder = await orderService.updateOrder(id,orderData)
        res.status(200).json(updateOrder)
    } catch (error) {
        next(error)
    }
}
const deleteOrder = async(req,res,next) => {
    try {
        const {id} = req.params
        const deleteOrder = await orderService.deleteOrder(id)
        res.status(200).json(deleteOrder)
    } catch (error) {
        next(error)
    }
}
const cancelledOrder = async(req,res,next) => {
    try {
        const {id} = req.params
        const cancelledOrder = await orderService.cancelOrder(id)
        res.status(200).json(cancelledOrder)
    } catch (error) {
        next(error)
    }
}
const payOrder = async(req,res,next) => {
    try {
        const {vnp_ResponseCode,vnp_TxnRef,vnp_TransactionNo} = req.query
        const payOrder = await orderService.payOrder(vnp_TxnRef,vnp_ResponseCode,vnp_TransactionNo)
        res.status(200).json(payOrder)
    } catch (error) {
        next(error)
    }
}
const applyVoucher = async(req,res,next) => {
    try {
        const orderData = req.body
        const voucher = await orderService.applyVoucher(orderData)
        res.status(200).json(voucher)
    } catch (error) {
        next(error)
    }
}

const updateStatusOrder = async(req,res,next) => {
    try {
        const {id} = req.params
        const {newStatus} = req.body
        const updateStatusOrder = await orderService.updateStatusOrder(id,newStatus)
        res.status(200).json(updateStatusOrder)
    } catch (error) {
        next(error)
    }
}
const updateStatusShipment = async(req,res,next) => {
    try {
        const {id} = req.params
        const {newStatus} = req.body
        const updateStatusShipment = await orderService.updateStatusShipment(id,newStatus)
        res.status(200).json(updateStatusShipment)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createOrder,
    getOrderById,
    updateOrder,
    deleteOrder,
    cancelledOrder,
    payOrder,
    applyVoucher,
    getOrders,
    updateStatusOrder,
    updateStatusShipment,
    createOrderByUser

}