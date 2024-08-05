const { Op } = require("sequelize");
const Voucher = require("../models/voucherModel");
const ErrorRes = require("../helpers/ErrorRes");
const User = require("../models/userModel");

const getAllVoucher = async ({
    page = 1,
    pageSize = null,
    sortBy = null,
    order = null,
    filter = null,
    search = null,
    ...query
}) => {
    try {
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
        const {count , rows}  = await Voucher.findAndCountAll({
            where,
            ...queries
        })
        return {
            status: "success",
            total: count,
            vouchers: rows,
            totalPages: Math.ceil(count / limit),
            currentPage: +page,
          };
    
    } catch (error) {
        throw error
    }
};
const getVoucherAvailable = async ({ orderTotal, userId }) => {
  try {
    
    let where = {
      min_order_value: {
        [Op.lte]: orderTotal,
      },
      type : 'general'
    };
    if (userId) {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new ErrorRes("User not found", 404);
      }
      const timeSignUser = new Date(user.created_at);
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const isNewUser = timeSignUser >= oneMonthAgo;
      if (isNewUser) {
        where = {
          [Op.or]: [
            {
              type: "newuser",
            },
            {
              type: "general",
            }
          ],
          min_order_value: {
            [Op.lte]: orderTotal,
          },
        };
      }
    }
   
    const vouchers = await Voucher.findAll({
      where,
    });
    if (!vouchers || vouchers.length === 0) {
      throw new ErrorRes(404, "Không có voucher phù hợp");
    }
    return {
      status: "success",
      vouchers,
    };
  } catch (error) {
    throw error;
  }
};
const checkVoucher = async (voucher_code, orderTotal) => {
  try {
    const voucher = await Voucher.findOne({
      where: {
        code: voucher_code,
        min_order_value: {
          [Op.lte]: orderTotal,
        },
      },
    });
    if (!voucher) {
      throw new ErrorRes(
        404,
        "Voucher không tồn tại hoặc không đáp ứng được điều kiện"
      );
    }

    return {
      status: "success",
      message: "Mã giảm giá hợp lệ",
      voucher,
    };
  } catch (error) {
    throw error;
  }
};
const createVoucher = async (voucherData) => {
  try {
    const voucher = await Voucher.create(voucherData);
    return {
      status: "success",
      message: "Tạo thành công voucher",
      voucher,
    };
  } catch (error) {}
};
const getVoucherById = async (id) => {
  try {
    const voucher = await Voucher.findByPk(id);
    if (!voucher) {
      throw new ErrorRes(404, "Voucher không tồn tại");
    }
    return {
      status: "success",
      voucher,
    };
  } catch (error) {
    throw error;
  }
};
const updateVoucher = async (id, voucherData) => {
  try {
    const voucher = await Voucher.findByPk(id);
    if (!voucher) {
      throw new ErrorRes(404, "Voucher không tồn tại");
    }
    const updatedVoucher = await voucher.update(voucherData);
    return {
      status: "success",
      message: "Cập nhật voucher thành công",
      updatedVoucher,
    };
  } catch (error) {
    throw error;
  }
};
const deleteVoucher = async (id) => {
  try {
    const voucher = await Voucher.findByPk(id);
    if (!voucher) {
      throw new ErrorRes(404, "Voucher không tồn tại");
    }
    await voucher.destroy();
    return {
      status: "success",
      message: "Xóa voucher thành công",
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getVoucherAvailable,
  checkVoucher,
  getVoucherById,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  getAllVoucher
};
