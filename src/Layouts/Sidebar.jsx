// Sidebar.jsx
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import useRole from "../Hooks/useRole";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"; // arrow icons (unused, kept for reference)
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa"; // (unused, kept for reference)
import { MdOutlineDashboard, MdSpaceDashboard } from "react-icons/md";

const Sidebar = () => {
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
  const sidebarBgClass =
    theme === "civicLight" ? "bg-green-200" : "bg-gray-900";
  const sidebarHoverClass =
    theme === "civicLight" ? "hover:bg-green-300" : "hover:bg-gray-600";
  const titleClass = theme === "civicLight" ? "text-gray-900" : "text-gray-100";
  const subTitleClass =
    theme === "civicLight" ? "text-gray-700" : "text-gray-300";
  const activeLinkClass = "bg-blue-700 text-white shadow-inner"; // Use a distinct active style

  // ============================
  // COMPONENT LOGIC
  // ============================
  const { role, roleLoading } = useRole();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Helper function for NavLink class names
  const getNavLinkClass = ({ isActive }) =>
    `${sidebarHoverClass} p-2 font-bold rounded block transition-colors ${
      isActive ? activeLinkClass : titleClass
    }`;

  const getButtonClass = () =>
    `absolute top-2 right-1 p-2 rounded-full transition ${sidebarBgClass} ${titleClass} shadow-md`;

  return (
    <div className={`relative -mb-16 left-1 ${sidebarBgClass}`}>
      {/* Sidebar */}
      <aside
        className={`${sidebarBgClass} shadow-md p-4 flex flex-col -ml-1 gap-4 transition-all duration-300 
                ${isOpen ? "w-64" : "w-0 overflow-hidden"}`}
      >
        {isOpen && (
          <>
            <h1 className={`text-2xl font-bold mb-2 ${titleClass}`}>
              Dashboard
            </h1>

            {/* Common Links */}
            <NavLink to="/dashboard" className={getNavLinkClass}>
              <MdSpaceDashboard className="inline mr-2" size={20} /> Overview
            </NavLink>

            <NavLink to="/my-issues" className={getNavLinkClass}>
              <MdOutlineDashboard className="inline mr-2" size={20} /> My Issues
            </NavLink>

            <NavLink to="/reportIssue" className={getNavLinkClass}>
              <MdOutlineDashboard className="inline mr-2" size={20} /> Report
              Issue
            </NavLink>

            {/* ADMIN-ONLY SECTION */}
            {role === "admin" && (
              <div className={`mt-4 border-t ${subTitleClass} pt-3`}>
                <h2 className={`text-lg font-semibold mb-1 ${subTitleClass}`}>
                  Admin Panel
                </h2>

                <NavLink
                  to="/dashboard/allIssuesAdmin"
                  className={getNavLinkClass}
                >
                  Issue Management
                </NavLink>

                <NavLink
                  to="/dashboard/manage_staff"
                  className={getNavLinkClass}
                >
                  Staff Management
                </NavLink>
                <NavLink
                  to="/dashboard/manage_user"
                  className={getNavLinkClass}
                >
                  User Management
                </NavLink>
                <NavLink
                  to="/dashboard/staffCreation"
                  className={getNavLinkClass}
                >
                  Staff Creation (For Admin)
                </NavLink>

                <NavLink
                  to="/dashboard/paymentLogs"
                  className={getNavLinkClass}
                >
                  Payment Logs
                </NavLink>
              </div>
            )}
            {/* STAFF-ONLY SECTION */}
            {role === "staff" && (
              <div className={`mt-4 border-t ${subTitleClass} pt-3`}>
                <h2 className={`text-lg font-bold mb-1 ${titleClass}`}>
                  Staff Panel
                </h2>

                <NavLink
                  to="/dashboard/staffAssignedIssue"
                  className={getNavLinkClass}
                >
                  Issue Management
                </NavLink>

                <NavLink
                  to="/dashboard/staffPayments"
                  className={getNavLinkClass}
                >
                  Payment Logs
                </NavLink>
              </div>
            )}
          </>
        )}
      </aside>

      {/* Toggle Arrow (always visible) - repositioned to outside the sliding div for better UX */}
      <button
        onClick={toggleSidebar}
        title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        // Apply theme-aware background and text to the button
        className={getButtonClass()}
        style={{ right: isOpen ? "-24px" : "0px", zIndex: 20 }}
      >
        {isOpen ? <FiChevronLeft size={24} /> : <FiChevronRight size={24} />}
      </button>
    </div>
  );
};

export default Sidebar;
