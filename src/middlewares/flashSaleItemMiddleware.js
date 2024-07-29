const { Op } = require('sequelize');
const Item = require('../models/itemModel');
const FlashSale = require('../models/flashSaleModel');
const FlashSaleItem = require('../models/flashSaleItemModel');

const flashSaleItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const item = await Item.findByPk(id);

        if (!item) {
            return res.status(404).json({ message: 'Sản phẩm này không tồn tại' });
        }

        const currentTime = new Date();

        const flashSaleItem = await FlashSaleItem.findOne({
            where: {
                item_id: id
            },
            attributes: ['flash_sale_price','quantity','sold_quantity'],
            include: [{
                model: FlashSale,
                as:'flashSale',
                where: {
                    start_time: { [Op.lte]: currentTime },
                    end_time: { [Op.gte]: currentTime }
                },
                attributes: ['name','status','start_time','end_time']
            }]
        });

        if (flashSaleItem) {
            req.flashSaleItem = flashSaleItem
        }
       
        next()

    } catch (error) {
        next(error);
    }
};

module.exports = {
    flashSaleItem
}