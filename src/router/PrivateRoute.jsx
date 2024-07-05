import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }) => {

    const auth = sessionStorage.getItem('auth')

    return auth ? children : <Navigate to="/login" />;
};