// import React, { useEffect, useState } from "react";
// import useAxiosSecure from "../../../Hooks/useAxiosSecure";
// import Swal from "sweetalert2";
// import LoadingPage from "../../Home/LoadingPage"; // Assuming you have a theme-aware LoadingPage
// import IssuesTableSkeleton from "../IssuesTableSkeleton ";

// const StaffManagement = () => {
//   // ============================
//   // THEME STATE & LISTENER
//   // ============================
//   const [theme, setTheme] = useState(
//     localStorage.getItem("theme") || "civicLight"
//   );

//   useEffect(() => {
//     const handleThemeChange = () => {
//       const newTheme = localStorage.getItem("theme") || "civicLight";
//       if (newTheme !== theme) {
//         setTheme(newTheme);
//       }
//     };
//     window.addEventListener("storage", handleThemeChange);
//     return () => {
//       window.removeEventListener("storage", handleThemeChange);
//     };
//   }, [theme]);

//   // ============================
//   // THEME-AWARE CLASS CALCULATION
//   // ============================
//   const isLight = theme === "civicLight";
//   const titleClass = isLight ? "text-gray-900" : "text-gray-100";
//   const textClass = isLight ? "text-gray-700" : "text-gray-300";
//   const tableHeaderBg = isLight ? "bg-gray-100" : "bg-gray-700";
//   const tableBg = isLight ? "bg-white" : "bg-gray-900";
//   const tableBorder = isLight ? "border-gray-300" : "border-gray-700";
//   const rowHoverBg = isLight ? "hover:bg-gray-50" : "hover:bg-gray-800";
//   const mobileCardBg = isLight ? "bg-white" : "bg-gray-800";

//   const getStatusColorClass = (status) => {
//     if (isLight) {
//       if (status === "Pending") return "bg-yellow-100 text-yellow-700";
//       if (status === "Accepted") return "bg-green-100 text-green-700";
//       return "bg-red-100 text-red-700";
//     } else {
//       if (status === "Pending") return "bg-yellow-900 text-yellow-300";
//       if (status === "Accepted") return "bg-green-900 text-green-300";
//       return "bg-red-900 text-red-300";
//     }
//   };

//   // ============================
//   // DATA & HANDLERS
//   // ============================
//   const axiosSecure = useAxiosSecure();
//   const [staffList, setStaffList] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch all staff applications
//   const fetchStaff = async () => {
//     try {
//       setLoading(true);
//       const res = await axiosSecure.get("/staff"); // Your backend should return staff applications
//       setStaffList(res.data || []);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStaff();
//   }, []);

//   // Handle Accept / Reject
//   const handleStatusChange = async (staffEmail, action) => {
//     try {
//       if (action === "accept") {
//         // Update staff status
//         await axiosSecure.patch(`/staff/${staffEmail}`, { status: "Accepted" });

//         // Update user role to staff
//         await axiosSecure.patch(`/users/${staffEmail}/role`, { role: "staff" });

//         Swal.fire("Success", "Staff approved successfully!", "success");
//       } else if (action === "reject") {
//         // Update staff status
//         await axiosSecure.patch(`/staff/${staffEmail}`, { status: "Rejected" });
//         Swal.fire("Rejected", "Staff application rejected!", "error");
//       }

//       // Refresh list
//       fetchStaff();
//     } catch (err) {
//       console.error(err);
//       Swal.fire("Error", "Something went wrong", "error");
//     }
//   };

//   if (loading) return <IssuesTableSkeleton />;

//   return (
//     <div className="p-4 md:p-6">
//       <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${titleClass}`}>
//         Staff Management
//       </h2>

