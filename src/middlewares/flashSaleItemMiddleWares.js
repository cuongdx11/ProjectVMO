const { Op } = require('sequelize');
const Item = require('../models/itemModel');
const FlashSale = require('../models/flashsaleModel');
const FlashSaleItem = require('../models/flashsaleitemModel');

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
            include: [{
                model: FlashSale,
                where: {
                    start_time: { [Op.lte]: currentTime },
                    end_time: { [Op.gte]: currentTime }
                }
            }]
        });

        if (flashSaleItem) {
            req.flashsale = flashSaleItem
        }
       
        next()

    } catch (error) {
        next(error);
    }
};

module.exports = {
    flashSaleItem
}