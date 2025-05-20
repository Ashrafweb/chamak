import express from "express";
import "./libs/cronJob";
import IntrumentsRoutes from "./routes/instrumentRoutes";
import userRouter from "./routes/userRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

const env = process.env.NODE_ENV || "development";

const app = express();
app.use(
	cors({
		origin: ["http://localhost:5173", "*"],
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		credentials: true,
		allowedHeaders: ["Content-Type"],
		exposedHeaders: ["Content-Type"],
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/instruments", IntrumentsRoutes);
app.use("/api/users", userRouter);

app.use("/api/bookings", bookingRoutes);
//app.use('/api/receipts', receiptRoutes);

app.listen(4000, () => {
	console.log("Server is running on http://localhost:4000");
});
