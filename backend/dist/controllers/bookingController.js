"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBookingsByUserId = exports.getAllBookings = exports.updateBookingStatus = exports.createBooking = void 0;
const prismaClient_1 = __importDefault(require("../models/prismaClient"));
const validators_1 = require("../libs/validators"); // Import the Zod schemas and type
// Create a new booking
const createBooking = async (req, res) => {
    // Validate the request body with Zod
    const parsed = validators_1.createBookingSchema.safeParse(req.body);
    console.log(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            message: "Validation failed",
            errors: parsed.error.errors,
        });
    }
    const { userId, instrumentId, bookedUnits } = parsed.data;
    try {
        // Fetch the instrument to ensure it exists
        const instrument = await prismaClient_1.default.instrument.findUnique({
            where: { id: instrumentId },
        });
        if (!instrument) {
            return res.status(404).json({ message: "Instrument not found" });
        }
        // Check if there are enough available units
        if (instrument.availableUnits < bookedUnits) {
            return res
                .status(400)
                .json({ message: "Insufficient available units for booking" });
        }
        // Start a transaction to ensure concurrency control
        const bookingTransaction = await prismaClient_1.default.$transaction(async (prisma) => {
            // Lock the instrument to prevent race conditions
            const updatedInstrument = await prisma.instrument.update({
                where: { id: instrumentId },
                data: {
                    availableUnits: instrument.availableUnits - bookedUnits, // Update available units
                },
            });
            // Check if the instrument's available units were changed (concurrency issue)
            if (updatedInstrument.availableUnits < 0) {
                throw new Error("Concurrency error: Not enough units available");
            }
            // Create the booking in the database
            const booking = await prisma.booking.create({
                data: {
                    userId,
                    instrumentId,
                    bookedUnits,
                    status: "PENDING", // Booking is pending until verified
                    bookingTime: new Date(),
                    expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours expiry time
                },
            });
            // Return the booking
            return booking;
        });
        // Type-safe the response with Zod validation and BookingResponse type
        res
            .status(201)
            .json({ message: "Booking Successful", data: bookingTransaction });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Error processing the booking", error: error.message });
    }
};
exports.createBooking = createBooking;
// Update booking status (admin functionality)
const updateBookingStatus = async (req, res) => {
    const { bookingId, receiptId, status, } = req.body;
    if (!bookingId || !status || !receiptId) {
        return res
            .status(400)
            .json({ message: "Booking ID , Receipt ID and status are required" });
    }
    try {
        // 1. Check if the booking exists
        const booking = await prismaClient_1.default.booking.findUnique({
            where: { id: bookingId },
        });
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        // 2. Update the booking status
        const updatedBooking = await prismaClient_1.default.booking.update({
            where: { id: bookingId },
            data: { status: status === "VERIFIED" ? "PURCHASED" : "REJECTED" },
        });
        // 2. Update the receipt status
        const receipt = await prismaClient_1.default.receipt.findUnique({
            where: { id: receiptId },
        });
        if (!receipt) {
            return res.status(404).json({ message: "Receipt not found" });
        }
        const updatedReceipt = await prismaClient_1.default.receipt.update({
            where: { id: receiptId },
            data: {
                status,
                verifiedAt: status === "VERIFIED" ? new Date().toISOString() : null,
            },
        });
        res.status(200).json({ updatedBooking, updatedReceipt });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Error updating booking status", error: error.message });
    }
};
exports.updateBookingStatus = updateBookingStatus;
// Function to get all bookings (for admin)
const getAllBookings = async (req, res) => {
    try {
        const bookings = await prismaClient_1.default.booking.findMany({
            include: {
                receipts: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        username: true,
                    },
                },
            },
        });
        // Respond with the bookings and their receipts
        res.status(200).json(bookings);
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Error fetching bookings", error: error.message });
    }
};
exports.getAllBookings = getAllBookings;
// Function to get all bookings for a specific user
const getAllBookingsByUserId = async (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }
    try {
        const bookings = await prismaClient_1.default.booking.findMany({
            where: { userId },
            include: {
                instrument: true,
                receipts: true,
            },
        });
        res.status(200).json(bookings);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error fetching user bookings",
            error: error.message,
        });
    }
};
exports.getAllBookingsByUserId = getAllBookingsByUserId;
