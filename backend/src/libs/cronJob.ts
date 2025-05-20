import cron from "node-cron";
import prisma from "../models/prismaClient"; // Import Prisma client

// Schedule a job to run every hour
cron.schedule("0 * * * *", async () => {
	try {
		// Get the current time
		const now = new Date();

		// Find all pending bookings older than 6 hours
		const pendingBookings = await prisma.booking.findMany({
			where: {
				status: "PENDING",
				expiresAt: {
					lt: now, // Find bookings where expiresAt is older than the current time
				},
			},
		});

		// If there are any pending bookings that have expired, update their status to 'EXPIRED'
		if (pendingBookings.length > 0) {
			const updatedBookings = await prisma.booking.updateMany({
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
	} catch (error) {
		console.error("Error updating expired bookings:", error);
	}
});
