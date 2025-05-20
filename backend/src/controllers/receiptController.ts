import { Request, Response } from "express";
import prisma from "../models/prismaClient"; // Prisma client instance
import { z } from "zod";
import path from "path";
import { Receipt } from "../types";

// Zod validation for the receipt response
const receiptResponseSchema = z.object({
	id: z.number().int(),
	bookingId: z.number().int(),
	receiptUrl: z.string(),
	status: z.enum(["PENDING", "VERIFIED", "REJECTED"]),
	verifiedAt: z.string().nullable(),
});

// Controller to handle file upload for the receipt
export const uploadReceipt = async (req: Request, res: Response) => {
	// Check if the file is available in the request
	if (!req.file) {
		return res.status(400).json({ message: "No file uploaded" });
	}

	const { bookingId }: { bookingId: number } = req.body;

	try {
		// 1. Check if the booking exists
		const booking = await prisma.booking.findUnique({
			where: { id: bookingId },
		});

		if (!booking) {
			return res.status(404).json({ message: "Booking not found" });
		}

		// 2. Save receipt information to the database
		const receipt: Receipt = await prisma.receipt.create({
			data: {
				bookingId: booking.id,
				userId: booking.userId,
				receiptUrl: req.file.path, // The path to the uploaded file
				status: "PENDING", // Initial status is PENDING
			},
		});

		// 3. Respond with the receipt data
		const parsedReceipt = receiptResponseSchema.parse(receipt);
		res.status(201).json(parsedReceipt);
	} catch (error: any) {
		console.error(error);
		res
			.status(500)
			.json({ message: "Error uploading receipt", error: error.message });
	}
};

// Controller to update receipt status (admin functionality)
export const updateReceiptStatus = async (req: Request, res: Response) => {
	const {
		receiptId,
		status,
	}: { receiptId: number; status: "PENDING" | "VERIFIED" | "REJECTED" } =
		req.body;

	try {
		// 1. Check if the receipt exists
		const receipt = await prisma.receipt.findUnique({
			where: { id: receiptId },
		});

		if (!receipt) {
			return res.status(404).json({ message: "Receipt not found" });
		}

		// 2. Update the receipt status
		const updatedReceipt = await prisma.receipt.update({
			where: { id: receiptId },
			data: {
				status,
				verifiedAt: status === "VERIFIED" ? new Date().toISOString() : null,
			},
		});

		res.status(200).json(updatedReceipt);
	} catch (error: any) {
		console.error(error);
		res
			.status(500)
			.json({ message: "Error updating receipt status", error: error.message });
	}
};
