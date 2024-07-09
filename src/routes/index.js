const user = require('./userRoutes')
const auth = require('./authRoutes')
const category = require('./categoryRoutes')
const item = require('./itemRoutes')
const order = require('./orderRoutes')
const flashSale = require('./flashsaleRoutes')
const voucher = require('./voucherRoutes')
const review = require('./reviewRoutes')
const cart = require('./cartRoutes')
const errorHandling = require('../middlewares/errorHandlingMiddleware')
const intRoutes = (app) =>{

    app.use('/api/v1/users',user)
    app.use('/api/v1/categories',category)
    app.use('/api/v1/items',item)
    app.use('/api/v1/auth',auth)
    app.use('/api/v1/orders',order)
    app.use('/api/v1/flash-sale',flashSale)
    app.use('/api/v1/vouchers',voucher)
    app.use('/api/v1/reviews',review)
    app.use('/api/v1/carts',cart)
    app.use(errorHandling)

    
}


module.exports = intRoutes