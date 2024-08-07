const Role = require("../models/roleModel");
const { sequelize } = require("../config/dbConfig");
const { Op } = require("sequelize");
const ErrorRes = require("../helpers/ErrorRes");

const createRole = async (roleData) => {
  const transaction = await sequelize.transaction();
  try {
    const role = await Role.create(roleData, { transaction });
    await transaction.commit();
    return role;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
const getAllRole = async ({
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
    const {count , rows} = await Role.findAndCountAll({
        where,
        ...queries
    });
    return {
        status: "success",
        roles: rows,
        total: count,
        totalPages: Math.ceil(count / limit),
        currentPage: +page,
    };
  } catch (error) {
    throw error
  }
};
const getRoleById = async (id) => {
  try {
    const role = await Role.findByPk(id);
    if (!role) {
      throw new ErrorRes(404, "Role không tồn tại");
    }
    return role;
  } catch (error) {
    throw error;
  }
};
const updateRole = async(id,roleData) => {
    try {
        const role = await Role.findByPk(id)
        if (!role) {
            throw new ErrorRes(404, "Role không tồn tại");
        }
        await role.update(roleData)
        return {
            status: "success",
            message: "Cập nhật Role thành công",
            data: role
        }
    } catch (error) {
        throw error
    }
}
const deleteRole = async(id) => {
    try {
        const role = await Role.findByPk(id)
        if (!role) {
            throw new ErrorRes(404, "Role không tồn tại");
        }
        await role.destroy()
        return {
            status: "success",
            message: "Xóa Role thành công"
        }
    } catch (error) {
        throw error
    }
}
module.exports = {
  createRole,
  getAllRole,
  getRoleById,
  updateRole,
  deleteRole
};
