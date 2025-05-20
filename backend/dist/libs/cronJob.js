"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const prismaClient_1 = __importDefault(require("../models/prismaClient")); // Import Prisma client
// Schedule a job to run every hour
node_cron_1.default.schedule("0 * * * *", async () => {
    try {
        // Get the current time
        const now = new Date();
        // Find all pending bookings older than 6 hours
        const pendingBookings = await prismaClient_1.default.booking.findMany({
            where: {
                status: "PENDING",
                expiresAt: {
                    lt: now, // Find bookings where expiresAt is older than the current time
                },
            },
        });
        // If there are any pending bookings that have expired, update their status to 'EXPIRED'
        if (pendingBookings.length > 0) {
            const updatedBookings = await prismaClient_1.default.booking.updateMany({
                where: {
                    id: {
                        in: pendingBookings.map((booking) => booking.id),
                    },
                },
                data: {
                    status: "EXPIRED",
                },
            });
            console.log(`Marked ${updatedBookings.count} bookings as EXPIRED.`);
        }
    }
    catch (error) {
        console.error("Error updating expired bookings:", error);
    }
});
