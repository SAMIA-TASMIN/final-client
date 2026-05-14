
// import React, { useEffect, useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import useAxiosSecure from "../../../Hooks/useAxiosSecure";
// import Swal from "sweetalert2";
// import IssuesTableSkeleton from "../IssuesTableSkeleton ";

// const UserManagement = () => {
//   const [theme, setTheme] = useState(
//     localStorage.getItem("theme") || "civicLight"
//   );

//   useEffect(() => {
//     const handleThemeChange = () => {
//       const newTheme = localStorage.getItem("theme") || "civicLight";
//       if (newTheme !== theme) setTheme(newTheme);
//     };
//     window.addEventListener("storage", handleThemeChange);
//     return () => window.removeEventListener("storage", handleThemeChange);
//   }, [theme]);

//   const isLight = theme === "civicLight";
//   const titleClass = isLight ? "text-gray-900" : "text-gray-100";
//   const textClass = isLight ? "text-gray-700" : "text-gray-300";
//   const tableBg = isLight ? "bg-white" : "bg-gray-900";
//   const tableHeaderBg = isLight ? "bg-gray-100" : "bg-gray-700";
//   const tableBorder = isLight ? "border-gray-300" : "border-gray-700";
//   const tableRowHover = isLight ? "hover:bg-gray-50" : "hover:bg-gray-800";
//   const mobileCardBg = isLight ? "bg-white" : "bg-gray-800";

//   const axiosSecure = useAxiosSecure();

//   const {
//     data: users = [],
//     isLoading,
//     refetch,
//   } = useQuery({
//     queryKey: ["admin-users"],
//     queryFn: async () => (await axiosSecure.get("/admin/users")).data,
//   });

//   const handleBlockToggle = async (user) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: `You want to ${user.isBlocked ? "UNBLOCK" : "BLOCK"} this user`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes",
//       customClass: {
//         popup: isLight ? "" : "bg-gray-800 text-gray-100",
//         title: isLight ? "" : "text-gray-100",
//         content: isLight ? "" : "text-gray-300",
//       },
//     });
//     if (!result.isConfirmed) return;

//     try {
//       await axiosSecure.patch(`/admin/users/${user.email}/block`, {
//         block: !user.isBlocked,
//       });
//       Swal.fire("Success", "User status updated", "success");
//       refetch();
//     } catch (error) {
//       console.error(error);
//       Swal.fire("Error", "Action failed", "error");
//     }
//   };

//   const handleMakeAdmin = async (user) => {
//     const result = await Swal.fire({
//       title: "Make Admin?",
//       text: "This user will get full admin access",
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonText: "Yes, Make Admin",
//       customClass: {
//         popup: isLight ? "" : "bg-gray-800 text-gray-100",
//         title: isLight ? "" : "text-gray-100",
//         content: isLight ? "" : "text-gray-300",
//       },
//     });
//     if (!result.isConfirmed) return;

//     try {
//       await axiosSecure.patch(`/admin/users/${user.email}/make-admin`);
//       Swal.fire("Success", "User is now an admin", "success");
//       refetch();
//     } catch (error) {
//       console.error(error);
//       Swal.fire("Error", "Failed to make admin", "error");
//     }
//   };

//   if (isLoading) return <IssuesTableSkeleton />;

//   return (
//     <div className="p-4 md:p-6">
//       <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${titleClass}`}>
//         Manage Users
//       </h2>

