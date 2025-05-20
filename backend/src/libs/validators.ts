import { z } from "zod";

// Zod schema for the booking creation request
export const createBookingSchema = z.object({
	userId: z
		.number()
		.int()
		.positive()
		.min(1, "User ID must be a positive integer"),
	instrumentId: z
		.number()
		.int()
		.positive()
		.min(1, "Instrument ID must be a positive integer"),
	bookedUnits: z
		.number()
		.int()
		.positive()
		.min(1, "Booked units must be a positive integer"),
});

// Zod schema for the booking response
export const bookingResponseSchema = z.object({
	id: z.number().int(),
	userId: z.number().int(),
	instrumentId: z.number().int(),
	bookedUnits: z.number().int(),
	status: z.enum(["PENDING", "PURCHASED", "EXPIRED"]),
	bookingTime: z.date(),
	expiresAt: z.date(),
});
