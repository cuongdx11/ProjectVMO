const ErrorRes = require("../helpers/ErrorRes");
const Category = require("../models/categoryModel");
const { Op } = require("sequelize");
const { sequelize } = require('../config/dbConfig');
const createCategory = async (categoryData) => {
  try {
    const { name, position } = categoryData;
    if (!name || !position) {
      throw new ErrorRes(400, "Thiếu trường bắt buộc");
    }
    const newCategory = await Category.create(categoryData);
    return {
      status: "success",
      message: "Tạo mới danh mục thành công",
      data: newCategory,
    };
  } catch (error) {
    throw error;
  }
};
const getCategoryById = async (id) => {
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new ErrorRes(404, "Danh mục không tồn tại");
    }
    return {
      status: "success",
      message: "Lấy danh mục thành công",
      data: category,
    };
  } catch (error) {
    throw error;
  }
};

const updateCategory = async (id, categoryData) => {
  try {
    if (!id) {
      throw new ErrorRes(400, "Thiếu trường bắt buộc");
    }
    const category = await Category.findByPk(id);
    if (!category) {
      throw new ErrorRes(404, "Danh mục không tồn tại");
    }
    const updateCategory = await category.update(categoryData);
    return {
      status: "success",
      message: "Cập nhật danh mục thành công",
      data: updateCategory,
    };
  } catch (error) {
    throw error;
  }
};
const deleteCategory = async (id) => {
  try {
    if (!id) {
      throw new ErrorRes(400, "Thiếu trường bắt buộc");
    }
    const category = await getCategoryById(id);
    await category.destroy();
    return {
      status: "success",
      message: "Xóa danh mục thành công",
    };
  } catch (error) {
    throw error;
  }
};
const getCategories = async ({
  page = 1,
  sortBy = null,
  filter = null,
  order = null,
  pageSize = null,
  search = null,
  ...query
}) => {
  try {
    const offset = page <= 1 ? 0 : page - 1;
    const limit = +pageSize || +process.env.LIMIT || 10;
    const queries = { 
      raw: true, 
      nest: true,
      limit :  limit,
      offset : offset * limit,
    };
  
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
    const { count, rows } = await Category.findAndCountAll({
      where,
      ...queries,
    });
    return {
      status: "success",
      items: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  } catch (error) {
    throw error;
  }
};
const changePosition = async(id,newPosition) => {
  try {
    const category = await Category.findByPk(id)
    if (!category) {
      throw new ErrorRes(404, "Danh mục không tồn tại");
    }
    const currentPos = category.position
    await Category.update({ position: sequelize.literal('position - 1') }, {
      where: {
        position: {
          [Op.gt]: currentPos
        }
      }
    })
  
    await Category.update({ position: sequelize.literal('position + 1') }, {
      where: {
        position: {
          [Op.gte]: newPosition
        }
      }
    }) 
    category.position = newPosition;
    await category.save();
    return {
      status: "success",
      message: "Thay đổi vị trí thành công",
      category
    }
  } catch (error) {
    throw error
  }
}
module.exports = {
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategories,
  changePosition
};
