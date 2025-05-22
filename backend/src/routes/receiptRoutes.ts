import { upload } from "../controllers/fileUpload";
import { uploadReceipt } from "../controllers/receiptController";

import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
// Multer configuration for file uploads

const receiptRouter = express.Router();

// Route for uploading a receipt
receiptRouter.post(
	"/upload",
	authMiddleware,
	upload.single("receiptFile"),
	(req, res) => {
		uploadReceipt(req, res);
	}
);

export default receiptRouter;
