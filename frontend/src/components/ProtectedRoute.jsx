import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.jsx";
import Loader from "./Loader.jsx";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="center-screen">
                <Loader size="lg" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
