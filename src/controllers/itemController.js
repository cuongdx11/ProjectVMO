const itemService = require('../services/itemService')


const listItem  = async(req , res,next) => {
    try {
        const listItem = await itemService.getAllItems()
        res.status(200).json(listItem);
    } catch (error) {
        console.error('Error :', error);
        next(error)    }
}

const listItemById  = async(req , res,next) => {
    try {
        
        const pageItem = await itemService.getPageItem(req.query)
        return res.status(200).json(pageItem);
    } catch (error) {
        console.error('Error :', error);
        next(error)    }
}

const itemById = async(req, res,next) => {
    try {
        const {id} = req.params;
        const flashsale = req.flashsale
        const item = await itemService.getItemById(id);
        return res.status(200).json({
            item,
            flashsale
        });
    } catch (error) {
        next(error)
    }
}

const createItem = async(req ,res,next) =>{
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
        next(error)
    }
}

const updateItem = async(req ,res,next) =>{
    try {
        const {id} = req.params
        const itemData = req.body
        const files = req.files
        const thumbnail = files.thumbnail ? files.thumbnail[0].path : null;
        const images = files.images ? files.images.map(file => file.path) : [];
         // Thêm đường dẫn thumbnail và images vào itemData
        itemData.thumbnail = thumbnail;
        itemData.images = images;
        const updateItem = await itemService.updateItem(id , itemData)

        return res.status(200).json(updateItem);
    } catch (error) {
        next(error)
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

const createItemsFromExcel = async(req,res,next) => {
    try {
        const fileBuffer = req.file.buffer; // Lấy dữ liệu của file từ buffer - Luu tam thoi du lieu vào RAM 
        await itemService.createItemsFromExcel(fileBuffer); // Truyền dữ liệu buffer cho service xử lý
        return res.status(200).json({message: 'Tạo các sản phẩm thành công'})
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
    createItemsFromExcel
    
}
