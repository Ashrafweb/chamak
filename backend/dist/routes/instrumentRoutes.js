"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const instrumentController_1 = require("../controllers/instrumentController");
const IntrumentsRoutes = express_1.default.Router();
// Route to get all instruments
IntrumentsRoutes.get("/", instrumentController_1.getInstruments);
// Route to get a single instrument by its ID
IntrumentsRoutes.get("/:id", instrumentController_1.getInstrumentsById);
// Route to create a new instrument
IntrumentsRoutes.post("/create", instrumentController_1.createInstrument);
exports.default = IntrumentsRoutes;
