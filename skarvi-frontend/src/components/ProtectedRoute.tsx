// src/components/ProtectedRoute.tsx
import React, { useEffect, useState, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [tokenAvailable, setTokenAvailable] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setTokenAvailable(!!token);
    setIsChecking(false);
  }, []);

  if (isChecking) {
    return <div>Loading...</div>; // You can replace this with a spinner
  }

  if (!tokenAvailable) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
