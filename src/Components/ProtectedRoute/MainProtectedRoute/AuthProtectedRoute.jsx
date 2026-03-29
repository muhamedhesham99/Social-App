import { useContext } from "react";
import TokenContext from "../../../Context/TokenContext/TokenContext";
import { Navigate } from "react-router-dom";

export const AuthProtectedRoute = ({ children }) => {
  const { userToken } = useContext(TokenContext);

  return <>{userToken ? <Navigate to={"/home"} /> : <>{children}</>}</>;
};
