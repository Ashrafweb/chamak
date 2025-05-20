interface Instrument {
	id: number;
	name: string;
	currentPrice: number;
	estimatedReturn: number;
	maturityTime: number;
	availableUnits: number;
	totalUnits: number;
	fractionalSupport: boolean;
	imageUrl?: string;
	status?: string;
}

interface InstrumentsState {
	availableInstruments: Instrument[];
	bookedInstruments: Instrument[];
	loading: boolean;
	error: string | null;
}
// Extend Express Request interface to include user property
declare global {
	namespace Express {
		interface Request {
			user?: User; // Attach User to request object
		}
	}
}

// --- User Types ---
export interface User {
	id: number; // User ID (from the database)
	username: string; // User's username
	email: string; // User's email
	password: string; // User's hashed password
	role: string; // User's role, e.g., "USER", "ADMIN"
}

export interface CreateUserBody {
	username: string; // The user's username
	email: string; // The user's email
	password: string; // The user's password
}

export interface LoginBody {
	email: string; // The user's email
	password: string; // The user's password
}

export interface UserResponse {
	id: number;
	username: string;
	email: string;
	role: string;
}

// --- Instrument Types ---
export interface Instrument {
	id: number; // Instrument ID (from the database)
	name: string; // Name of the instrument (e.g., "Government Bond A")
	type: string; // Type of the instrument (e.g., "BOND", "STOCK")
	currentPrice: number; // Current price of the instrument
	estimatedReturn: number; // Estimated return as a percentage (e.g., 5.5)
	maturityTime: number; // Maturity time in days (e.g., 365)
	availableUnits: number; // Available units for this instrument
	totalUnits: number; // Total units available for this instrument
	fractionalSupport: boolean; // Whether fractional purchases are allowed
}

export interface CreateInstrumentBody {
	name: string;
	type: string;
	currentPrice: number;
	estimatedReturn: number;
	maturityTime: number;
	availableUnits: number;
	totalUnits: number;
	fractionalSupport: boolean;
}

export interface InstrumentResponse {
	id: number;
	name: string;
	type: string;
	currentPrice: number;
	estimatedReturn: number;
	maturityTime: number;
	availableUnits: number;
	totalUnits: number;
	fractionalSupport: boolean;
}

// --- Booking Types ---
export interface Booking {
	id: number; // Booking ID (from the database)
	userId: number; // ID of the user who made the booking
	instrumentId: number; // ID of the instrument being booked
	bookedUnits: number; // Number of units booked
	status: string; // Booking status, e.g., "PENDING", "PURCHASED", "EXPIRED"
	bookingTime: Date; // The time when the booking was made
	expiresAt: Date; // The time when the booking expires (e.g., 6 hours from booking)
}

export interface CreateBookingBody {
	userId: number;
	instrumentId: number;
	bookedUnits: number;
}

export interface BookingResponse {
	id: number;
	userId: number;
	userName: string;
	instrumentId: number;
	instrumentName: string;
	bookedUnits: number;
	status: string;
	bookingTime: Date;
	expiresAt: Date;
	receiptUrl?: string;
	receiptId?: number;
}

// --- Receipt Types ---
export interface Receipt {
	id: number;
	bookingId: number;
	receiptUrl: string;
	status: "PENDING" | "VERIFIED" | "REJECTED";
	verifiedAt: Date | null;
}

export interface CreateReceiptBody {
	bookingId: number;
	receiptUrl: string;
}

export interface ReceiptResponse {
	id: number;
	bookingId: number;
	receiptUrl: string;
	status: string;
	verifiedAt?: Date;
}
