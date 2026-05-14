import React, { useEffect, useState } from "react"; // Import useEffect and useState
import { Link } from "react-router-dom";

const ErrorPage = () => {
  // ============================
  // THEME STATE & LISTENER
  // ============================
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "civicLight"
  );

  useEffect(() => {
    const handleThemeChange = () => {
      const newTheme = localStorage.getItem("theme") || "civicLight";
      if (newTheme !== theme) setTheme(newTheme);
    };
    window.addEventListener("storage", handleThemeChange);
    return () => window.removeEventListener("storage", handleThemeChange);
  }, [theme]);

  // ============================
  // THEME-AWARE CLASS CALCULATION
  // ============================
  const isLight = theme === "civicLight";
  const bgClass = isLight ? "bg-gray-100" : "bg-gray-900";
  const titleClass = isLight ? "text-red-600" : "text-red-400";
  const textClass = isLight ? "text-gray-700" : "text-gray-300";
  const linkTextClass = isLight ? "text-gray-500" : "text-gray-400";
  const linkHoverClass = isLight ? "hover:text-red-600" : "hover:text-red-400";
  const buttonBgClass = "bg-red-600 hover:bg-red-700 text-white";

  return (
    <div
      className={`h-screen flex flex-col justify-center items-center ${bgClass} text-center px-4`}
    >
      {/* Animated Sad Face */}
      <div className="mb-6 animate-bounce">
        <svg
          className={`w-24 h-24 ${titleClass} mx-auto`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" />
          <circle cx="9" cy="10" r="1" fill="currentColor" />
          <circle cx="15" cy="10" r="1" fill="currentColor" />
          <path
            d="M8 16c1.5-1 6.5-1 8 0"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Error Code */}
      <h1 className={`text-6xl font-extrabold ${titleClass} mb-2`}>404</h1>

      {/* Message */}
      <p className={`text-lg ${textClass} mb-6 max-w-md`}>
        Oops! The page you’re looking for doesn’t exist. Even CivicConnect feels
        sad about broken links.
      </p>

      {/* Action Button */}
      <Link
        to="/"
        className={`${buttonBgClass} font-semibold px-6 py-3 rounded-md shadow-lg transition duration-300`}
      >
        Go Back Home
      </Link>

      {/* Footer Note */}
      <p className={`mt-8 text-sm ${linkTextClass}`}>
        Need help?{" "}
        <Link to="/contact" className={`underline ${linkHoverClass}`}>
          Contact Support
        </Link>
      </p>
    </div>
  );
};

export default ErrorPage;