//       {/* =======================
//               DESKTOP TABLE (md+)
//             ======================= */}
//       <div
//         className={`hidden md:block overflow-x-auto rounded-xl shadow ${tableBg}`}
//       >
//         <table className={`w-full border ${tableBorder}`}>
//           <thead className={tableHeaderBg}>
//             <tr className={textClass}>
//               <th
//                 className={`border ${tableBorder} p-3 text-left ${titleClass}`}
//               >
//                 Name
//               </th>
//               <th
//                 className={`border ${tableBorder} p-3 text-left ${titleClass}`}
//               >
//                 Email
//               </th>
//               <th
//                 className={`border ${tableBorder} p-3 text-left ${titleClass}`}
//               >
//                 Phone
//               </th>
//               <th
//                 className={`border ${tableBorder} p-3 text-left ${titleClass}`}
//               >
//                 Region
//               </th>
//               <th
//                 className={`border ${tableBorder} p-3 text-left ${titleClass}`}
//               >
//                 District
//               </th>
//               <th
//                 className={`border ${tableBorder} p-3 text-left ${titleClass}`}
//               >
//                 Experience
//               </th>
//               <th
//                 className={`border ${tableBorder} p-3 text-left ${titleClass}`}
//               >
//                 Status
//               </th>
//               <th
//                 className={`border ${tableBorder} p-3 text-left ${titleClass}`}
//               >
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {staffList.map((staff) => (
//               <tr
//                 key={staff.email}
//                 className={`${rowHoverBg} transition ${textClass}`}
//               >
//                 <td className={`border ${tableBorder} p-3 ${titleClass}`}>
//                   {staff.name}
//                 </td>
//                 <td className={`border ${tableBorder} p-3`}>{staff.email}</td>
//                 <td className={`border ${tableBorder} p-3`}>{staff.phone}</td>
//                 <td className={`border ${tableBorder} p-3`}>{staff.region}</td>
//                 <td className={`border ${tableBorder} p-3`}>
//                   {staff.district}
//                 </td>
//                 <td className={`border ${tableBorder} p-3`}>
//                   {staff.experience} yrs
//                 </td>
//                 <td className={`border ${tableBorder} p-3`}>
//                   <span
//                     className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColorClass(
//                       staff.status
//                     )}`}
//                   >
//                     {staff.status}
//                   </span>
//                 </td>
//                 <td className={`border ${tableBorder} p-3 space-x-2`}>
//                   {staff.status === "Pending" && (
//                     <>
//                       <button
//                         className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
//                         onClick={() =>
//                           handleStatusChange(staff.email, "accept")
//                         }
//                       >
//                         Accept
//                       </button>
//                       <button
//                         className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
//                         onClick={() =>
//                           handleStatusChange(staff.email, "reject")
//                         }
//                       >
//                         Reject
//                       </button>
//                     </>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* =======================
//               MOBILE CARDS (sm)
//             ======================= */}
//       <div className="md:hidden space-y-4">
//         {staffList.map((staff) => (
//           <div
//             key={staff.email}
//             // Apply theme-aware classes to the card
//             className={`rounded-xl border ${tableBorder} p-4 shadow ${mobileCardBg} space-y-2`}
//           >
//             <div className="flex justify-between items-start">
//               <h3 className={`font-semibold text-lg ${titleClass}`}>
//                 {staff.name}
//               </h3>
//               <span
//                 className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColorClass(
//                   staff.status
//                 )}`}
//               >
//                 {staff.status}
//               </span>
//             </div>

//             <p className={`text-sm ${textClass}`}>
//               <span className="font-medium">Email:</span> {staff.email}
//             </p>
//             <p className={`text-sm ${textClass}`}>
//               <span className="font-medium">Phone:</span> {staff.phone}
//             </p>
//             <p className={`text-sm ${textClass}`}>
//               <span className="font-medium">Region:</span> {staff.region}
//             </p>
//             <p className={`text-sm ${textClass}`}>
//               <span className="font-medium">District:</span> {staff.district}
//             </p>
//             <p className={`text-sm ${textClass}`}>
//               <span className="font-medium">Experience:</span>{" "}
//               {staff.experience} yrs
//             </p>

//             {staff.status === "Pending" && (
//               <div className="flex gap-2 pt-2">
//                 <button
//                   className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition"
//                   onClick={() => handleStatusChange(staff.email, "accept")}
//                 >
//                   Accept
//                 </button>
//                 <button
//                   className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition"
//                   onClick={() => handleStatusChange(staff.email, "reject")}
//                 >
//                   Reject
//                 </button>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default StaffManagement;

import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import IssuesTableSkeleton from "../IssuesTableSkeleton ";

const StaffManagement = () => {
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
  const tableHeaderBg = isLight ? "bg-gray-100" : "bg-gray-700";
  const tableBg = isLight ? "bg-white" : "bg-gray-900";
  const tableBorder = isLight ? "border-gray-300" : "border-gray-700";
  const rowHoverBg = isLight ? "hover:bg-gray-50" : "hover:bg-gray-800";
  const mobileCardBg = isLight ? "bg-white" : "bg-gray-800";

  const getStatusBadge = (status) => {
    if (status === "Pending") return "badge badge-warning";
    if (status === "Accepted") return "badge badge-success";
    return "badge badge-error";
  };

  // ============================
  // DATA & HANDLERS
  // ============================
  const axiosSecure = useAxiosSecure();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/staff");
      setStaffList(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleStatusChange = async (staffEmail, action) => {
    try {
      if (action === "accept") {
        await axiosSecure.patch(`/staff/${staffEmail}`, { status: "Accepted" });
        await axiosSecure.patch(`/users/${staffEmail}/role`, { role: "staff" });
        Swal.fire("Success", "Staff approved successfully!", "success");
      } else if (action === "reject") {
        await axiosSecure.patch(`/staff/${staffEmail}`, { status: "Rejected" });
        Swal.fire("Rejected", "Staff application rejected!", "info");
      }
      fetchStaff();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  if (loading) return <IssuesTableSkeleton />;

  return (
    <div className="p-4 md:p-6">
      <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${titleClass}`}>
        Staff Management
      </h2>

      {/* =======================
          DESKTOP TABLE (md+)
      ======================= */}
      <div className={`hidden md:block overflow-x-auto rounded-xl shadow ${tableBg}`}>
        <table className={`w-full border ${tableBorder}`}>
          <thead className={tableHeaderBg}>
            <tr>
              {["Name", "Email", "Phone", "Region", "District", "Experience", "Status", "Actions"].map((h) => (
                <th key={h} className={`border ${tableBorder} p-3 text-left ${titleClass}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {staffList.length === 0 ? (
              <tr>
                <td colSpan={8} className={`text-center p-6 ${textClass}`}>
                  No staff found.
                </td>
              </tr>
            ) : (
              staffList.map((staff) => (
                <tr key={staff.email} className={`${rowHoverBg} transition ${textClass}`}>
                  <td className={`border ${tableBorder} p-3 font-medium ${titleClass}`}>
                    {staff.name}
                  </td>
                  <td className={`border ${tableBorder} p-3`}>{staff.email}</td>
                  <td className={`border ${tableBorder} p-3`}>{staff.phone}</td>
                  <td className={`border ${tableBorder} p-3`}>{staff.region}</td>
                  <td className={`border ${tableBorder} p-3`}>{staff.district}</td>
                  <td className={`border ${tableBorder} p-3`}>{staff.experience} yrs</td>
                  <td className={`border ${tableBorder} p-3`}>
                    <span className={getStatusBadge(staff.status)}>
                      {staff.status}
                    </span>
                  </td>
                  <td className={`border ${tableBorder} p-3`}>
                    <div className="flex gap-2 flex-wrap">
                      {staff.status === "Pending" ? (
                        <>
                          <button
                            className="btn btn-success btn-xs text-white"
                            onClick={() => handleStatusChange(staff.email, "accept")}
                          >
                            Accept
                          </button>
                          <button
                            className="btn btn-error btn-xs text-white"
                            onClick={() => handleStatusChange(staff.email, "reject")}
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className={`text-xs italic ${textClass}`}>
                          {staff.status}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* =======================
          MOBILE CARDS (sm)
      ======================= */}
      <div className="md:hidden space-y-4">
        {staffList.length === 0 ? (
          <p className={`text-center py-10 ${textClass}`}>No staff found.</p>
        ) : (
          staffList.map((staff) => (
            <div
              key={staff.email}
              className={`rounded-xl border ${tableBorder} p-4 shadow ${mobileCardBg} space-y-2`}
            >
              <div className="flex justify-between items-start">
                <h3 className={`font-semibold text-lg ${titleClass}`}>
                  {staff.name}
                </h3>
                <span className={getStatusBadge(staff.status)}>
                  {staff.status}
                </span>
              </div>

              <p className={`text-sm ${textClass}`}>
                <span className="font-medium">Email:</span> {staff.email}
              </p>
              <p className={`text-sm ${textClass}`}>
                <span className="font-medium">Phone:</span> {staff.phone}
              </p>
              <p className={`text-sm ${textClass}`}>
                <span className="font-medium">Region:</span> {staff.region}
              </p>
              <p className={`text-sm ${textClass}`}>
                <span className="font-medium">District:</span> {staff.district}
              </p>
              <p className={`text-sm ${textClass}`}>
                <span className="font-medium">Experience:</span> {staff.experience} yrs
              </p>

              {staff.status === "Pending" && (
                <div className="flex gap-2 pt-2">
                  <button
                    className="btn btn-success btn-sm flex-1 text-white"
                    onClick={() => handleStatusChange(staff.email, "accept")}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-error btn-sm flex-1 text-white"
                    onClick={() => handleStatusChange(staff.email, "reject")}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StaffManagement;
