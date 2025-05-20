"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookingController_1 = require("../controllers/bookingController");
const bookingRoutes = express_1.default.Router();
// Route to create a new booking with Zod validation
bookingRoutes.post("/book", (req, res) => {
    (0, bookingController_1.createBooking)(req, res);
});
// Route to update booking status (admin only)
bookingRoutes.put("/status", (req, res) => {
    (0, bookingController_1.updateBookingStatus)(req, res);
});
// Route to get all bookings (admin only)
bookingRoutes.get("/", bookingController_1.getAllBookings);
exports.default = bookingRoutes;
