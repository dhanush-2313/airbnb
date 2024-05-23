const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderLust_DEV',
      allowedFormats: ["png","jpg","jpeg"],
    },
  });

  const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // limit to 5MB
    }
});

module.exports = {cloudinary, storage,upload};