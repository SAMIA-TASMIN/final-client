// src/Pages/Issue/AssignButton.jsx
import React from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

export const AssignButton = ({ issueId, onUpdate }) => {
  const axiosSecure = useAxiosSecure();

  const assign = async () => {
    const staffEmail = prompt("Enter staff email to assign:");
    const staffName = prompt("Enter staff name (optional):");
    if (!staffEmail) return;

    try {
      await axiosSecure.post(`/issues/${issueId}/assign`, {
        staffEmail,
        staffName,
      });
      Swal.fire({
        title: "Success!",
        text: "Action completed successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      onUpdate?.();
    } catch (err) {
      Swal.fire({
        title: "Failed!",
        text: "Action completed successfully.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <button onClick={assign} className="btn btn-sm btn-outline">
      Assign Staff
    </button>
  );
};
