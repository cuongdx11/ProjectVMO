const Review = require("../models/reviewModel");
const ErrorRes = require("../helpers/ErrorRes");

const getReviews = async ({
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
    const {count,rows } = await Review.findAndCountAll({
      where,
      ...queries,
    });
    return {
      status: "success",
      total: count,
      reviews: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: +page,
    };
  } catch (error) {
    throw error;
  }
};

const getReviewsById = async (id) => {
  try {
    const review = await Review.findByPk(id);
    if (!review) {
      throw new ErrorRes(404, "Đánh giá không tồn tại");
    }
    return review;
  } catch (error) {
    throw error;
  }
};

const createReview = async (reviewData) => {
  try {
    const { user_id, item_id, rating } = reviewData;
    if (!user_id || !item_id || !rating) {
      throw new ErrorRes(400, "Thiếu dữ liệu bắt buộc");
    }
    const review = await Review.create(reviewData);
    return review;
  } catch (error) {
    throw error;
  }
};

const updateReview = async (id, reviewData) => {
  try {
    const review = await Review.findByPk(id);
    if (!review) {
      throw new ErrorRes(404, "Đánh giá không tồn tại");
    }
    const updateReview = await review.update(reviewData);
    return updateReview;
  } catch (error) {
    throw error;
  }
};
const deleteReview = async (id) => {
  try {
    const review = await Review.findByPk(id);
    if (!review) {
      throw new ErrorRes(404, "Đánh giá không tồn tại");
    }
    await review.destroy();
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getReviews,
  getReviewsById,
  createReview,
  updateReview,
  deleteReview,
};
