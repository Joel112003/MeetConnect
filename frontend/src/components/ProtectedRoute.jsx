import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
        <div className="w-full max-w-xs rounded-2xl border border-white/10 bg-zinc-900/80 p-5">
          <div className="h-4 w-24 animate-pulse rounded bg-white/15" />
          <div className="mt-4 h-3 w-full animate-pulse rounded bg-white/10" />
          <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-white/10" />
          <span className="sr-only">Checking your session</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
