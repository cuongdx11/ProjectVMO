const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpg', 'png'],
  params : {
    folder: 'vmo_image',
  }

});

const storageCategory = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpg', 'png'],
  params : {
    folder: 'vmo_category',
  }
});

const storageAvatar = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpg', 'png'],
  params : {
    folder: 'vmo_avatar',
  }
})

const uploadCloud = multer({ storage });

const uploadCategoryCloud = multer({storage:  storageCategory });

const uploadAvatarCloud = multer({storage : storageAvatar})

const uploadImageItem = uploadCloud.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]);
const uploadImageCategory = uploadCategoryCloud.single('banner_image')
const uploadImageAvatar = uploadAvatarCloud.single('avatar')

module.exports = {
  uploadImageItem,
  uploadImageCategory,
  uploadImageAvatar
};

