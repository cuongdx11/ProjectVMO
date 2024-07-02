const Item = require('../models/itemModel')
const ItemImage = require('../models/itemimageModel')
const { Op } = require('sequelize');
const cloudinary = require('cloudinary').v2;
const OrderItem = require('../models/orderitemModel')
const ErrorRes = require('../helpers/ErrorRes')
require('dotenv').config();
const getAllItems = async() =>{
    try {
        const items = await Item.findAll()
        return items
    } catch (error) {
        throw new Error(`Error : ${error.message}`)
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

        return {
            items: rows,
            total: count,
            totalPages: Math.ceil(count / flimit),
            currentPage: page
        };
    } catch (error) {
        throw new Error(`Error: ${error.message}`);
    }
};


const getItemById = async(id) => {
    try {
        const item = await Item.findByPk(id)
        return item
    } catch (error) {
        throw new Error(`Error : ${error.message}`)
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
            message: 'Them san pham thanh cong',
            data : newItem
        }
    } catch (error) {
        if(itemData.thumbnail){
            cloudinary.uploader.destroy(itemData.thumbnail)
        }
        if (itemData.images && itemData.images.length > 0) {
            for (const image of itemData.images) {
                await cloudinary.uploader.destroy(image);
            }
        }
        throw new Error(`Error : ${error.message}`)
    }
}

const updateItem = async(id,itemData) => {
    try {
        const item = await getItemById(id)
        const updatedItem = await item.update(itemData)
        return updatedItem
    } catch (error) {
        throw new Error(`Error : ${error.message}`)
    }
}


const deleteItem = async(id) => {
    try {
        const itemOrderCount = await OrderItem.count({
            where: { item_id: id }
        });
        if(itemOrderCount > 0) {
            throw new ErrorRes(400,'San pham co don hang, khong the xoa')
        }
        const item = await getItemById(id)
        await item.destroy()
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