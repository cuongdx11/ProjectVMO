

const PaymentMethodCT = {
    COD : 1,
    VN_PAY: 2
}


const OrderStatus = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PROCESSING: 'processing',
    COMPLETED: 'completed', 
    CANCELED: 'canceled',
}

const PaymentStatus = {
    PENDING: 'pending',
    COMPLETED: 'completed', 
    FAILED: 'failed',
    REFUNDED: 'refunded'
}

const ShipmentStatus = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    RETURNED: 'returned'
}


module.exports = {
    OrderStatus,
    PaymentStatus,
    ShipmentStatus,
    PaymentMethodCT
}