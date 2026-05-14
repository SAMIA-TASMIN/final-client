import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import SocialLogin from "./SocialLogin";
import Swal from "sweetalert2";

const Login = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "civicLight"
  );

  useEffect(() => {
    const handleThemeChange = () => {
      const newTheme = localStorage.getItem("theme") || "civicLight";
      setTheme(newTheme);
    };
    window.addEventListener("storage", handleThemeChange);
    return () => window.removeEventListener("storage", handleThemeChange);
  }, []);

  // ===== THEME CLASSES =====
  const pageBg = theme === "civicLight" ? "bg-gray-50" : "bg-gray-950";
  const cardBg = theme === "civicLight" ? "bg-white" : "bg-gray-900";
  const borderClass =
    theme === "civicLight" ? "border-gray-200" : "border-gray-800";
  const titleClass = theme === "civicLight" ? "text-gray-800" : "text-gray-100";
  const subTextClass =
    theme === "civicLight" ? "text-gray-600" : "text-gray-400";
  const inputBg =
    theme === "civicLight"
      ? "bg-gray-100 text-gray-800"
      : "bg-gray-800 text-gray-100";
  const inputBorder =
    theme === "civicLight" ? "border-gray-300" : "border-gray-700";

  // ===== FORM =====
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const { signInUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = (data) => {
    signInUser(data.email, data.password)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Welcome back!",
          text: "Login successful.",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate(location?.state || "/");
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: error.message || "Invalid credentials",
        });
      });
  };

  const handleDemoLogin = (role) => {
    const creds =
      role === "admin"
        ? { email: "maishaamin@google.com", password: "MaishaAmin12!" }
        : { email: "sazzad@gmail.com", password: "SazzadRashid12!" };

    setValue("email", creds.email);
    setValue("password", creds.password);
    handleSubmit(handleLogin)();
  };

  return (
    <div
      className={`min-h-[85vh] flex items-center mt-16 justify-center px-4 ${pageBg}`}
    >
      <div
        className={`w-full max-w-md mt-10 p-8 rounded-2xl border shadow-xl ${cardBg} ${borderClass}`}
      >
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className={`text-3xl font-bold ${titleClass}`}>
            Welcome Back 👋
          </h2>
          <p className={`mt-1 text-sm ${subTextClass}`}>
            Login to continue to CivicConnect
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          {/* Email */}
          <div>
            <label className={`text-sm font-medium ${titleClass}`}>Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              placeholder="you@example.com"
              className={`w-full mt-1 px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} ${inputBorder}`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">Email is required</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className={`text-sm font-medium ${titleClass}`}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: true,
                  minLength: 6,
                })}
                placeholder="••••••••"
                className={`w-full mt-1 px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${inputBg} ${inputBorder}`}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer ${subTextClass}`}
              >
                {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
              </span>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">Password is required</p>
            )}
          </div>

          {/* Login Button */}
          <button className="w-full mt-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition">
            Login
          </button>
        </form>

        {/* Demo Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            onClick={() => handleDemoLogin("user")}
            className="py-2 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition"
          >
            Demo User
          </button>
          <button
            onClick={() => handleDemoLogin("admin")}
            className="py-2 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition"
          >
            Demo Admin
          </button>
        </div>

        {/* Social Login */}
        <div className="mt-6">
          <SocialLogin />
        </div>

        {/* Register */}
        <p className={`mt-6 text-center text-sm ${subTextClass}`}>
          Don’t have an account?{" "}
          <Link
            to="/register"
            state={location.state}
            className="text-blue-500 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
