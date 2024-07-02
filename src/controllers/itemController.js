const itemService = require('../services/itemService')
const cloudinary = require('cloudinary').v2;

const listItem  = async(req , res) => {
    try {
        const listItem = await itemService.getAllItems()
        res.status(200).json(listItem);
    } catch (error) {
        console.error('Error :', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const listItemById  = async(req , res) => {
    try {
        
        const pageItem = await itemService.getPageItem(req.query)
        return res.status(200).json(pageItem);
    } catch (error) {
        console.error('Error :', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const itemById = async(req, res) => {
    try {
        const {id} = req.params;
        const item = await itemService.getItemById(id);
        return res.status(200).json(item);
    } catch (error) {
        console.error('Error :', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const createItem = async(req ,res) =>{
    try {
        const itemData = req.body
        const files = req.files
        // Lấy đường dẫn của thumbnail và các ảnh chi tiết
        const thumbnail = files.thumbnail ? files.thumbnail[0].path : null;
        const images = files.images ? files.images.map(file => file.path) : [];
         // Thêm đường dẫn thumbnail và images vào itemData
         itemData.thumbnail = thumbnail;
         itemData.images = images;

        const newItem = await itemService.createItem(itemData)
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Error :', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const updateItem = async(req ,res) =>{
    try {
        const {id} = req.params
        const itemData = req.body
        const updateItem = await itemService.updateItem(id , itemData)

        return res.status(200).json(updateItem);
    } catch (error) {
        console.error('Error :', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const deleteItem = async(req,res,next) => {
    try {
        const {id} = req.params
        await itemService.deleteItem(id)
        return res.status(200).json({message: 'Item deleted successfully'})
    } catch (error) {
        next(error)
    }
}

module.exports = {
    listItem,
    listItemById,
    itemById,
    createItem,
    updateItem,
    deleteItem,
    
}
