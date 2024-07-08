const Item = require('../models/itemModel')
const ItemImage = require('../models/itemimageModel')
const { Op } = require('sequelize');
const cloudinary = require('cloudinary').v2;
const OrderItem = require('../models/orderitemModel')
const FlashSaleItem = require('../models/flashsaleitemModel')
const FlashSale = require('../models/flashsaleModel')
const ErrorRes = require('../helpers/ErrorRes')
require('dotenv').config();
const getAllItems = async() =>{
    try {
        const items = await Item.findAll()
        return {
            status : 'success',
            data : items
        }
    } catch (error) {
        throw error
    }
}
const getPageItem = async({ page = 1, order = null,filter = null, orderBy = 'asc', limit = process.env.LIMIT, name = null, ...query }) => {
    try {
        const queries = { raw: true, nest: true }; // không lấy instance, lấy data từ bảng khác
        const offset = (page <= 1) ? 0 : (page - 1);
        const flimit = +limit;
        queries.offset = offset * flimit;
        queries.limit = flimit;
        let sequelizeOrder = []
        if (order && orderBy) {
            const orderDirection = orderBy.toUpperCase();
            sequelizeOrder.push([order, orderDirection]);
            queries.order = sequelizeOrder
        }
        if (name) query.name = { [Op.substring]: name };

        if (filter && typeof filter === 'object') {
            Object.assign(where, filter);
        }

        const { count, rows } = await Item.findAndCountAll({
            where: query,
            ...queries
        });
        // Lấy danh sách item_id từ các item đã truy vấn
        const itemIds = rows.map(item => item.id);

        // Truy vấn để lấy tất cả ảnh chi tiết của các item
        const itemImages = await ItemImage.findAll({
            where: {
                item_id: {
                    [Op.in]: itemIds
                }
            }
        });

        // Kết hợp ảnh chi tiết vào các item
        const itemsWithImages = rows.map(item => {
            item.itemImages = itemImages.filter(image => image.item_id === item.id);
            return item;
        });
        return {
            status : 'success',
            items: itemsWithImages,
            total: count,
            totalPages: Math.ceil(count / flimit),
            currentPage: page
        };
    } catch (error) {
        throw error
    }
};


const getItemById = async(id) => {
    try {
        const item = await Item.findByPk(id)
        const itemImages = await ItemImage.findAll({
            where: { item_id: id }
        })
        if(!item){
            throw new ErrorRes(404,'Sản phẩm không tồn tại')
        }
        item.setDataValue('itemImages', itemImages)
        return item
    } catch (error) {
        throw error
    }
}

const createItem = async(itemData) =>{
    const transaction = await Item.sequelize.transaction();
    try {
        // Tạo sản phẩm mới
        const newItem = await Item.create(itemData,{transaction})
        // Lưu các ảnh chi tiết vào bảng ItemImages
        if (itemData.images && itemData.images.length > 0) {
            const itemImagesData = itemData.images.map(image => ({
                item_id: newItem.id,
                image_url: image
            }));
            await ItemImage.bulkCreate(itemImagesData, { transaction });
        }
        await transaction.commit();
        return {
            status : 'success',
            message: 'Thêm sản phẩm thành công',
            data : newItem
        }
    } catch (error) {
        await transaction.rollback();
        if(itemData.thumbnail){
            cloudinary.uploader.destroy(itemData.thumbnail)
        }
        if (itemData.images && itemData.images.length > 0) {
            for (const image of itemData.images) {
                await cloudinary.uploader.destroy(image);
            }
        }
        throw error
    }
}

const updateItem = async(id,itemData) => {
    try {
        const item = await Item.findByPk(id)
        if(!item){
            throw new ErrorRes(404,'Sản phẩm không tồn tại')
        }
        const updatedItem = await item.update(itemData)
        return {
            status : 'success',
            message: 'Cập nhật sản phẩm thành công',
            data : updatedItem
        }
    } catch (error) {
        throw error
    }
}


const deleteItem = async(id) => {
    try {
        const itemOrderCount = await OrderItem.count({
            where: { item_id: id }
        });
        if(itemOrderCount > 0) {
            throw new ErrorRes(400,'Sản phẩm này có trong đơn hàng , không thể xóa')
        }
        const item = await Item.findByPk(id)
        if(!item){
            throw new ErrorRes(404,'Sản phẩm không tồn tại')
        }
        await item.destroy()
        return {
            status : 'success',
            message: 'Xóa sản phẩm thành công'
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllItems,
    getPageItem,
    getItemById,
    createItem,
    updateItem,
    deleteItem
}