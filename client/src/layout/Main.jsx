import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
// import Navbar from "../components/Navbar";

import { useAuthStore } from "../store/AuthStore";
// import LoadingSpinner from "../components/LoadingSpinner";
// import { Footer } from "@/components/Footer";

function Main() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user, logout } =
    useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  console.log("Authenticated:", isAuthenticated);
  console.log("User:", user);

  if (isCheckingAuth) return <LoadingSpinner />;
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Main;
