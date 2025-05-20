import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const PrivateRoute = () => {
	const { user } = useSelector((state: RootState) => state.auth);
	console.log(user);
	return user ? <Outlet /> : <Navigate to='/auth' replace />;
};

export default PrivateRoute;
