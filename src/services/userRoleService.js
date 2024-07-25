const ErrorRes = require("../helpers/ErrorRes");
const UserRole = require("../models/userRoleModel");
const User = require('../models/userModel')
const Role = require('../models/roleModel')
const getUserRoles = async ({
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
      limit: limit,
      offset: offset * limit,
    };

    let sequelizeOrder = [];
    if (sortBy && order) {
      const orderDirection = order.toUpperCase() || "asc";
      sequelizeOrder.push([sortBy, orderDirection]);
      queries.order = sequelizeOrder;
    }
    if (search) query.name = { [Op.substring]: search };

    const where = { ...query };

    if (filter && typeof filter === "object") {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          where[key] = value;
        }
      });
    }
    const { count, rows } = await UserRole.findAndCountAll({
      where,
      ...queries,
    });
    return {
        status: "success",
        items: rows,
        total: count,
        totalPages: Math.ceil(count / limit),
        currentPage: +page,
      };
  } catch (error) {
    throw error
  }
};
const getUserRoleByUserId = async(id) => {
    try {
       const userRole = await User.findOne({
        where: { id: id },
        attributes:['full_name'],
        include:[
          {
            model: Role,
            as: 'role',
            attributes:['name'],
            through: {
              attributes: [] // Loại bỏ UserRole khỏi kết quả
            }
          }
        ]
       })
      
        if(!userRole){
            throw new ErrorRes(404,'User Role không tồn tại')
        }
        return {
            status: "success",
            data: userRole
        }
    } catch (error) {
        throw error
    }
}
const createUserRole = async(userRoleData) => {
  try {
    const userRole = await UserRole.create(userRoleData)
    return {
      status: "success",
      data: userRole
    }
  } catch (error) {
    throw error
  }
}
const updateUserRole = async(userId,userRoleData) => {
  try {
    const userRole = await UserRole.findOne({
      where: { user_id: userId }
    })
    if(!userRole){
      throw new ErrorRes(404,'User Role không tồn tại')
    }
    const updatedUserRole = await userRole.update(userRoleData)
    return {
      status: "success",
      message: "Cập nhật thành công",
      data: updatedUserRole
    }
  } catch (error) {
    
  }
}
const deleteUserRole = async(userId) => {
  try {
    const userRole = await UserRole.findOne({
      where: { user_id: userId }
    })
    if(!userRole){
      throw new ErrorRes(404,'User Role không tồn tại')
    }
    await userRole.destroy()
    return {
      status: "success",
      message: "Xóa thành công"
    }
  } catch (error) {
    throw error
  }
}
module.exports = {
  getUserRoles,
  getUserRoleByUserId,
  createUserRole,
  updateUserRole,
  deleteUserRole
};
