import express from "express";
import {
	createUser,
	loginUser,
	logoutUser,
} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const userRouter = express.Router();

// Route to create a new user
userRouter.post("/create", (req, res) => {
	createUser(req, res);
});

// Route to login the user
userRouter.post("/login", (req, res) => {
	loginUser(req, res);
});

// Route to logout the user (just send a success message)
userRouter.post("/logout", logoutUser);

export default userRouter;
