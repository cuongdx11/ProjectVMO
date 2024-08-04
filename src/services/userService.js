const User = require("../models/userModel");
const ErrorRes = require("../helpers/ErrorRes");
const Order = require("../models/orderModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const redisClient = require("../config/redisConfig");
const Queue = require("bull");
const { sequelize } = require('../config/dbConfig');
const UserRole = require("../models/userRoleModel");
const UserNotifications = require('../models/userNotifications')
const emailQueue = new Queue("email-queue", {
  redis: redisClient,
});
require("dotenv").config();

const getAllUser = async ({
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
      raw: false,
      nest: true,
      limit: limit,
      offset: offset * limit,
    };
    let sequelizeOrder = [];
    if (sortBy && order) {
      const orderDirection = order.toUpperCase();
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

    const { count, rows } = await User.findAndCountAll({
      where,
      ...queries,
      attributes: { exclude: ["password"] },
    });
    return {
      users: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: +page,
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

const createUserAdmin = async (userData) => {
  const transaction = await sequelize.transaction();
  try {
    const {fullName, email, roleId } = userData;
    const generateUserName = (length) =>
      Array.from(crypto.randomBytes(length))
        .map(
          (byte) =>
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[
              byte % 61
            ]
        )
        .join("");
    const generatePassword = (length) =>
      Array.from(crypto.randomBytes(length))
        .map(
          (byte) =>
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&"[
              byte % 68
            ]
        )
        .join("");
    const userName = generateUserName(12);
    const password = generatePassword(12);
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT, 10));
    const newUser = await User.create({
      username: userName,
      email: email,
      password: hashedPassword,
      is_verified: true,
      is_notification: true,
      full_name: fullName
    },{transaction});
    await UserRole.create({
      user_id: newUser.id,
      role_id: roleId,
    },{transaction})
    
    await transaction.commit();
    await emailQueue.add('send-information', {
      email: email,
      password: password,
      fullName: fullName
    })
    return {
      status: "success",
      message: "Tạo thành công",
      newUser
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
const sendInvitationUser = async(userData) => {
  try {
    const {email,fullName,roleId} = userData
    const verificationToken = jwt.sign(
      { email: email,fullName: fullName, roleId: roleId  },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "3d", // Thời gian hết hạn của token
      }
    );
    await emailQueue.add('invitation-email', {
      email: email,
      fullName: fullName,
      roleId: roleId,
      verificationToken: verificationToken,
    })
    return {
      status: "success",
      message: "Đã gủi lời mời tham gia"
    };
  } catch (error) {
    throw error
  }
}
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
  id,
  {
    page = 1,
    pageSize = null,
    sortBy = null,
    filter = null,
    order = null,
    search = null,
    ...query
  }
) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new ErrorRes(404, "Tài khoản không tồn tại");
    }

    const offset = page <= 1 ? 0 : page - 1;
    const limit = +pageSize || +process.env.LIMIT || 10;
    const queries = {
      raw: false,
      nest: true,
      limit: limit,
      offset: offset * limit,
    }; // không lấy instance, lấy data từ bảng khác
    let sequelizeOrder = [];
    if (sortBy && order) {
      const orderDirection = order.toUpperCase() || "asc";
      sequelizeOrder.push([sortBy, orderDirection]);
      queries.order = sequelizeOrder;
    }
    if (search) query.name = { [Op.substring]: search };
    const where = { user_id: id, ...query };
    if (filter && typeof filter === "object") {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          where[key] = value;
        }
      });
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
      totalPages: Math.ceil(count / limit),
      currentPage: +page,
    };
  } catch (error) {
    throw error;
  }
};
const getProfileUser = async (id) => {
  try {
   
    const user = await User.findOne({
      where: { id: id },
      attributes: [
        "username",
        "full_name",
        "phone",
        "email",
        "avatar",
        "is_verified",
      ],
    });
    if (!user) throw new ErrorRes(404, "Tài khoản không tồn tại");

    return {
      status: "success",
      message: "Lấy thông tin tài khoản thành công",
      user: user,
    };
  } catch (error) {
    throw error;
  }
};
const updateProfileUser = async (id, profileData) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new ErrorRes(404, "Tài khoản không tồn tại");
    }

    await user.update(profileData);
    return {
      status: "success",
      message: "Cập nhật thông tin thành công",
      user,
    };
  } catch (error) {
    throw error;
  }
};
const updateAvatarUser = async (id, avatar) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new ErrorRes(404, "Tài khoản không tồn tại");
    }
    await user.update({
      avatar,
    });
    return {
      status: "success",
      message: "Cập nhật ảnh đại diện thành công",
    };
  } catch (error) {
    throw error;
  }
};
const getUserNotifications = async(id) => {
  try {
    const {count,rows} = await UserNotifications.findAndCountAll({
      where: {
        user_id: id
      }
    })
    return {
      status: "success",
      message: "Lấy thông báo thành công",
      total: count,
      notifications: rows
    }
    
  } catch (error) {
    throw error
  }
}
const maskAsRead = async(id) => {
  try {
    await UserNotifications.update(
      {is_read: true},
      {
        where: {
          user_id: id,
          is_read: false
        }
      }
    )
    return {
      status: "success",
      message: "Đã đánh dấu đọc tất cả các thông báo"
    }
  } catch (error) {
    
  }
}

module.exports = {
  getAllUser,
  getUserById,
  getProfileUser,
  createUser,
  updateUser,
  deleteUser,
  getUserOrders,
  updateProfileUser,
  updateAvatarUser,
  createUserAdmin,
  sendInvitationUser,
  getUserNotifications,
  maskAsRead
};
