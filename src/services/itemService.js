const Item = require("../models/itemModel");
const ItemImage = require("../models/itemImageModel");
const { Op } = require("sequelize");
const cloudinary = require("cloudinary").v2;
const OrderItem = require("../models/orderItemModel");
const Category = require('../models/categoryModel')
const readExcel = require('../helpers/readExcel')
const uploadImage = require('../helpers/uploadImages')
const ErrorRes = require("../helpers/ErrorRes");
require("dotenv").config();
const redis = require('../config/redisConfig');
const Review = require("../models/reviewModel");
const FlashSale = require("../models/flashSaleModel");
const FlashSaleItem = require("../models/flashSaleItemModel");

const getAllItems = async () => {
  try {
    const items = await Item.findAll();
    return {
      status: "success",
      data: items,
    };
  } catch (error) {
    throw error;
  }
};
const getPageItem = async ({
  page = 1,
  sortBy = null,
  filter = null,
  order = null,
  pageSize = null,
  search = null,
  ...query
}) => {
  try {
    // const getAllItem = await redis.get('get-list-item')
    // if(getAllItem) {
    //   return {
    //     status: 'success',
    //     data: JSON.parse(getAllItem)
    //   }
    // }
    const offset = page <= 1 ? 0 : page - 1;
    const limit = +pageSize || +process.env.LIMIT || 10;
    const queries = { 
        raw: false, 
        nest: true,
        limit :  limit,
        offset : offset * limit,
    }; // không lấy instance, lấy data từ bảng khác

    let sequelizeOrder = [];
    if (sortBy && order) {
      const orderDirection = order.toUpperCase() || 'asc'
      sequelizeOrder.push([sortBy, orderDirection]);
      queries.order = sequelizeOrder;
    }
    
    if (search) query.name = { [Op.substring]: search };
    
    const where = {...query}

    if (filter && typeof filter === "object") {
      Object.entries(filter).forEach(([key,value])=>{
        if(value !== null && value !== undefined){
          where[key] = value
        }
      })
    }

    const { count, rows } = await Item.findAndCountAll({
      where,
      ...queries,
      include: [
        // {
        //   model: ItemImage,
        //   as: 'images', // Tên alias nếu bạn đã định nghĩa
        //   attributes : ['image_url'],
        //   required: false, // Để không loại bỏ các item không có ảnh chi tiết
        //   separate: true
        // },
        {
          model: Category,
          as: 'category', 
          attributes : ['name','position','banner_image'], 
        }
      ],
    });
    // redis.set('get-list-item',JSON.stringify({
    //   status: "success",
    //   total: count,
    //   items: rows,
    //   totalPages: Math.ceil(count / limit),
    //   currentPage: +page
    // }))
    return {
      status: "success",
      total: count,
      items: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: +page,
    };
  } catch (error) {
    throw error;
  }
};
const getItemById = async (id) => {
  try {
    const item = await Item.findOne({
      where: { id },
      include: [
        {
          model: Category,
          as: 'category',
          attributes : ['name']
        },
        {
          model:ItemImage,
          as: 'images',
          attributes : ['image_url']
        },
        {
          model: Review,
          as: 'reviews',
          attributes : ['user_id','comment','rating','created_at'],
        }
      ]
    })
    if (!item) {
      throw new ErrorRes(404, "Sản phẩm không tồn tại");
    }
    return item;
  } catch (error) {
    throw error;
  }
};
const createItem = async (itemData) => {
  const transaction = await Item.sequelize.transaction();
  try {
    // Tạo sản phẩm mới
    const newItem = await Item.create(itemData, { transaction });
    // Lưu các ảnh chi tiết vào bảng ItemImages
    if (itemData.images && itemData.images.length > 0) {
      const itemImagesData = itemData.images.map((image) => ({
        item_id: newItem.id,
        image_url: image,
      }));
      await ItemImage.bulkCreate(itemImagesData, { transaction });
    }
    await transaction.commit();
    return {
      status: "success",
      message: "Thêm sản phẩm thành công",
      data: newItem,
    };
  } catch (error) {
    await transaction.rollback();
    if (itemData.thumbnail) {
      cloudinary.uploader.destroy(itemData.thumbnail);
    }
    if (itemData.images && itemData.images.length > 0) {
      for (const image of itemData.images) {
        await cloudinary.uploader.destroy(image);
      }
    }
    throw error;
  }
};
const updateItem = async (id, itemData) => {
  try {
    const item = await Item.findByPk(id);
    if (!item) {
      throw new ErrorRes(404, "Sản phẩm không tồn tại");
    }
    const updatedItem = await item.update(itemData);
    return {
      status: "success",
      message: "Cập nhật sản phẩm thành công",
      data: updatedItem,
    };
  } catch (error) {
    throw error;
  }
};
const deleteItem = async (id) => {
  try {
    const itemOrderCount = await OrderItem.count({
      where: { item_id: id },
    });
    if (itemOrderCount > 0) {
      throw new ErrorRes(400, "Sản phẩm này có trong đơn hàng , không thể xóa");
    }
    const item = await Item.findByPk(id);
    if (!item) {
      throw new ErrorRes(404, "Sản phẩm không tồn tại");
    }
    await item.destroy();
    return {
      status: "success",
      message: "Xóa sản phẩm thành công",
    };
  } catch (error) {
    throw error;
  }
};
const createItemsFromExcel = async(fileBuffer) => {
  try {
    const itemsData = readExcel.readExcelFile(fileBuffer)
    for(const itemData of itemsData){
      const { thumbnail_path, image_paths } = itemData;
      const thumbnail = await uploadImage(thumbnail_path)
      const images = await Promise.all(image_paths.split(',').map(path => uploadImage(path.trim())));

      itemData.thumbnail = thumbnail;
      itemData.images = images;

      await createItem(itemData);

    }
  } catch (error) {
    throw error
  }
}

module.exports = {
  getAllItems,
  getPageItem,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  createItemsFromExcel
};
