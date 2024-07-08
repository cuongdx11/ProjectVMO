const category = require('../models/categoryModel')
const categoryService = require('../services/categoryService')
const getCategories = async(req,res,next) => {
    try {
        const categories = await categoryService.getCatgories(req.query)
        res.status(200).json(categories);
    } catch (error) {
        next(error)
    }
}

const createCategory = async (req, res,next) => {
    try {
        const categoryData = req.body;
        const file = req.file
        const banner_image = file.path
        categoryData.banner_image = banner_image
        const newCategory = await categoryService.createCategory(categoryData);
        return res.status(201).json(newCategory);
    } catch (error) {
        next(error)
    }
};

const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryService.getCategoryById(id);
        return res.status(200).json(category);
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
};

const updateCategory = async (req, res,next) => {
    try {
        const { id } = req.params;
        const file = req.file
        const banner_image = file.path
        const categoryData = req.body;
        categoryData.banner_image = banner_image
        const updatedCategory = await categoryService.updateCategory(id, categoryData);
        return res.status(200).json(updatedCategory);
    } catch (error) {
        next(error)
    }
};

const deleteCategory = async (req, res,next) => {
    try {
        const { id } = req.params;
        await categoryService.deleteCategory(id);
        return res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        next(error)
    }
};

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById
}