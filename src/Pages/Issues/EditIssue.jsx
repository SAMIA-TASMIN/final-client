import React, { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { getAuth } from "firebase/auth";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import LoadingPage from "../Home/LoadingPage";

const imageHostKey = import.meta.env.VITE_IMAGE_HOST_KEY;

const EditIssue = () => {
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
  const formBg = isLight ? "bg-white" : "bg-gray-900";
  const formText = isLight ? "text-gray-900" : "text-gray-100";
  const titleClass = "text-2xl font-bold mb-6 text-center text-blue-600";
  const inputClass = isLight
    ? "input input-bordered w-full mb-4 p-2 rounded-lg text-gray-900 placeholder-gray-500 bg-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
    : "input input-bordered w-full mb-4 p-2 rounded-lg text-gray-100 placeholder-gray-400 bg-gray-800 border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition";
  const textareaClass = isLight
    ? "textarea textarea-bordered w-full mb-4 p-2 rounded-lg text-gray-900 placeholder-gray-500 bg-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
    : "textarea textarea-bordered w-full mb-4 p-2 rounded-lg text-gray-100 placeholder-gray-400 bg-gray-800 border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition";
  const fileInputClass = isLight
    ? "file-input w-full mb-4 p-2 rounded-lg file-input-bordered bg-gray-100 text-gray-900 focus:ring-2 focus:ring-blue-400 transition"
    : "file-input w-full mb-4 p-2 rounded-lg file-input-bordered bg-gray-800 text-gray-100 border-gray-700 focus:ring-2 focus:ring-blue-500 transition";
  const labelClass = isLight
    ? "label text-gray-700 mb-1"
    : "label text-gray-300 mb-1";

  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { id } = useParams();

  const { data: issue, isLoading } = useQuery({
    queryKey: ["issue", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/issues/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (issue) {
      reset({
        title: issue.title,
        description: issue.description,
        category: issue.category,
      });
    }
  }, [issue, reset]);

  const [imageFile, setImageFile] = useState(null);

  const uploadImageToImgbb = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const url = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;
    const res = await fetch(url, { method: "POST", body: formData });
    const data = await res.json();
    return data.data.url;
  };

  const onSubmit = async (data) => {
    try {
      let imageUrl = issue?.image || "";
      if (imageFile) imageUrl = await uploadImageToImgbb(imageFile);

      const updatedIssue = {
        title: data.title,
        description: data.description,
        category: data.category,
        image: imageUrl,
      };

      const auth = getAuth();
      const token = await auth.currentUser.getIdToken();

      await axiosSecure.patch(`/issues/${id}`, updatedIssue, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire("Updated!", "Issue updated successfully.", "success");
      navigate("/my-issues");
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to update issue due to a network or server error.";
      Swal.fire("Update Failed", errorMessage, "error");
    }
  };

  if (isLoading) return <LoadingPage />;

  return (
    <div
      className={`min-h-screen mt-16 flex items-center justify-center px-4 py-8 ${
        isLight ? "bg-gray-100" : "bg-gray-950"
      }`}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`w-full max-w-md p-8 rounded-xl shadow-xl ${formBg} ${formText} transition`}
      >
        <h2 className={titleClass}>Edit Issue</h2>

        {/* Title */}
        <input
          type="text"
          placeholder="Title"
          className={inputClass}
          {...register("title", { required: true })}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mb-2">Title is required</p>
        )}

        {/* Description */}
        <textarea
          placeholder="Description"
          className={textareaClass}
          rows={4}
          {...register("description", { required: true })}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mb-2">Description is required</p>
        )}

        {/* Category */}
        <select
          {...register("category", { required: true })}
          className={inputClass}
        >
          <option value="">Select Category</option>
          <option value="Broken Streetlight">Broken Streetlight</option>
          <option value="Pothole">Pothole</option>
          <option value="Water Leakage">Water Leakage</option>
          <option value="Garbage Overflow">Garbage Overflow</option>
          <option value="Damaged Footpath">Damaged Footpath</option>
          <option value="Other">Other</option>
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm mb-2">Category is required</p>
        )}

        {/* Image */}
        <label className={labelClass}>
          Change Photo (leave empty to keep current)
        </label>
        {issue?.image && (
          <img
            src={issue.image}
            alt="Current"
            className="w-full h-40 object-cover rounded-lg mb-3"
          />
        )}
        <input
          type="file"
          className={fileInputClass}
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        {/* Submit */}
        <button
          type="submit"
          className="btn w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition"
        >
          Update Issue
        </button>
      </form>
    </div>
  );
};

export default EditIssue;