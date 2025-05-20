import multer from "multer";
import path from "path";

// Define allowed file types (e.g., only images)
const allowedFileTypes = /jpeg|jpg|png|gif/;

// Configure Multer storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		// Set the directory where files will be stored
		cb(null, "uploads/receipts/");
	},
	filename: (req, file, cb) => {
		// Generate a unique filename based on the timestamp and file extension
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(
			null,
			file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
		);
	},
});

// Multer file filter for validating file types
const fileFilter = (req: any, file: any, cb: any) => {
	const extname = allowedFileTypes.test(
		path.extname(file.originalname).toLowerCase()
	);
	const mimetype = allowedFileTypes.test(file.mimetype);

	if (extname && mimetype) {
		return cb(null, true); // Allow the file
	} else {
		cb(new Error("Only image files are allowed."));
	}
};

// Multer upload middleware with file size limit and file validation
const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: { fileSize: 5 * 1024 * 1024 }, // Limit the file size to 5MB
});

export default upload;
