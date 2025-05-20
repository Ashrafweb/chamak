"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const userRouter = express_1.default.Router();
// Route to create a new user
userRouter.post("/create", (req, res) => {
    (0, userController_1.createUser)(req, res);
});
// Route to login the user
userRouter.post("/login", (req, res) => {
    (0, userController_1.loginUser)(req, res);
});
// Route to logout the user (just send a success message)
userRouter.post("/logout", userController_1.logoutUser);
exports.default = userRouter;