//       {/* =======================
//           DESKTOP TABLE
//       ======================= */}
//       <div className={`hidden md:block overflow-x-auto rounded-xl shadow ${tableBg}`}>
//         <table className={`w-full border ${tableBorder}`}>
//           <thead className={tableHeaderBg}>
//             <tr>
//               {["#", "Name", "Email", "Subscription", "Status", "Role", "Actions"].map((h) => (
//                 <th key={h} className={`px-4 py-3 text-left font-semibold ${titleClass}`}>
//                   {h}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {users.length === 0 ? (
//               <tr>
//                 <td colSpan={7} className={`text-center p-6 ${textClass}`}>
//                   No users found.
//                 </td>
//               </tr>
//             ) : (
//               users.map((user, index) => (
//                 <tr key={user._id} className={`${tableRowHover} transition ${textClass}`}>
//                   <td className="px-4 py-3">{index + 1}</td>
//                   <td className={`px-4 py-3 font-medium ${titleClass}`}>
//                     {user.displayName || "N/A"}
//                   </td>
//                   <td className="px-4 py-3">{user.email}</td>
//                   <td className="px-4 py-3">
//                     {user.isPremium ? (
//                       <span className="badge badge-success">Premium</span>
//                     ) : (
//                       <span className="badge badge-ghost badge-outline">Free</span>
//                     )}
//                   </td>
//                   <td className="px-4 py-3">
//                     {user.isBlocked ? (
//                       <span className="badge badge-error">Blocked</span>
//                     ) : (
//                       <span className="badge badge-success">Active</span>
//                     )}
//                   </td>
//                   <td className="px-4 py-3">
//                     {user.role === "admin" ? (
//                       <span className="badge badge-primary">Admin</span>
//                     ) : user.role === "staff" ? (
//                       <span className="badge badge-info">Staff</span>
//                     ) : (
//                       <span className="badge badge-ghost badge-outline">Citizen</span>
//                     )}
//                   </td>
//                   <td className="px-4 py-3">
//                     <div className="flex gap-2 flex-wrap">
//                       <button
//                         onClick={() => handleBlockToggle(user)}
//                         className={`btn btn-xs ${user.isBlocked ? "btn-success" : "btn-error"}`}
//                       >
//                         {user.isBlocked ? "Unblock" : "Block"}
//                       </button>
//                       <button
//                         onClick={() => handleMakeAdmin(user)}
//                         disabled={user.role === "admin"}
//                         className="btn btn-xs btn-primary disabled:opacity-40"
//                       >
//                         Make Admin
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* =======================
//           MOBILE CARDS
//       ======================= */}
//       <div className="md:hidden space-y-4">
//         {users.length === 0 ? (
//           <p className={`text-center py-10 ${textClass}`}>No users found.</p>
//         ) : (
//           users.map((user) => (
//             <div
//               key={user._id}
//               className={`p-4 rounded-xl shadow border ${tableBorder} ${mobileCardBg} space-y-2`}
//             >
//               <div className="flex justify-between items-start">
//                 <h3 className={`font-semibold text-lg ${titleClass}`}>
//                   {user.displayName || "N/A"}
//                 </h3>
//                 {user.isBlocked ? (
//                   <span className="badge badge-error">Blocked</span>
//                 ) : (
//                   <span className="badge badge-success">Active</span>
//                 )}
//               </div>

//               <p className={`text-sm ${textClass}`}>
//                 <span className="font-medium">Email:</span> {user.email}
//               </p>
//               <p className={`text-sm ${textClass}`}>
//                 <span className="font-medium">Subscription:</span>{" "}
//                 {user.isPremium ? (
//                   <span className="badge badge-success badge-sm">Premium</span>
//                 ) : (
//                   <span className="badge badge-ghost badge-sm">Free</span>
//                 )}
//               </p>
//               <p className={`text-sm ${textClass}`}>
//                 <span className="font-medium">Role:</span>{" "}
//                 {user.role === "admin" ? (
//                   <span className="badge badge-primary badge-sm">Admin</span>
//                 ) : user.role === "staff" ? (
//                   <span className="badge badge-info badge-sm">Staff</span>
//                 ) : (
//                   <span className="badge badge-ghost badge-sm">Citizen</span>
//                 )}
//               </p>

