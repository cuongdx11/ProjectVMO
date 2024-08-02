const shipmentService = require('../services/shipmentService')



const getShippingMethod = async(req,res,next) => {
    try {
        const shippingMethod = await shipmentService.getShippingMethod(req.query)
        res.status(200).json(shippingMethod)
    } catch (error) {
        next(error)
    }
}
const createShippingMethod = async(req,res,next) => {
    try {
        const shippingMethodData = req.body
        const shippingMethod = await shipmentService.createShippingMethod(shippingMethodData)
        res.status(201).json(shippingMethod)
    } catch (error) {
        next(error)
    }
}
const updateShippingMethod = async(req,res,next) => {
    try {
        const {id} = req.params
        const shippingMethodData = req.body
        const shippingMethod = await shipmentService.updateShippingMethod(id,shippingMethodData)
        res.status(200).json(shippingMethod)
    } catch (error) {
        next(error)
    }
}
const deleteShippingMethod = async(req,res,next) => {
    try {
        const {id} = req.params
        const deleteShippingMethod = await shipmentService.deleteShippingMethod(id)
        res.status(200).json(deleteShippingMethod)
    } catch (error) {
        next(error)
    }
}

const getShipment = async(req,res,next) => {
    try {
        const shipment = await shipmentService.getShipment(req.query)
        res.status(200).json(shipment)
    } catch (error) {
        next(error)
    }
}
const getShipmentById = async(req,res,next) => {
    try {
        const {id} = req.params
        const shipment = await shipmentService.getShipmentById(id)
        res.status(200).json(shipment)
    } catch (error) {
        next(error)
    }
}
const createShipment = async(req,res,next) => {
    try {
        const shipmentData = req.body
        const shipment = await shipmentService.createShipment(shipmentData)
        res.status(201).json(shipment)
    } catch (error) {
        next(error)
    }
}
const updateShipment = async(req,res,next) => {
    try {
        const {id} = req.params
        const shipmentData = req.body
        const updatedShipment = await shipmentService.updateShipment(id,shipmentData)
        res.status(200).json(updatedShipment)
    } catch (error) {
        next(error)
    }
}
const deleteShipment = async(req,res,next) => {
    try {
        const {id} = req.params
        const deleteShipment = await shipmentService.deleteShipment(id)
        res.status(200).json(deleteShipment)
    } catch (error) {
        next(error)
    }
}
module.exports = {
    getShippingMethod,
    createShippingMethod,
    updateShippingMethod,
    deleteShippingMethod,
    getShipment,
    getShipmentById,
    createShipment,
    updateShipment,
    deleteShipment
}