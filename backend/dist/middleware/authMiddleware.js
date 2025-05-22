"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = exports.authMiddleware = void 0;
const prismaClient_1 = __importDefault(require("../models/prismaClient"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bcrypt = require("bcrypt");
// Basic Auth middleware
const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    const JWT_SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";
    if (!token) {
        return res.status(401).json({ message: "Authentication token missing" });
    }
    try {
        // Check if user exists in the database
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET_KEY);
        console.log(decoded);
        const user = await prismaClient_1.default.user.findUnique({
            where: { id: decoded.id, username: decoded.username }, // Use user ID from decoded token
        });
        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
        }
        // Attach the user to the request object for use in other routes
        req.user = { ...user, id: user.id };
        // Proceed to the next middleware/route
        next();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during authentication" });
    }
};
exports.authMiddleware = authMiddleware;
const adminMiddleware = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Admin access required" });
    }
    next();
};
exports.adminMiddleware = adminMiddleware;
