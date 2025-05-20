const express = require("express");
const {
	uploadReceipt,
	updateReceiptStatus,
} = require("../controllers/receiptController");
const upload = require("../config/multerConfig"); // Multer configuration for file uploads
const { adminRoleMiddleware } = require("../middleware/authMiddleware"); // Admin check middleware

const router = express.Router();

// Route for uploading a receipt
router.post("/upload", upload.single("receiptFile"), uploadReceipt);

// Route for updating receipt status (admin only)
router.put("/status", adminRoleMiddleware, updateReceiptStatus);

module.exports = router;