//               <div className="flex gap-2 pt-2">
//                 <button
//                   onClick={() => handleBlockToggle(user)}
//                   className={`btn btn-sm flex-1 ${user.isBlocked ? "btn-success" : "btn-error"}`}
//                 >
//                   {user.isBlocked ? "Unblock" : "Block"}
//                 </button>
//                 <button
//                   onClick={() => handleMakeAdmin(user)}
//                   disabled={user.role === "admin"}
//                   className="btn btn-sm btn-primary flex-1 disabled:opacity-40"
//                 >
//                   Make Admin
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserManagement;
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import IssuesTableSkeleton from "../IssuesTableSkeleton ";

const UserManagement = () => {
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
  const tableHeaderBg = isLight ? "bg-gray-100" : "bg-gray-800";
  const tableBorder = isLight ? "border-gray-200" : "border-gray-700";
  const tableRowHover = isLight ? "hover:bg-gray-50" : "hover:bg-gray-800";
  const mobileCardBg = isLight ? "bg-white" : "bg-gray-800";

  const axiosSecure = useAxiosSecure();

  const {
    data: users = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => (await axiosSecure.get("/admin/users")).data,
  });

  // ============================
  // HANDLERS
  // ============================
  const handleBlockToggle = async (user) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You want to ${user.isBlocked ? "UNBLOCK" : "BLOCK"} this user`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: user.isBlocked ? "#22c55e" : "#ef4444",
    });
    if (!result.isConfirmed) return;
    try {
      await axiosSecure.patch(`/admin/users/${user.email}/block`, {
        block: !user.isBlocked,
      });
      Swal.fire("Success", "User status updated", "success");
      refetch();
    } catch (error) {
      Swal.fire("Error", "Action failed", "error");
    }
  };

  const handleMakeAdmin = async (user) => {
    const result = await Swal.fire({
      title: "Make Admin?",
      text: "This user will get full admin access",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Make Admin",
      confirmButtonColor: "#6366f1",
    });
    if (!result.isConfirmed) return;
    try {
      await axiosSecure.patch(`/admin/users/${user.email}/make-admin`);
      Swal.fire("Success", "User is now an admin", "success");
      refetch();
    } catch (error) {
      Swal.fire("Error", "Failed to make admin", "error");
    }
  };

  // ============================
  // INLINE BUTTON STYLES
  // DaisyUI override এড়াতে inline style ব্যবহার করা হয়েছে
  // ============================
  const btnBase = {
    border: "none",
    borderRadius: "6px",
    padding: "4px 12px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    color: "#fff",
    whiteSpace: "nowrap",
  };

  const btnBlock    = { ...btnBase, backgroundColor: "#ef4444" }; // red
  const btnUnblock  = { ...btnBase, backgroundColor: "#22c55e" }; // green
  const btnAdmin    = { ...btnBase, backgroundColor: "#6366f1" }; // indigo
  const btnDisabled = { ...btnBase, backgroundColor: "#9ca3af", cursor: "not-allowed", opacity: 0.6 };

  const btnBlockMobile   = { ...btnBlock,   padding: "8px 0", width: "100%" };
  const btnUnblockMobile = { ...btnUnblock, padding: "8px 0", width: "100%" };
  const btnAdminMobile   = { ...btnAdmin,   padding: "8px 0", width: "100%" };

  if (isLoading) return <IssuesTableSkeleton />;

  return (
    <div className="p-4 md:p-6">
      <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${titleClass}`}>
        Manage Users
      </h2>

      {/* ========================
          DESKTOP TABLE (md+)
      ======================== */}
      <div className={`hidden md:block overflow-x-auto rounded-xl shadow ${tableBg}`}>
        <table className="w-full border-collapse">
          <thead>
            <tr className={tableHeaderBg}>
              {["#", "Name", "Email", "Subscription", "Status", "Role", "Actions"].map((h) => (
                <th
                  key={h}
                  className={`px-4 py-3 border ${tableBorder} text-left text-sm font-semibold ${titleClass}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className={`text-center p-6 ${textClass}`}>
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user._id} className={`${tableRowHover} transition-colors`}>
                  <td className={`px-4 py-3 border ${tableBorder} text-sm ${textClass}`}>
                    {index + 1}
                  </td>
                  <td className={`px-4 py-3 border ${tableBorder} text-sm font-medium ${titleClass}`}>
                    {user.displayName || "N/A"}
                  </td>
                  <td className={`px-4 py-3 border ${tableBorder} text-sm ${textClass}`}>
                    {user.email}
                  </td>
                  <td className={`px-4 py-3 border ${tableBorder}`}>
                    {user.isPremium ? (
                      <span className="badge badge-success">Premium</span>
                    ) : (
                      <span className="badge badge-ghost badge-outline">Free</span>
                    )}
                  </td>
                  <td className={`px-4 py-3 border ${tableBorder}`}>
                    {user.isBlocked ? (
                      <span className="badge badge-error">Blocked</span>
                    ) : (
                      <span className="badge badge-success">Active</span>
                    )}
                  </td>
                  <td className={`px-4 py-3 border ${tableBorder}`}>
                    {user.role === "admin" ? (
                      <span className="badge badge-primary">Admin</span>
                    ) : user.role === "staff" ? (
                      <span className="badge badge-info">Staff</span>
                    ) : (
                      <span className="badge badge-ghost badge-outline">Citizen</span>
                    )}
                  </td>

                  {/* ✅ FIX: td তে flex না দিয়ে div এ inline style */}
                  <td className={`px-4 py-3 border ${tableBorder}`}>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                      <button
                        onClick={() => handleBlockToggle(user)}
                        style={user.isBlocked ? btnUnblock : btnBlock}
                      >
                        {user.isBlocked ? "Unblock" : "Block"}
                      </button>
                      <button
                        onClick={() => handleMakeAdmin(user)}
                        disabled={user.role === "admin"}
                        style={user.role === "admin" ? btnDisabled : btnAdmin}
                      >
                        Make Admin
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ========================
          MOBILE CARDS (sm)
      ======================== */}
      <div className="md:hidden space-y-4">
        {users.length === 0 ? (
          <p className={`text-center py-10 ${textClass}`}>No users found.</p>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className={`p-4 rounded-xl shadow border ${tableBorder} ${mobileCardBg} space-y-2`}
            >
              {/* Header row */}
              <div className="flex justify-between items-start gap-2">
                <h3 className={`font-semibold text-base ${titleClass}`}>
                  {user.displayName || "N/A"}
                </h3>
                {user.isBlocked ? (
                  <span className="badge badge-error shrink-0">Blocked</span>
                ) : (
                  <span className="badge badge-success shrink-0">Active</span>
                )}
              </div>

              <p className={`text-sm ${textClass}`}>
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p className={`text-sm ${textClass}`}>
                <span className="font-medium">Subscription:</span>{" "}
                {user.isPremium ? (
                  <span className="badge badge-success badge-sm">Premium</span>
                ) : (
                  <span className="badge badge-ghost badge-sm">Free</span>
                )}
              </p>
              <p className={`text-sm ${textClass}`}>
                <span className="font-medium">Role:</span>{" "}
                {user.role === "admin" ? (
                  <span className="badge badge-primary badge-sm">Admin</span>
                ) : user.role === "staff" ? (
                  <span className="badge badge-info badge-sm">Staff</span>
                ) : (
                  <span className="badge badge-ghost badge-sm">Citizen</span>
                )}
              </p>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "8px", paddingTop: "8px" }}>
                <button
                  onClick={() => handleBlockToggle(user)}
                  style={user.isBlocked ? btnUnblockMobile : btnBlockMobile}
                >
                  {user.isBlocked ? "Unblock" : "Block"}
                </button>
                <button
                  onClick={() => handleMakeAdmin(user)}
                  disabled={user.role === "admin"}
                  style={
                    user.role === "admin"
                      ? { ...btnDisabled, padding: "8px 0", width: "100%" }
                      : btnAdminMobile
                  }
                >
                  Make Admin
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserManagement;