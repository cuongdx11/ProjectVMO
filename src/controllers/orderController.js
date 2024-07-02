const orderService = require('../services/orderService')
require('dotenv').config();
const jwt = require('jsonwebtoken');


const createOrder = async(req,res) => {
    try {
        const { items, voucher_code } = req.body;
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Lấy token sau 'Bearer'
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const newOrder = await orderService.createOrder(decode.userId,items,voucher_code)
        res.status(201).json(newOrder)
    } catch (error) {
        res.status(500).json(error.message)
    }
}

module.exports = {
    createOrder
}