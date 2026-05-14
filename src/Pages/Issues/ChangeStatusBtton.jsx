// src/Pages/Issue/ChangeStatusButton.jsx
import React from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ChangeStatusButton = ({ issueId, onUpdate }) => {
  const axiosSecure = useAxiosSecure();

  const change = async () => {
    const status = prompt(
      "Enter new status (Pending, In-Progress, Resolved, Closed):"
    );
    const note = prompt("Optional note:");
    if (!status) return;

    try {
      await axiosSecure.post(`/issues/${issueId}/status`, { status, note });
      Swal.fire({
        title: "Status Updated!",
        text: "Action completed successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      onUpdate?.();
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Status update failed!",
        text: "Action completed successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <button onClick={change} className="btn btn-sm btn-outline">
      Change Status
    </button>
  );
};
export default ChangeStatusButton;
