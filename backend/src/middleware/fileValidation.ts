import { Request, Response, NextFunction } from "express";

const fileValidationMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
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

export { fileValidationMiddleware };
