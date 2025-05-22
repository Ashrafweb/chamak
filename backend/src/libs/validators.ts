import { z } from "zod";

// Zod schema for the booking creation request
export const createBookingSchema = z.object({
	userId: z.string().min(1, "User ID must be a positive integer"),
	instrumentId: z.string().min(1, "Instrument ID must be a positive integer"),
	bookedUnits: z.number().positive(),
});

// Zod schema for the booking response
export const bookingResponseSchema = z.object({
	id: z.string(),
	userId: z.string(),
	instrumentId: z.string(),
	bookedUnits: z.number().int(),
	status: z.enum(["PENDING", "PURCHASED", "EXPIRED"]),
	bookingTime: z.date(),
	expiresAt: z.date(),
});
