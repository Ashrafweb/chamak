"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReceiptStatus = exports.uploadReceipt = void 0;
const prismaClient_1 = __importDefault(require("../models/prismaClient")); // Prisma client instance
const zod_1 = require("zod");
// Zod validation for the receipt response
const receiptResponseSchema = zod_1.z.object({
    id: zod_1.z.number().int(),
    bookingId: zod_1.z.number().int(),
    receiptUrl: zod_1.z.string(),
    status: zod_1.z.enum(["PENDING", "VERIFIED", "REJECTED"]),
    verifiedAt: zod_1.z.string().nullable(),
});
// Controller to handle file upload for the receipt
const uploadReceipt = async (req, res) => {
    // Check if the file is available in the request
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    const { bookingId } = req.body;
    try {
        // 1. Check if the booking exists
        const booking = await prismaClient_1.default.booking.findUnique({
            where: { id: bookingId },
        });
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        // 2. Save receipt information to the database
        const receipt = await prismaClient_1.default.receipt.create({
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
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Error uploading receipt", error: error.message });
    }
};
exports.uploadReceipt = uploadReceipt;
// Controller to update receipt status (admin functionality)
const updateReceiptStatus = async (req, res) => {
    const { receiptId, status, } = req.body;
    try {
        // 1. Check if the receipt exists
        const receipt = await prismaClient_1.default.receipt.findUnique({
            where: { id: receiptId },
        });
        if (!receipt) {
            return res.status(404).json({ message: "Receipt not found" });
        }
        // 2. Update the receipt status
        const updatedReceipt = await prismaClient_1.default.receipt.update({
            where: { id: receiptId },
            data: {
                status,
                verifiedAt: status === "VERIFIED" ? new Date().toISOString() : null,
            },
        });
        res.status(200).json(updatedReceipt);
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Error updating receipt status", error: error.message });
    }
};
exports.updateReceiptStatus = updateReceiptStatus;
