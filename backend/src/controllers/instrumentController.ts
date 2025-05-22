import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Function to get all instruments
export const getInstruments = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const instruments = await prisma.instrument.findMany({
			where: {
				availableUnits: {
					gt: 0, // Only fetch instruments that have available units
				},
			},
		});

		res.status(200).json(instruments);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error fetching instruments" });
	}
};

// Function to get a single instrument by its ID
export const getInstrumentsById = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { id } = req.params;

	try {
		const instrument = await prisma.instrument.findUnique({
			where: { id: id },
		});

		if (!instrument) {
			res.status(404).json({ message: "Instrument not found" });
			return;
		}

		res.status(200).json(instrument);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error fetching instrument by ID" });
	}
};

// Function to create a new instrument
export const createInstrument = async (
	req: Request,
	res: Response
): Promise<void> => {
	const {
		name,
		type,
		currentPrice,
		estimatedReturn,
		maturityTime,
		availableUnits,
		totalUnits,
		fractionalSupport,
	} = req.body;
	console.log(maturityTime);
	if (
		!name ||
		!type ||
		currentPrice === undefined || // Explicitly check for undefined
		estimatedReturn === undefined ||
		maturityTime === undefined ||
		availableUnits === undefined ||
		totalUnits === undefined
	) {
		console.log("Missing or invalid required fields");
		res
			.status(400)
			.json({ message: "Missing required fields or invalid values" });
		return;
	}

	if (
		currentPrice < 0 ||
		estimatedReturn < 0 ||
		maturityTime < 0 ||
		availableUnits < 0 ||
		totalUnits < 0
	) {
		console.log("Invalid number values");
		res.status(400).json({ message: "Values cannot be negative" });
		return;
	}

	try {
		const newInstrument = await prisma.instrument.create({
			data: {
				name,
				type,
				currentPrice,
				estimatedReturn,
				maturityTime,
				availableUnits,
				totalUnits,
				fractionalSupport: fractionalSupport ?? true, // Default fractionalSupport to true if not provided
			},
		});

		res.status(201).json(newInstrument);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error creating instrument" });
	}
};
