const Category = require('../models/categoryModel')

const createCategory = async (categoryData) => {
    try {
        const newCategory = await Category.create(categoryData)
        return newCategory

    } catch (error) {
        throw new Error(`Error creating category: ${error.message}`)
    }
}
const getCategoryById = async (id) => {
    try {
        const category = await Category.findByPk(id)
        if(!category){
            throw new Error('Category not found')
        }
        return category;
    } catch (error) {
        throw new Error(`Error fetching category`)
    }
}

const updateCategory = async (id,categoryData) => {
    try {
        const category = await getCategoryById(id)
        const updateCategory = await category.update(categoryData)
        return updateCategory;
    } catch (error) {
        throw new Error(`Error updating category`)
    }
}
const deleteCategory = async (id) => {
    try {
        const category = await getCategoryById(id)
        await category.destroy()
        return { message: 'Category deleted successfully' }
    } catch (error) {
        throw new Error(`Error deleting category`)
    }
}
module.exports = {
    createCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
}