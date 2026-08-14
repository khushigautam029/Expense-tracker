import { Navigate } from "react-router-dom";

const isExpiredToken = (token) => {
    try {
        const payload = token.split(".")[1];
        const decodedPayload = atob(
            payload.replace(/-/g, "+").replace(/_/g, "/")
        );
        const { exp } = JSON.parse(decodedPayload);
        return !exp || exp * 1000 <= Date.now();
    } catch {
        return true;
    }
};

const ProtectedRoute = ({ children }) => {

    const token = localStorage.getItem("token");

    if (!token || isExpiredToken(token)) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
