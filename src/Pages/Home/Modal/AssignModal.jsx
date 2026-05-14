// import React, { useState } from "react";
// import useAxiosSecure from "../../../Hooks/useAxiosSecure"; 
// import { useQuery } from "@tanstack/react-query";

// export function AssignModal({ issue, onClose, onAssign }) {
//   console.log(issue);
//   const axiosSecure = useAxiosSecure();

//   const { data: staff = [] } = useQuery({
//     queryKey: ["staff-list"],
//     queryFn: async () => {
//       const res = await axiosSecure.get("/staff"); // get all staff
//       return res.data;
//     },
//   });

//   // Filter staff by reporter's district
//   const filteredStaff = staff.filter(
//     (s) => s.district === issue.reporterDistrict && s.status === "Accepted"
//   );

//   const [selected, setSelected] = useState("");

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
//       <div className="bg-white p-6 rounded w-full max-w-md">
//         <h3 className="text-lg font-bold mb-3">
//           Assign Staff to: {issue.title}
//         </h3>
//         <select
//           className="select w-full mb-3"
//           value={selected}
//           onChange={(e) => setSelected(e.target.value)}
//         >
//           <option value="">Select staff</option>
//           {filteredStaff.map((s) => (
//             <option key={s.email} value={s.email}>
//               {s.displayName || s.email} ({s.district})
//             </option>
//           ))}
//         </select>
//         <div className="flex justify-end gap-2">
//           <button onClick={onClose} className="btn">
//             Cancel
//           </button>
//           <button
//             onClick={() => {
//               const staffObj = filteredStaff.find((s) => s.email === selected);
//               onAssign(selected, staffObj?.displayName || selected);
//             }}
//             className="btn btn-primary"
//             disabled={!selected}
//           >
//             Assign
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

export function AssignModal({ issue, onClose, onAssign }) {
  const axiosSecure = useAxiosSecure();

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "civicLight"
  );
  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem("theme") || "civicLight");
    };
    window.addEventListener("storage", handleThemeChange);
    return () => window.removeEventListener("storage", handleThemeChange);
  }, []);
  const isLight = theme === "civicLight";

  const { data: staff = [], isLoading } = useQuery({
    queryKey: ["staff-list"],
    queryFn: async () => {
      const res = await axiosSecure.get("/staff");
      return res.data;
    },
  });

  // Filter by district AND Accepted status
  const filteredStaff = staff.filter(
    (s) =>
      s.district === issue.reporterDistrict &&
      s.status === "Accepted"
  );

  const [selected, setSelected] = useState("");

  const handleAssign = () => {
    if (!selected) return;
    const staffObj = filteredStaff.find((s) => s.email === selected);
    // use name field (backend uses 'name', not 'displayName')
    onAssign(selected, staffObj?.name || staffObj?.displayName || selected);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div
        className={`w-full max-w-md rounded-xl shadow-xl p-6 ${
          isLight ? "bg-white text-gray-900" : "bg-gray-800 text-gray-100"
        }`}
      >
        <h3 className="text-lg font-bold mb-1">Assign Staff</h3>
        <p className={`text-sm mb-4 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
          Issue: <span className="font-medium">{issue.title}</span>
        </p>
        <p className={`text-sm mb-3 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
          District:{" "}
          <span className="font-medium">{issue.reporterDistrict}</span>
        </p>

        {isLoading ? (
          <p className="text-sm text-center py-4">Loading staff...</p>
        ) : filteredStaff.length === 0 ? (
          <div
            className={`text-sm text-center py-4 rounded-lg mb-4 ${
              isLight ? "bg-yellow-50 text-yellow-700" : "bg-yellow-900/30 text-yellow-300"
            }`}
          >
            No accepted staff available in{" "}
            <strong>{issue.reporterDistrict}</strong> district.
          </div>
        ) : (
          <select
            className={`select select-bordered w-full mb-4 ${
              isLight ? "" : "bg-gray-700 text-gray-100 border-gray-600"
            }`}
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">-- Select a staff member --</option>
            {filteredStaff.map((s) => (
              <option key={s.email} value={s.email}>
                {s.name || s.displayName || s.email} — {s.district}
              </option>
            ))}
          </select>
        )}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <button
            onClick={handleAssign}
            className="btn btn-primary"
            disabled={!selected || filteredStaff.length === 0}
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}