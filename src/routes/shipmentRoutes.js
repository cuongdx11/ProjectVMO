const router = require('express').Router();
const shipmentController = require('../controllers/shipmentController')


router.get('/method',shipmentController.getShippingMethod)
router.post('/method',shipmentController.createShippingMethod)
router.put('/method/:id',shipmentController.updateShippingMethod)
router.delete('/method/:id',shipmentController.deleteShippingMethod)
router.get('/',shipmentController.getShipment)
router.get('/:id',shipmentController.getShipmentById)
router.post('/',shipmentController.createShipment)
router.put('/:id',shipmentController.updateShipment)
router.delete('/:id',shipmentController.deleteShipment)



module.exports = router