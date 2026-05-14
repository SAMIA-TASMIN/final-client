import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";

const AddStaffModal = ({ isOpen, onClose, loaderData, refetch }) => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth() || {};

  // ============================
  // THEME STATE & TOGGLE
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

  const isLight = theme === "civicLight";

  // ============================
  // THEME-DEPENDENT CLASSES
  // ============================
  const modalBg = isLight ? "bg-white" : "bg-gray-800";
  const titleClass = isLight ? "text-gray-900" : "text-gray-100";
  const textClass = isLight ? "text-gray-700" : "text-gray-300";
  const inputClass = isLight
    ? "input input-bordered p-2 rounded-xl w-full text-gray-900 placeholder-gray-400 focus:ring focus:ring-blue-300"
    : "input input-bordered p-2 rounded-xl w-full text-gray-100 bg-gray-700 border-gray-600 placeholder-gray-400 focus:ring focus:ring-blue-500";
  const selectClass = inputClass;

  const cancelBtnClass = isLight
    ? "px-4 py-2 rounded border border-gray-400 text-gray-800 hover:bg-gray-100 transition"
    : "px-4 py-2 rounded border border-gray-600 text-gray-200 hover:bg-gray-700 transition";

  const submitBtnClass = isLight
    ? "px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
    : "px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition";

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const selectedRegion = watch("region");

  if (!isOpen) return null;

  const districtsByRegion = (region) => {
    if (!region) return [];
    return [
      ...new Set(
        loaderData
          .filter((item) => item.region === region)
          .map((item) => item.district)
      ),
    ];
  };

  const onSubmit = async (data) => {
    const { name, email, password, region, district, phone, photo } = data;

    const staffData = {
      name,
      email,
      password,
      phone: phone || null,
      photo: photo || null,
      region,
      district,
      experience: "0",
      status: "Accepted",
      submittedAt: new Date(),
    };

    try {
      await axiosSecure.post("/admin/staff", staffData);
      Swal.fire("Success", "Staff added successfully!", "success");
      reset();
      onClose();
      refetch?.();
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to add staff due to a server error.";
      Swal.fire("Error", errorMessage, "error");
    }
  };

  return (
    // Backdrop
    <div
      className="fixed mt-20 inset-0 z-40 flex items-center justify-center bg-opacity-10 p-4 overflow-auto"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className={`relative ${modalBg} p-6 rounded-lg shadow-2xl w-full max-w-md mx-auto ${textClass} overflow-y-auto max-h-[90vh]`}
        onClick={(e) => e.stopPropagation()} // Prevent modal close on click inside
      >
        <h2 className={`text-2xl font-bold text-center mb-6 ${titleClass}`}>
          Add New Staff
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <input
            type="text"
            placeholder="Staff Name"
            className={inputClass}
            {...register("name", { required: true })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">Name is required</p>
          )}

          {/* Email */}
          <input
            type="email"
            placeholder="Staff Email"
            className={inputClass}
            {...register("email", { required: true })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">Email is required</p>
          )}

          {/* Phone */}
          <input
            type="text"
            placeholder="Phone (Optional)"
            className={inputClass}
            {...register("phone")}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            className={inputClass}
            {...register("password", { required: true, minLength: 6 })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">
              Password is required and must be at least 6 characters
            </p>
          )}

          {/* Photo URL */}
          <input
            type="text"
            placeholder="Photo URL (Optional)"
            className={inputClass}
            {...register("photo")}
          />

          {/* Region */}
          <div>
            <label className={`font-semibold mb-1 block ${titleClass}`}>
              Region
            </label>
            <select
              className={selectClass}
              {...register("region", { required: true })}
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
              <p className="text-red-500 text-sm">Region is required</p>
            )}
          </div>

          {/* District */}
          <div>
            <label className={`font-semibold mb-1 block ${titleClass}`}>
              District
            </label>
            <select
              className={selectClass}
              {...register("district", { required: true })}
              disabled={!selectedRegion}
            >
              <option value="">Select District</option>
              {districtsByRegion(selectedRegion).map((district, idx) => (
                <option key={idx} value={district}>
                  {district}
                </option>
              ))}
            </select>
            {errors.district && (
              <p className="text-red-500 text-sm">District is required</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <button type="button" onClick={onClose} className={cancelBtnClass}>
              Cancel
            </button>
            <button type="submit" className={submitBtnClass}>
              Add Staff
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaffModal;
