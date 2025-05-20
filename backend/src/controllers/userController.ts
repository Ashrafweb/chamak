import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../models/prismaClient";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
// Helper function to set cookie
const setTokenCookie = (res: Response, token: string) => {
	res.cookie("token", token, {
		httpOnly: true, // Makes the cookie HTTP-only
		secure: process.env.NODE_ENV === "production", // Use secure cookies in production
		maxAge: 3600000, // Cookie expiration time (1 hour)
	});
};
// Create a new user
export const createUser = async (req: Request, res: Response) => {
	const { username, email, password } = req.body;

	if (!username || !email || !password) {
		return res
			.status(400)
			.json({ message: "Username, email, and password are required" });
	}

	try {
		// Check if the user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}

		// Hash the password before saving it
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create the user
		const user = await prisma.user.create({
			data: {
				username,
				email,
				password: hashedPassword,
				role: email === "ash@gmail.com" ? "ADMIN" : "USER", // Default to regular user role
			},
		});

		// Generate JWT token
		const token = jwt.sign(
			{ userId: user.id, username: user.username },
			JWT_SECRET,
			{ expiresIn: "1h" }
		);
		setTokenCookie(res, token);
		res.status(201).json({
			message: "User created successfully",
			data: {
				id: user.id,
				username: user.username,
				email: user.email,
				isAdmin: user?.role,
			},
			token,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error while creating user" });
	}
};

// Get the authenticated user's details
export const getUser = async (req: Request, res: Response) => {
	try {
		// Fetch the user from the database using the authenticated user ID
		const user = await prisma.user.findUnique({
			where: { id: req.user?.id ? Number(req.user.id) : undefined },
		});

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json(user);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error fetching user details" });
	}
};

// Login a user
export const loginUser = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ message: "Email and password are required" });
	}

	try {
		// Find user by email
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// Compare the password with the stored hash
		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// Generate JWT token
		const token = jwt.sign(
			{ userId: user.id, username: user.username },
			JWT_SECRET,
			{ expiresIn: "1h" }
		);
		setTokenCookie(res, token);
		res.json({
			message: "Login successful",
			data: {
				id: user.id,
				username: user.username,
				email: user.email,
				isAdmin: user?.role,
			},
			token,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error during login" });
	}
};

// Logout the user (for this example, we will just send a message as JWT-based logout is handled by the client)
export const logoutUser = (req: Request, res: Response) => {
	res.json({ message: "Logged out successfully" });
};
