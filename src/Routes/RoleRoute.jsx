
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Contexts/AuthContext"; 

const RoleRoute = ({ role, children }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) return <Navigate to="/dashboard" replace />;

  return children;
};

export default RoleRoute;
