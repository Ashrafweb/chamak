// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import prisma from "../models/prismaClient";
import { User } from "../types";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const bcrypt = require("bcrypt");
// Basic Auth middleware
export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<any> => {
	const token = req.cookies.token;
	const JWT_SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";
	if (!token) {
		return res.status(401).json({ message: "Authentication token missing" });
	}

	try {
		// Check if user exists in the database
		const decoded = jwt.verify(token, JWT_SECRET_KEY as string) as {
			id: string;
			username: string;
		};

		console.log(decoded);
		const user = await prisma.user.findUnique({
			where: { id: decoded.id, username: decoded.username }, // Use user ID from decoded token
		});

		if (!user) {
			return res.status(401).json({ message: "Invalid token" });
		}

		// Attach the user to the request object for use in other routes
		req.user = { ...user, id: user.id };

		// Proceed to the next middleware/route
		next();
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error during authentication" });
	}
};

export const adminMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<any> => {
	if (!req.user) {
		return res.status(401).json({ message: "Authentication required" });
	}

	if (req.user.role !== "ADMIN") {
		return res.status(403).json({ message: "Admin access required" });
	}

	next();
};

// Type augmentation for Express Request object to include `user`
declare global {
	namespace Express {
		interface Request {
			user?: User;
		}
	}
}
