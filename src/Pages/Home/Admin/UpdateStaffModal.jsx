import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const UpdateStaffModal = ({
  isOpen,
  onClose,
  staffData,
  loaderData,
  refetch,
}) => {
  const axiosSecure = useAxiosSecure();

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

  const cancelBtnClass = isLight
    ? "px-4 py-2 rounded border border-gray-400 text-gray-800 hover:bg-gray-100 transition"
    : "px-4 py-2 rounded border border-gray-600 text-gray-200 hover:bg-gray-700 transition";

  const saveBtnClass = isLight
    ? "px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
    : "px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition";

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const selectedRegion = watch("region", staffData?.region);

  useEffect(() => {
    if (staffData) {
      reset({
        name: staffData.name || "",
        email: staffData.email || "",
        phone: staffData.phone || "",
        photo: staffData.photo || "",
        region: staffData.region || "",
        district: staffData.district || "",
      });
    }
  }, [staffData, reset]);

  if (!isOpen || !staffData) return null;

  const districtsByRegion = (region) => {
    if (!region || !loaderData) return [];
    return [
      ...new Set(
        loaderData
          .filter((item) => item.region === region)
          .map((item) => item.district)
      ),
    ];
  };

  const onSubmit = async (data) => {
    const { name, phone, photo, region, district } = data;

    const updatedData = {
      name,
      phone: phone || null,
      photo: photo || null,
      region,
      district,
    };

    try {
      await axiosSecure.patch(`/admin/staff/${staffData._id}`, updatedData);
      Swal.fire(
        "Updated!",
        "Staff information updated successfully!",
        "success"
      );
      refetch?.();
      onClose();
    } catch (err) {
      console.error("Update staff failed:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to update staff.";
      Swal.fire("Error", errorMessage, "error");
    }
  };

  return (
    // Modal Backdrop
    <div
      className="fixed inset-0 z-40 flex items-center justify-center mt-20 bg-opacity-30 p-4 overflow-auto"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className={`relative ${modalBg} p-6 rounded-lg shadow-2xl w-full max-w-lg mx-auto ${textClass} overflow-y-auto max-h-[90vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={`text-2xl font-bold text-center mb-6 ${titleClass}`}>
          Update Staff: {staffData.name}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <input
            type="text"
            placeholder="Name"
            className={inputClass}
            {...register("name", { required: true })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">Name is required</p>
          )}

          {/* Email (readonly) */}
          <input
            type="email"
            placeholder="Email (Cannot be changed)"
            className={`${inputClass} bg-gray-100`}
            {...register("email", { required: true })}
            readOnly
          />

          {/* Phone */}
          <input
            type="text"
            placeholder="Phone"
            className={inputClass}
            {...register("phone")}
          />

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
              className={inputClass}
              {...register("region", { required: true })}
            >
              <option value="">Select Region</option>
              {[...new Set(loaderData?.map((item) => item.region))].map(
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
              className={inputClass}
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
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-6">
            <button type="button" onClick={onClose} className={cancelBtnClass}>
              Cancel
            </button>
            <button type="submit" className={saveBtnClass}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStaffModal;
