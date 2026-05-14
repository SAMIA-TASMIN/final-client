// DashboardLayout.jsx
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

import DashboardHome from "./DashboardComponent/DashboardHome";
import Footer from "../Pages/Home/Footer";

const DashboardLayout = () => {
  // ============================
  // THEME STATE & LISTENER
  // ============================
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "civicLight"
  );

  useEffect(() => {
    const handleThemeChange = () => {
      const newTheme = localStorage.getItem("theme") || "civicLight";
      if (newTheme !== theme) {
        setTheme(newTheme);
      }
    };
    window.addEventListener("storage", handleThemeChange);
    return () => {
      window.removeEventListener("storage", handleThemeChange);
    };
  }, [theme]);

  // ============================
  // THEME-AWARE CLASS CALCULATION
  // ============================
  const mainContentBgClass =
    theme === "civicLight" ? "bg-gray-100" : "bg-gray-800";

  const containerBgClass = "bg-base-200";

  return (
    <div className={mainContentBgClass}>
      <div className="flex py-16 min-h-screen">
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* The main content area's background */}
          <main className={`p-6 ${mainContentBgClass} flex-1 overflow-auto`}>
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
