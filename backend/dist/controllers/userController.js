"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.loginUser = exports.getUser = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaClient_1 = __importDefault(require("../models/prismaClient"));
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
// Helper function to set cookie
const setTokenCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true, // Makes the cookie HTTP-only
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        maxAge: 3600000, // Cookie expiration time (1 hour)
    });
};
// Create a new user
const createUser = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res
            .status(400)
            .json({ message: "Username, email, and password are required" });
    }
    try {
        // Check if the user already exists
        const existingUser = await prismaClient_1.default.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Hash the password before saving it
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Create the user
        const user = await prismaClient_1.default.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: email === "ash@gmail.com" ? "ADMIN" : "USER", // Default to regular user role
            },
        });
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while creating user" });
    }
};
exports.createUser = createUser;
// Get the authenticated user's details
const getUser = async (req, res) => {
    try {
        // Fetch the user from the database using the authenticated user ID
        const user = await prismaClient_1.default.user.findUnique({
            where: { id: req.user?.id ? Number(req.user.id) : undefined },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error fetching user details" });
    }
};
exports.getUser = getUser;
// Login a user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    try {
        // Find user by email
        const user = await prismaClient_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // Compare the password with the stored hash
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during login" });
    }
};
exports.loginUser = loginUser;
// Logout the user (for this example, we will just send a message as JWT-based logout is handled by the client)
const logoutUser = (req, res) => {
    res.json({ message: "Logged out successfully" });
};
exports.logoutUser = logoutUser;
