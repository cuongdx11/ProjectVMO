const router = require('express').Router();
const shipmentController = require('../controllers/shipmentController')
const {authenticateToken,checkPermission} = require('../middlewares/authMiddleware')
const PERMISSIONS = require('../constants/permissions');


router.use(authenticateToken)


router.get('/method',checkPermission(PERMISSIONS.VIEW_SHIPPING_METHODS),shipmentController.getShippingMethod)
router.post('/method',checkPermission(PERMISSIONS.VIEW_SHIPPING_METHOD),shipmentController.createShippingMethod)
router.put('/method/:id',checkPermission(PERMISSIONS.UPDATE_SHIPPING_METHOD),shipmentController.updateShippingMethod)
router.delete('/method/:id',checkPermission(PERMISSIONS.DELETE_SHIPPING_METHOD),shipmentController.deleteShippingMethod)

router.get('/',checkPermission(PERMISSIONS.VIEW_SHIPMENTS),shipmentController.getShipment)
router.get('/:id',checkPermission(PERMISSIONS.VIEW_SHIPMENT),shipmentController.getShipmentById)
router.post('/',checkPermission(PERMISSIONS.CREATE_SHIPMENT),shipmentController.createShipment)
router.put('/:id',checkPermission(PERMISSIONS.UPDATE_SHIPMENT),shipmentController.updateShipment)
router.delete('/:id',checkPermission(PERMISSIONS.DELETE_SHIPMENT),shipmentController.deleteShipment)



module.exports = router