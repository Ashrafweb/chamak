"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingResponseSchema = exports.createBookingSchema = void 0;
const zod_1 = require("zod");
// Zod schema for the booking creation request
exports.createBookingSchema = zod_1.z.object({
    userId: zod_1.z
        .number()
        .int()
        .positive()
        .min(1, "User ID must be a positive integer"),
    instrumentId: zod_1.z
        .number()
        .int()
        .positive()
        .min(1, "Instrument ID must be a positive integer"),
    bookedUnits: zod_1.z
        .number()
        .int()
        .positive()
        .min(1, "Booked units must be a positive integer"),
});
// Zod schema for the booking response
exports.bookingResponseSchema = zod_1.z.object({
    id: zod_1.z.number().int(),
    userId: zod_1.z.number().int(),
    instrumentId: zod_1.z.number().int(),
    bookedUnits: zod_1.z.number().int(),
    status: zod_1.z.enum(["PENDING", "PURCHASED", "EXPIRED"]),
    bookingTime: zod_1.z.date(),
    expiresAt: zod_1.z.date(),
});
