const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png"],
  params: {
    folder: "vmo_image",
  },
});
const uploadCloud = multer({ storage });

const uploadImage = async (imagePath) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "vmo_image",
      allowed_formats: ["jpg", "png"]
    }); // Upload ảnh từ máy lên Cloudinary với cấu hình
    return result.secure_url; // Trả về URL bảo mật của ảnh đã upload
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};


module.exports = uploadImage
