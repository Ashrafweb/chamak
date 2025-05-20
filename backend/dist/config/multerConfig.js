"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Define allowed file types (e.g., only images)
const allowedFileTypes = /jpeg|jpg|png|gif/;
// Configure Multer storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // Set the directory where files will be stored
        cb(null, "uploads/receipts/");
    },
    filename: (req, file, cb) => {
        // Generate a unique filename based on the timestamp and file extension
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
// Multer file filter for validating file types
const fileFilter = (req, file, cb) => {
    const extname = allowedFileTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true); // Allow the file
    }
    else {
        cb(new Error("Only image files are allowed."));
    }
};
// Multer upload middleware with file size limit and file validation
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit the file size to 5MB
});
exports.default = upload;
