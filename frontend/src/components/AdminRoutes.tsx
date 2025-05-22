import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const AdminRoutes = () => {
	const { user } = useSelector((state: RootState) => state.auth);

	return user.role === "ADMIN" ? <Outlet /> : <Navigate to='/' replace />;
};

export default AdminRoutes;
