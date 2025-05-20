import express from "express";
import {
	getInstruments,
	getInstrumentsById,
	createInstrument,
} from "../controllers/instrumentController";

const IntrumentsRoutes = express.Router();

// Route to get all instruments
IntrumentsRoutes.get("/", getInstruments);

// Route to get a single instrument by its ID
IntrumentsRoutes.get("/:id", getInstrumentsById);

// Route to create a new instrument
IntrumentsRoutes.post("/create", createInstrument);

export default IntrumentsRoutes;
