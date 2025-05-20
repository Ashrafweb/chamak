// src/hooks/useAuth.ts
import { useSelector } from "react-redux";
import {
	useLoginUserMutation,
	useRegisterUserMutation,
	useLogoutUserMutation,
} from "../redux/slices/apiSlice";
import type { RootState } from "../redux/store";

export const useAuth = () => {
	// Select current user and token from the Redux state
	const user = useSelector((state: RootState) => state.auth.user);
	const token = useSelector((state: RootState) => state.auth.token);
	// Use the generated mutations from RTK Query for login, registration, and logout
	const [loginUser, { isLoading: loginLoading, error: loginError }] =
		useLoginUserMutation();
	const [registerUser, { isLoading: registerLoading, error: registerError }] =
		useRegisterUserMutation();
	const [logoutUser] = useLogoutUserMutation();

	// Register user
	const register = (username: string, email: string, password: string) => {
		registerUser({ username, email, password });
	};

	// Login user
	const login = (email: string, password: string) => {
		loginUser({ email, password });
	};

	// Logout user
	const logout = () => {
		logoutUser(user);
	};

	// Combine loading and error states for easier access
	const isLoading = loginLoading || registerLoading;
	const apiError = loginError || registerError;

	return { user, token, isLoading, apiError, register, login, logout };
};
