import express from "express";
import {
	createBooking,
	getAllBookings,
	getAllBookingsByUserId,
	updateBookingStatus,
} from "../controllers/bookingController";
import { adminMiddleware, authMiddleware } from "../middleware/authMiddleware";
const bookingRoutes = express.Router();

// Route to create a new booking with Zod validation
bookingRoutes.post("/book", authMiddleware, (req, res) => {
	createBooking(req, res);
});

// Route to update booking status (admin only)
bookingRoutes.put("/status", authMiddleware, adminMiddleware, (req, res) => {
	updateBookingStatus(req, res);
});

// Route to get all bookings (admin only)
bookingRoutes.get("/", authMiddleware, adminMiddleware, getAllBookings);
bookingRoutes.get("/user/:userId", (req, res) => {
	getAllBookingsByUserId(req, res);
});
export default bookingRoutes;
