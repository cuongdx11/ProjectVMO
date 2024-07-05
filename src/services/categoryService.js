const ErrorRes = require('../helpers/ErrorRes')
const Category = require('../models/categoryModel')

const createCategory = async (categoryData) => {
    try {
        const {name,position} = categoryData
        if(!name || !position){
            throw new ErrorRes(400 , 'Thiếu trường bắt buộc')
        }
        const newCategory = await Category.create(categoryData)
        return {
            status : 'success',
            message :'Tạo mới danh mục thành công',
            data : newCategory
        }

    } catch (error) {
        throw error
    }
}
const getCategoryById = async (id) => {
    try {
        const category = await Category.findByPk(id)
        if(!category){
            throw new ErrorRes(404,'Danh mục không tồn tại')
        }
        return {
            status : 'success',
            message :'Lấy danh mục thành công',
            data : category
        }
    } catch (error) {
        throw error
    }
}

const updateCategory = async (id,categoryData) => {
    try {
        if(!id){
            throw new ErrorRes(400 , 'Thiếu trường bắt buộc')
        }
        const category = await Category.findByPk(id)
        if(!category){
            throw new ErrorRes(404,'Danh mục không tồn tại')
        }
        const updateCategory = await category.update(categoryData)
        return {
            status : 'success',
            message :'Cập nhật danh mục thành công',
            data : updateCategory
        }
    } catch (error) {
        throw error
    }
}
const deleteCategory = async (id) => {
    try {
        if(!id){
            throw new ErrorRes(400 , 'Thiếu trường bắt buộc')
        }
        const category = await getCategoryById(id)
        await category.destroy()
        return {
            status : 'success',
            message :'Xóa danh mục thành công',
        }
    } catch (error) {
        throw error
    }
}
const getCatgories = async({ page = 1, order = null,filter = null, orderBy = 'asc', limit = process.env.LIMIT, name = null, ...query }) => {
    try {
        const queries = { raw: true, nest: true }; // không lấy instance, lấy data từ bảng khác
        const offset = (page <= 1) ? 0 : (page - 1);
        const flimit = +limit;
        queries.offset = offset * flimit;
        queries.limit = flimit;
        let sequelizeOrder = []
        if (order && orderBy) {
            const orderDirection = orderBy.toUpperCase();
            sequelizeOrder.push([order, orderDirection]);
            queries.order = sequelizeOrder
        }
        if (name) query.name = { [Op.substring]: name };

        if (filter && typeof filter === 'object') {
            Object.assign(where, filter);
        }
        const {count , rows} = await Category.findAndCountAll({
            where : query,
            ...queries
        })
        return {
            status : 'success',
            items: rows,
            total: count,
            totalPages: Math.ceil(count / flimit),
            currentPage: page
        };
    } catch (error) {
        throw error
    }
}
module.exports = {
    createCategory,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getCatgories
}