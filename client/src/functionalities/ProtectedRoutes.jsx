import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useUserContext } from "../components/providers/AuthProvider";

const ProtectedRoutes = () => {
  const { isAuthenticated, isLoading } = useUserContext();

  return (
    <>
      {isLoading ? (
        "Loading..."
      ) : isAuthenticated ? (
        <Outlet />
      ) : (
        <Navigate to="/login-signup" />
      )}
    </>
  );
};

export default ProtectedRoutes;
