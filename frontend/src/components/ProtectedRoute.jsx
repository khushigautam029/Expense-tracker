import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {

    // Later we'll replace this with JWT authentication
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;