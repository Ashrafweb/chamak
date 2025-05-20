import express from "express";
import {
	createBooking,
	getAllBookings,
	updateBookingStatus,
} from "../controllers/bookingController";
const bookingRoutes = express.Router();

// Route to create a new booking with Zod validation
bookingRoutes.post("/book", (req, res) => {
	createBooking(req, res);
});

// Route to update booking status (admin only)
bookingRoutes.put("/status", (req, res) => {
	updateBookingStatus(req, res);
});

// Route to get all bookings (admin only)
bookingRoutes.get("/", getAllBookings);

export default bookingRoutes;
