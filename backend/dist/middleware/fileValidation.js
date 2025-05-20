"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileValidationMiddleware = void 0;
const fileValidationMiddleware = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    // You can add more checks here if needed, for example, checking file size, type, etc.
    const allowedFileTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedFileTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ message: "Only image files are allowed" });
    }
    next();
};
exports.fileValidationMiddleware = fileValidationMiddleware;
