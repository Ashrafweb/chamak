// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import prisma from "../models/prismaClient";
import { User } from "../types";
const bcrypt = require("bcrypt");
// Basic Auth middleware
export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const authHeader = req.headers["authorization"];

	if (!authHeader) {
		return res.status(401).json({ message: "Authorization header missing" });
	}

	const [, encodedCredentials] = authHeader.split(" "); // Authorization: Basic <base64-encoded-credentials>

	if (!encodedCredentials) {
		return res.status(401).json({ message: "Credentials missing" });
	}

	const credentials = Buffer.from(encodedCredentials, "base64").toString(
		"utf-8"
	);
	const [username, password] = credentials.split(":");

	if (!username || !password) {
		return res.status(400).json({ message: "Invalid credentials format" });
	}

	try {
		// Check if user exists in the database
		const user = await prisma.user.findUnique({
			where: { username },
		});

		if (!user) {
			return res.status(401).json({ message: "User not found" });
		}

		// Compare the password with the hashed password in the database
		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid password" });
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

// Type augmentation for Express Request object to include `user`
declare global {
	namespace Express {
		interface Request {
			user?: User;
		}
	}
}
