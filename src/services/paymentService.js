const Payment = require("../models/paymentModel");
const PaymentMethod = require("../models/paymentMethodModel");
const Order = require("../models/orderModel");
const { sequelize } = require('../config/dbConfig');
const ErrorRes = require("../helpers/ErrorRes");
const getPaymentMethod = async ({
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
    const { count, rows } = await PaymentMethod.findAndCountAll({
      where,
      ...queries
    });
    return {
        status: 'success',
        total: count,
        items: rows,
        totalPages: Math.ceil(count / limit),
        currentPage: +page,
      };
  } catch (error) {
    throw error
  }
};
const createPaymentMethod = async (paymentMethodData) => {
  try {
    const transaction = await sequelize.transaction();
    const paymentMethod = PaymentMethod.create(paymentMethodData,transaction);
    await transaction.commit();
    return paymentMethod;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
const updatePaymentMethod = async (id, paymentMethodData) => {
  try {
    const paymentMethod = await PaymentMethod.findByPk(id);
    if (!paymentMethod) {
      throw new ErrorRes(404,'Phương thức không tồn tại')
    }
    await paymentMethod.update(paymentMethodData);
    return paymentMethod;
  } catch (error) {
    throw error;
  }
};
const deletePaymentMethod = async (id) => {
  try {
    const paymentMethod = await PaymentMethod.findByPk(id)
    if (!paymentMethod) {
      throw new ErrorRes(404,'Phương thức không tồn tại')
    }
    await paymentMethod.destroy()
    return {
      message: "Xóa thành công",
    };
  } catch (error) {
    throw error;
  }
};
const paymentVNPay = async (orderId, code, tranCode) => {
  try {
    if (code === "00") {
      const order = await Order.findByPk(orderId);
      if (!order) {
        throw new ErrorRes(404, "Đơn hàng không tồn tại");
      }
      order.payment_status = "paid";
      // order.status = 'processing'
      await order.save();
      const payment = await Payment.findOne({
        where: {
          order_id: orderId,
        }
      })
      if (!payment) {
        throw new ErrorRes(404, "Thanh toán không tồn tại");
      }
      payment.transaction_id = tranCode;
      payment.status = 'completed';
      await payment.save();
    }
    return {
      status: "success",
      message: "Thanh toán đơn hàng thành công",
    };
  } catch (error) {
    throw error;
  }
};

const getListPayment = async({
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
    const { count, rows } = await Payment.findAndCountAll({
      where,
      ...queries
    });
    return {
        status: 'success',
        total: count,
        items: rows,
        totalPages: Math.ceil(count / limit),
        currentPage: +page,
      };
  } catch (error) {
    throw error
  }
}
const getPaymentById = async(id) => {
  try {
    const payment = await Payment.findByPk(id)
    if(!payment) {
      throw new ErrorRes(404,'Thanh toán không tồn tại')
    
    }
    return {
      status: 'success',
      payment
    }
  } catch (error) {
    throw error
  }
}
const createPayment = async(paymentData) => {
  try {
    const payment = await Payment.create(paymentData)
    return {
      status: 'success',
      message:'Thêm thanh toán thành công',
      payment
    }
  } catch (error) {
    throw error
  }
}
const updatePayment = async(id,paymentData) => {
  try {
    const payment = await Payment.findByPk(id)
    if(!payment) {
      throw new ErrorRes(404,'Thanh toán không tồn tại')
    }
    const updatedPayment = await payment.update(paymentData)
    return {
      status: 'success',
      payment: updatedPayment
    }
  } catch (error) {
    throw error
  }
}
const deletePayment = async(id) => {
  try {
    const payment = await Payment.findByPk(id)
    if(!payment) {
      throw new ErrorRes(404,'Thanh toán không tồn tại')
    }
    await payment.destroy()
    return {
      status: 'success',
      message: 'Xoá thành công'
    }
  } catch (error) {
    throw error
  }
}
module.exports = {
  paymentVNPay,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  getPaymentMethod,
  getListPayment,
  getPaymentById,
  updatePayment,
  deletePayment,
  createPayment
};
