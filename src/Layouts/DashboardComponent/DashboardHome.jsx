import React, { useEffect, useState } from "react";
import useRole from "../../Hooks/useRole";
import LoadingPage from "../../Pages/Home/LoadingPage";
import AdminDashboard from "./AdminDashboard";
import StaffDashboard from "./StaffDashboard";
import CitizenDashboard from "./CitizenDashboard";

const DashboardHome = () => {
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
  // COMPONENT LOGIC
  // ============================
  const { role, roleLoading } = useRole();
  console.log("dashboard role", role);

  if (roleLoading) return <LoadingPage />;

  const userRole = role || "citizen";

  if (userRole === "admin") return <AdminDashboard />;
  else if (userRole === "staff") return <StaffDashboard />;
  else return <CitizenDashboard />;
};

export default DashboardHome;
