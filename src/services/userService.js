const User = require("../models/userModel");
const Address = require("../models/addressModel");
const ErrorRes = require("../helpers/ErrorRes");
const Order = require("../models/orderModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const getAllUser = async ({
  page = 1,
  sortBy = null,
  filter = null,
  order = null,
  limit = null,
  search = null,
  ...query
}) => {
  try {
    const offset = page <= 1 ? 0 : page - 1;
    const flimit = +limit || +process.env.LIMIT || 10;
    const queries = { 
        raw: false, 
        nest: true ,
        limit :  flimit,
        offset : offset * flimit,
    };
    let sequelizeOrder = [];
    if (sortBy && order) {
      const orderDirection = order.toUpperCase();
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

    const { count, rows } = await User.findAndCountAll({
      where,
      ...queries,
      attributes: { exclude: ["password"] },
      include : [
        {
            model : Address,
            as : "address",
            attributes :    ['address_line1','address_line2','city','country','type_address','is_default'] 
        }
      ]
      
    });
    return {
      users: rows,
      total: count,
      totalPages: Math.ceil(count / flimit),
      currentPage: page,
    };
  } catch (error) {
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new ErrorRes(404, "Tài khoản không tồn tại");
    }
    return {
      status: "success",
      message: "Lấy tài khoản thành công",
      user,
    };
  } catch (error) {
    throw error;
  }
};
const createUser = async (user) => {
  try {
    const { password } = user;
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT, 10)
    );
    user.password = hashedPassword;
    const newUser = await User.create(user);
    return {
      status: "success",
      message: "Tạo tài khoản thành công",
      newUser,
    };
  } catch (error) {
    throw error;
  }
};
const updateUser = async (id, userData) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new ErrorRes(404, "Tài khoản không tồn tại");
    }
    const updatedUser = await user.update(userData);
    return {
      status: "success",
      message: "Cập nhật tài khoản thành công",
      updatedUser,
    };
  } catch (error) {
    throw error;
  }
};
const deleteUser = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new ErrorRes(404, "Tài khoản không tồn tại");
    }
    await user.destroy();
    return {
      status: "success",
      message: "Xóa tài khoản thành công",
    };
  } catch (error) {
    throw error;
  }
};
const getUserOrders = async (
  token,
  { page = 1, limit = process.env.LIMIT, status = null }
) => {
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.userId;
    const user = await User.findByPk(userId);
    if (!user) {
      throw new ErrorRes(404, "Tài khoản không tồn tại");
    }

    const queries = { raw: true, nest: true };
    const offset = page <= 1 ? 0 : page - 1;
    const flimit = +limit;
    queries.offset = offset * flimit;
    queries.limit = flimit;

    const where = { user_id: userId };
    if (status) {
      where.status = status;
    }

    const { count, rows } = await Order.findAndCountAll({
      where,
      ...queries,
      order: [["created_at", "DESC"]], // Sắp xếp theo thời gian tạo mới nhất
    });

    return {
      status: "success",
      message: "Lấy danh sách đơn hàng thành công",
      orders: rows,
      total: count,
      totalPages: Math.ceil(count / flimit),
      currentPage: page,
    };
  } catch (error) {
    throw error;
  }
};
const createAddress = async (token, addressData) => {
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.userId;
    const user = await User.findByPk(userId);
    if (!user) {
      throw new ErrorRes(404, "Tài khoản không tồn tại");
    }
    const address = await Address.create({
      ...addressData,
      user_id: userId,
    });
    return {
      status: "success",
      message: "Thêm địa chỉ thành công",
      address: address,
    };
  } catch (error) {
    throw error;
  }
};
module.exports = {
  getAllUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserOrders,
  createAddress,
};
