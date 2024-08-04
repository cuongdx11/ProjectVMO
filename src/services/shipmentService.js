const Shipment = require("../models/shipmentModel");
const ShippingMethod = require("../models/shippingMethodModel");
const { sequelize } = require("../config/dbConfig");
const ErrorRes = require("../helpers/ErrorRes");

const getShippingMethod = async ({
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
    const { count, rows } = await ShippingMethod.findAndCountAll({
      ...queries,
      where,
    });
    return {
      status: "success",
      total: count,
      shippingMethods: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: +page,
    };
  } catch (error) {
    throw error;
  }
};
const createShippingMethod = async (shippingMethodData) => {
  const transaction = await sequelize.transaction();
  try {
    const shippingMethod = await ShippingMethod.create(
      shippingMethodData,
      transaction
    );
    await transaction.commit();
    return shippingMethod;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
const updateShippingMethod = async (id, shippingMethodData) => {
  try {
    const shippingMethod = await ShippingMethod.findByPk(id);
    if (!shippingMethod) {
      throw new ErrorRes(404, "Phương thức không tồn tại");
    }
    const updatedShippingMethod = await shippingMethod.update(
      shippingMethodData
    );
    return updatedShippingMethod;
  } catch (error) {
    throw error;
  }
};
const deleteShippingMethod = async (id) => {
  try {
    const shippingMethod = await ShippingMethod.findByPk(id);
    if (!shippingMethod) {
      throw new ErrorRes(404, "Phương thức không tồn tại");
    }
    await shippingMethod.destroy();
    return { status: "success", message: "Xóa thành công" };
  } catch (error) {
    throw error;
  }
};

const getShipment = async ({
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
    const { count, rows } = await Shipment.findAndCountAll({
      ...queries,
      where,
    });
    return {
      status: "success",
      total: count,
      shipments: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: +page,
    };
  } catch (error) {
    throw error;
  }
};
const getShipmentById = async (id) => {
  try {
    const { id } = req.params;
    const shipment = await Shipment.findByPk(id);
    return {
      status: "success",
      shipment,
    };
  } catch (error) {
    throw error;
  }
};
const createShipment = async (shipmentData) => {
  try {
    const shipment = await Shipment.create(shipmentData);
    return {
      status: "success",
      message: "Tạo vận chuyển thành công",
      shipment,
    };
  } catch (error) {
    throw error;
  }
};
const updateShipment = async (id, shipmentData) => {
  try {
    const shipment = await Shipment.findByPk(id);
    if (!shipment) {
      throw new ErrorRes(404, "Vận chuyển không tồn tại");
    }
    const updatedShipment = await shipment.update(shipmentData);
    return {
      status: "success",
      message: "Cập nhật vận chuyển thành công",
      updatedShipment,
    };
  } catch (error) {
    throw error;
  }
};
const deleteShipment = async(id) => {
  try {
    const shipment = await Shipment.findByPk(id)
    if (!shipment) {
      throw new ErrorRes(404, "Vận chuyển không tồn tại");
    }
    await shipment.destroy()
    return {
      status: "success",
      message: "Xóa vận chuyển thành công",
    }
  } catch (error) {
    throw error
  }
}

module.exports = {
  getShippingMethod,
  createShippingMethod,
  updateShippingMethod,
  deleteShippingMethod,
  getShipment,
  createShipment,
  getShipmentById,
  updateShipment,
  deleteShipment
};
