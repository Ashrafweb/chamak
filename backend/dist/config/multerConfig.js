"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const cloudinary_1 = require("cloudinary");
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Define allowed file types (e.g., only images)
const allowedFileTypes = /jpeg|jpg|png|gif/;
// Check if the 'uploads/receipts' directory exists, if not, create it
const uploadsDir = path_1.default.join(__dirname, "../public/uploads/receipts");
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
// Configure Multer storage
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
// Function to upload to Cloudinary
const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary_1.v2.uploader.upload(file.path);
        // Delete the local file after uploading to Cloudinary
        fs_1.default.unlinkSync(file.path);
        return result.secure_url;
    }
    catch (error) {
        throw new Error("Error uploading to Cloudinary");
    }
};
// Multer file filter for validating file types
const fileFilter = (req, file, cb) => {
    const extname = allowedFileTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true); // Allow the file
    }
    else {
        cb(new Error("Only image files are allowed.")); // Reject the file
    }
};
// Multer upload middleware with file size limit and file validation
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit the file size to 5MB
});
exports.default = upload;
