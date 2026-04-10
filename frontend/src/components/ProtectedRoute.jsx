import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AppIcon } from "../assets/icons/AppIcons";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-zinc-950 px-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <span className="text-blue-400 animate-spin">
            <AppIcon name="refresh" size={18} />
          </span>
        </div>
        <p className="text-sm text-white/50">Checking your session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
