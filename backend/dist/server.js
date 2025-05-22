"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("./libs/cronJob");
const instrumentRoutes_1 = __importDefault(require("./routes/instrumentRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
const receiptRoutes_1 = __importDefault(require("./routes/receiptRoutes"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const env = process.env.NODE_ENV || "development";
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "*"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type"],
    exposedHeaders: ["Content-Type"],
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Routes
app.use("/api/instruments", instrumentRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/bookings", bookingRoutes_1.default);
app.use("/api/bookings/receipt", receiptRoutes_1.default);
//app.use('/api/receipts', receiptRoutes);
app.listen(4000, () => {
    console.log("Server is running on http://localhost:4000");
});
