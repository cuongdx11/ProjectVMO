const category = require('../models/categoryModel')
const categoryService = require('../services/categoryService')
const getCategories = async(req,res) => {
    try {
        const categories = await categoryService.getCatgories(req.query)
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error getting categories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const createCategory = async (req, res) => {
    try {
        const categoryData = req.body;
        const file = req.file
        const banner_image = file.path
        categoryData.banner_image = banner_image
        const newCategory = await categoryService.createCategory(categoryData);
        return res.status(201).json(newCategory);
    } catch (error) {
        return res.status(500).json({ error: error.message });
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

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const file = req.file
        const banner_image = file.path
        const categoryData = req.body;
        categoryData.banner_image = banner_image
        const updatedCategory = await categoryService.updateCategory(id, categoryData);
        return res.status(200).json(updatedCategory);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await categoryService.deleteCategory(id);
        return res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById
}