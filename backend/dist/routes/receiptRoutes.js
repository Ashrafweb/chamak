"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fileUpload_1 = require("../controllers/fileUpload");
const receiptController_1 = require("../controllers/receiptController");
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
// Multer configuration for file uploads
const receiptRouter = express_1.default.Router();
// Route for uploading a receipt
receiptRouter.post("/upload", authMiddleware_1.authMiddleware, fileUpload_1.upload.single("receiptFile"), (req, res) => {
    (0, receiptController_1.uploadReceipt)(req, res);
});
exports.default = receiptRouter;
