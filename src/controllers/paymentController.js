const paymentService = require("../services/paymentService");



const getPaymentMethod = async(req,res,next) => {
    try {
        const paymentMethod = await paymentService.getPaymentMethod(req.query)
        res.status(200).json(paymentMethod)
    } catch (error) {
        next(error)
    }
}
const createPaymentMethod = async(req,res,next) => {
  try {
      const paymentMethodData = req.body
      const paymentMethod = await paymentService.createPaymentMethod(paymentMethodData)
      res.status(201).json(paymentMethod)
  } catch (error) {
    next(error)
  }
}
const updatePaymentMethod = async(req,res,next) => {
  try {
    const {id} = req.params
    const paymentMethodData = req.body
    const paymentMethod = await paymentService.updatePaymentMethod(id,paymentMethodData)
    res.status(200).json(paymentMethod)
  } catch (error) {
    next(error)
  }
}
const deletePaymentMethod = async(req,res,next) => {
  try {
    const {id} = req.params
    const deletePaymentMethod = await paymentService.deletePaymentMethod(id)
    res.status(200).json(deletePaymentMethod)
  } catch (error) {
    next(error)
  }
}
const paymentVNPay = async (req, res, next) => {
  try {
    const { vnp_ResponseCode, vnp_TxnRef, vnp_TransactionNo } = req.query;
    const paymentVNPay = await paymentService.paymentVNPay(vnp_TxnRef,vnp_ResponseCode,vnp_TransactionNo)
    res.status(200).json(paymentVNPay)
  } catch (error) {
    next(error)
  }
};
const getAllPayment = async(req,res,next) => {
  try {
    const listPayment = await paymentService.getListPayment(req.query)
    res.status(200).json(listPayment)
  } catch (error) {
    next(error)
  }
}
const getPaymentById = async(req,res,next) => {
  try {
    const {id} = req.params
    const payment = await paymentService.getPaymentById(id)
    res.status(200).json(payment)
  } catch (error) {
    next(error)
  }
}
const updatePayment = async(req,res,next) => {
  try {
    const {id} = req.params
    const paymentData = req.body
    const updatePayment = await paymentService.updatePayment(id,paymentData)
    res.status(200).json(updatePayment)
  } catch (error) {
    next(error)
  }
}
const deletePayment = async(req,res,next) => {
  try {
    const {id} = req.params
    const deletePayment = await paymentService.deletePayment(id)
    res.status(200).json(deletePayment)
  } catch (error) {
    next(error)
  }
}
const createPayment = async(req,res,next) => {
  try {
    const paymentData = req.body
    const payment = await paymentService.createPayment(paymentData)
    res.status(201).json(payment)
  } catch (error) {
    next(error)
  }
}
module.exports = {
    paymentVNPay,
    getPaymentMethod,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    getAllPayment,
    getPaymentById,
    updatePayment,
    deletePayment,
    createPayment
}
