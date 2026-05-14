import React, { useEffect, useState } from "react";
import useAuth from "../../Hooks/useAuth";
import { useLocation, useNavigate } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { FaG, FaGoogle } from "react-icons/fa6";

const SocialLogin = () => {
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
  // Use the primary text color for the "or" separator
  const titleClass = theme === "civicLight" ? "text-gray-800" : "text-gray-100";

  // Customizing the Google button for dark mode visibility
  const googleButtonClass =
    theme === "civicLight"
      ? "bg-white text-black hover:bg-blue-100" // Light mode: standard white button
      : "bg-gray-800 text-gray-100 hover:bg-blue-700"; // Dark mode: dark background, light text, visible border

  // ============================
  // AUTH LOGIC
  // ============================
  const { signInGoogle } = useAuth();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    signInGoogle()
      .then((result) => {
        console.log(result.user);

        const userInfo = {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        };

        axiosSecure
          .post("/users", userInfo)
          .then((res) => {
            console.log("User saved or already existed");
          })
          .catch((err) => {
            if (err.response?.status === 409) {
              console.log("User already exists — continuing login...");
            } else {
              console.log("Unexpected error:", err);
            }
          })
          .finally(() => {
            // ALWAYS LOG IN
            navigate(location.state || "/");
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <p className={`text-center my-4 ${titleClass}`}>or</p>

      {/* Google */}
      <button
        onClick={handleGoogleSignIn}
        className={`btn w-full rounded-md border-2 border-blue-500 ${googleButtonClass}`}
      >
        <svg
          aria-label="Google logo"
          width="16"
          height="16"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          {/* The logo paths remain static, only the container styles change */}
        </svg>
        <FaGoogle className="ml-2" />
        Login with Google
      </button>
    </div>
  );
};

export default SocialLogin;
