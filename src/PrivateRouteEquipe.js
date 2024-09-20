import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRouteEquipe = () => {
  const isAuthenticated = !!localStorage.getItem("accessToken");
  const storedRole = localStorage.getItem("role");
  const role = storedRole ? parseInt(atob(storedRole), 10) : null;

  // Vérifier si l'utilisateur est authentifié et a le rôle approprié
  return isAuthenticated && role === 1 ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRouteEquipe;
/*import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRouteEquipe = () => {
  const isAuthenticated = !!localStorage.getItem("accessToken");
  const role = parseInt(localStorage.getItem("role"), 10);

  // Vérifier si l'utilisateur est authentifié et a le rôle approprié
  return isAuthenticated && role === 1 ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRouteEquipe;*/
