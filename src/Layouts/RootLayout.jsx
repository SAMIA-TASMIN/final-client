import React, { useEffect } from "react";
import { Outlet } from "react-router";
import Navbar from "../Pages/Home/Navbar";

const RootLayout = () => {
  useEffect(() => {
    const handleThemeReload = () => {
      // 🔥 EXACT Chrome reload behavior
      window.location.reload();
    };

    window.addEventListener("theme-change-reload", handleThemeReload);

    return () => {
      window.removeEventListener("theme-change-reload", handleThemeReload);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default RootLayout;
