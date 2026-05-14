import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLoaderData } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";

const BeAStaff = () => {
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
  const titleClass = theme === "civicLight" ? "text-gray-800" : "text-blue-500";
  const subTextClass =
    theme === "civicLight" ? "text-gray-600" : "text-gray-400";
  const inputBg =
    theme === "civicLight"
      ? "bg-gray-100 text-gray-800"
      : "bg-gray-800 text-gray-100";
  const inputBorder =
    theme === "civicLight" ? "border-gray-300" : "border-gray-700";

  // ===== LOGIC =====
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const loaderData = useLoaderData();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const selectedRegion = watch("region");

  const districtsByRegion = (region) => {
    if (!region) return [];
    return loaderData
      .filter((item) => item.region === region)
      .map((item) => item.district);
  };

  const onSubmit = async (data) => {
    try {
      const application = {
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        region: data.region,
        district: data.district,
        experience: data.experience,
      };

      await axiosSecure.post("/staff", application);

      Swal.fire({
        icon: "success",
        title: "Application Submitted 🎉",
        text: "We will review your application shortly.",
        confirmButtonText: "Done",
      });

      navigate("/");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          err.response?.data?.message ||
          "Failed to submit application. Please try again.",
      });
    }
  };

  return (
    <div
      className={`min-h-[85vh] flex items-center justify-center px-4 ${pageBg}`}
    >
      <div
        className={`w-full max-w-lg mt-20 p-8 rounded-2xl border shadow-xl ${cardBg} ${borderClass}`}
      >
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className={`text-3xl font-bold ${titleClass}`}>
            Become a Staff Member
          </h2>
          <p className={`mt-1 text-sm ${subTextClass}`}>
            Help your community by joining CivicConnect as a staff
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className={`text-sm font-medium ${titleClass}`}>
              Full Name
            </label>
            <input
              type="text"
              defaultValue={user?.displayName || ""}
              {...register("fullName", { required: true })}
              className={`w-full mt-1 px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} ${inputBorder}`}
              placeholder="Your full name"
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">Full name is required</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className={`text-sm font-medium ${titleClass}`}>Email</label>
            <input
              type="email"
              defaultValue={user?.email || ""}
              {...register("email", { required: true })}
              className={`w-full mt-1 px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} ${inputBorder}`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">Email is required</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className={`text-sm font-medium ${titleClass}`}>Phone</label>
            <input
              type="text"
              {...register("phone", { required: true })}
              className={`w-full mt-1 px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} ${inputBorder}`}
              placeholder="01XXXXXXXXX"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">Phone is required</p>
            )}
          </div>

          {/* Region */}
          <div>
            <label className={`text-sm font-medium ${titleClass}`}>
              Region
            </label>
            <select
              {...register("region", { required: true })}
              className={`w-full mt-1 px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} ${inputBorder}`}
            >
              <option value="">Select Region</option>
              {[...new Set(loaderData.map((item) => item.region))].map(
                (region, idx) => (
                  <option key={idx} value={region}>
                    {region}
                  </option>
                )
              )}
            </select>
            {errors.region && (
              <p className="text-red-500 text-xs mt-1">Region is required</p>
            )}
          </div>

          {/* District */}
          <div>
            <label className={`text-sm font-medium ${titleClass}`}>
              District
            </label>
            <select
              {...register("district", { required: true })}
              disabled={!selectedRegion}
              className={`w-full mt-1 px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${inputBg} ${inputBorder}`}
            >
              <option value="">Select District</option>
              {districtsByRegion(selectedRegion).map((district, idx) => (
                <option key={idx} value={district}>
                  {district}
                </option>
              ))}
            </select>
            {errors.district && (
              <p className="text-red-500 text-xs mt-1">District is required</p>
            )}
          </div>

          {/* Experience */}
          <div>
            <label className={`text-sm font-medium ${titleClass}`}>
              Work Experience (years)
            </label>
            <input
              type="number"
              min="0"
              {...register("experience", { required: true })}
              className={`w-full mt-1 px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} ${inputBorder}`}
              placeholder="e.g. 2"
            />
            {errors.experience && (
              <p className="text-red-500 text-xs mt-1">
                Experience is required
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default BeAStaff;
