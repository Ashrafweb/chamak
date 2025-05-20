import { Request, Response } from "express";
import { z } from "zod";
import prisma from "../models/prismaClient";
import { createBookingSchema, bookingResponseSchema } from "../libs/validators"; // Import the Zod schemas and type
import { BookingResponse } from "../types";

// Create a new booking
export const createBooking = async (req: Request, res: Response) => {
	// Validate the request body with Zod
	const parsed = createBookingSchema.safeParse(req.body);

	if (!parsed.success) {
		return res.status(400).json({
			message: "Validation failed",
			errors: parsed.error.errors,
		});
	}

	const { userId, instrumentId, bookedUnits } = parsed.data;

	try {
		// Fetch the instrument to ensure it exists
		const instrument = await prisma.instrument.findUnique({
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
		const bookingTransaction = await prisma.$transaction(async (prisma) => {
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
		const parsedBooking: BookingResponse =
			bookingResponseSchema.parse(bookingTransaction);

		res.status(201).json(parsedBooking);
	} catch (error: any) {
		console.error(error);
		res
			.status(500)
			.json({ message: "Error processing the booking", error: error.message });
	}
};

// Update booking status (admin functionality)
export const updateBookingStatus = async (req: Request, res: Response) => {
	const {
		bookingId,
		status,
	}: { bookingId: number; status: "PENDING" | "PURCHASED" | "EXPIRED" } =
		req.body;

	if (!bookingId || !status) {
		return res
			.status(400)
			.json({ message: "Booking ID and status are required" });
	}

	try {
		// 1. Check if the booking exists
		const booking = await prisma.booking.findUnique({
			where: { id: bookingId },
		});

		if (!booking) {
			return res.status(404).json({ message: "Booking not found" });
		}

		// 2. Update the booking status
		const updatedBooking = await prisma.booking.update({
			where: { id: bookingId },
			data: { status },
		});

		res.status(200).json(updatedBooking);
	} catch (error: any) {
		console.error(error);
		res
			.status(500)
			.json({ message: "Error updating booking status", error: error.message });
	}
};

// Function to get all bookings (for admin)
export const getAllBookings = async (req: Request, res: Response) => {
	try {
		const bookings = await prisma.booking.findMany();
		res.status(200).json(bookings);
	} catch (error: any) {
		console.error(error);
		res
			.status(500)
			.json({ message: "Error fetching bookings", error: error.message });
	}
};
