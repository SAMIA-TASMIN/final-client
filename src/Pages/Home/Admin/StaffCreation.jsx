import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import LoadingPage from "../LoadingPage";
import Swal from "sweetalert2";
import AddStaffModal from "./AddStaffModal";
import UpdateStaffModal from "./UpdateStaffModal";

const StaffCreation = () => {
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

  const isLight = theme === "civicLight";
  const titleClass = isLight ? "text-gray-900" : "text-gray-100";
  const textClass = isLight ? "text-gray-700" : "text-gray-300";
  const tableBg = isLight ? "bg-white" : "bg-gray-900";
  const tableHeaderBg = isLight ? "bg-gray-100" : "bg-gray-700";
  const tableRowHover = isLight ? "hover:bg-gray-50" : "hover:bg-gray-800";

  const axiosSecure = useAxiosSecure();
  const loaderData = useLoaderData();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [staffToUpdate, setStaffToUpdate] = useState(null);

  // ============================
  // DATA FETCHING
  // ============================
  const {
    data: staffList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["all-staff"],
    queryFn: async () => (await axiosSecure.get("/admin/staff")).data,
  });

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);
  const openUpdateModal = (staff) => {
    setStaffToUpdate(staff);
    setIsUpdateModalOpen(true);
  };
  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setStaffToUpdate(null);
  };

  // ============================
  // DELETE HANDLER
  // ============================
  const deleteStaff = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: isLight ? "" : "bg-gray-800 text-gray-100",
        title: isLight ? "" : "text-gray-100",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/admin/staff/${id}`).then(() => {
          refetch();
          Swal.fire("Deleted!", "Staff has been deleted.", "success");
        });
      }
    });
  };

  if (isLoading) return <LoadingPage />;

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className={`text-3xl font-bold ${titleClass}`}>Manage Staff</h2>
        <button
          onClick={openAddModal}
          className="px-4 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition"
        >
          Add Staff
        </button>
      </div>

      <div className={`overflow-x-auto shadow rounded-xl ${tableBg}`}>
        <table className="w-full min-w-[600px]">
          <thead className={tableHeaderBg}>
            <tr className={titleClass}>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className={textClass}>
            {staffList.map((staff, index) => (
              <tr key={staff._id} className={`${tableRowHover}`}>
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{staff.name}</td>
                <td className="px-4 py-2">{staff.email}</td>
                <td className="px-4 py-2">{staff.phone}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                      staff.role === "admin"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {staff.role}
                  </span>
                </td>
                <td className="px-4 py-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => openUpdateModal(staff)}
                    className="px-3 py-1 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => deleteStaff(staff._id)}
                    className="px-3 py-1 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:from-red-600 hover:to-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {staffList.length === 0 && (
          <p className={`text-center p-6 ${textClass}`}>
            No staff records found.
          </p>
        )}
      </div>

      {/* Modals */}
      <AddStaffModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        loaderData={loaderData}
        refetch={refetch}
      />
      <UpdateStaffModal
        isOpen={isUpdateModalOpen}
        onClose={closeUpdateModal}
        staffData={staffToUpdate}
        loaderData={loaderData}
        refetch={refetch}
      />
    </div>
  );
};

export default StaffCreation;
