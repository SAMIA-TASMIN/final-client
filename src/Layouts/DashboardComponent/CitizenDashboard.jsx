// import React, { useEffect, useState } from "react"; // Import useEffect and useState
// import { useQuery } from "@tanstack/react-query";
// import useAuth from "../../Hooks/useAuth";
// import useAxiosSecure from "../../Hooks/useAxiosSecure";
// import { Navigate } from "react-router-dom";
// import { PieChart, Pie, Cell, Tooltip, Legend, } from "recharts";
// import LoadingPage from "../../Pages/Home/LoadingPage";

// const CitizenDashboard = () => {
//   // ============================
//   // THEME STATE & LISTENER
//   // ============================
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

//   // ============================
//   // THEME-AWARE CLASS CALCULATION
//   // ============================
//   const isLight = theme === "civicLight";
//   const containerBg = isLight ? "bg-gray-50" : "bg-gray-900";
//   const mainTitleClass = isLight ? "text-primary" : "text-blue-400";
//   const cardBgClass = isLight ? "bg-white" : "bg-gray-800";
//   const cardTitleClass = isLight ? "text-gray-500" : "text-gray-300";
//   const cardValueClass = isLight ? "text-gray-900" : "text-gray-100";
//   const chartTitleClass = isLight ? "text-gray-900" : "text-gray-100";

//   // Recharts Tooltip styles (inline styles needed for Recharts components)
//   const tooltipContentStyle = isLight
//     ? { backgroundColor: "#fff", border: "1px solid #ccc" }
//     : {
//         backgroundColor: "#374151",
//         border: "1px solid #4b5563",
//         color: "#fff",
//       };

//   // Define theme-aware CARD_CLASSES
//   const CARD_CLASSES = `${cardBgClass} shadow-md rounded-lg p-6 text-center border ${
//     isLight ? "border-gray-200" : "border-gray-700"
//   }`;

//   const { user } = useAuth();
//   const axiosSecure = useAxiosSecure();

//   // Fetch dashboard stats
//   const { data: stats = {}, isLoading } = useQuery({
//     queryKey: ["citizen-dashboard", user?.email],
//     queryFn: async () => {
//       const res = await axiosSecure.get(`/dashboard/citizen/${user.email}`);
//       return res.data;
//     },
//     enabled: !!user?.email,
//   });

//   if (!user) return <Navigate to="/login" />;

//   if (user?.blocked) {
//     return (
//       <div
//         className={`p-10 text-center ${
//           isLight ? "text-red-600" : "text-red-400"
//         } ${containerBg}`}
//       >
//         <h2 className="text-3xl font-bold mb-4">Account Blocked</h2>
//         <p>
//           Your account has been blocked by admin. Please contact the authorities
//           for assistance.
//         </p>
//       </div>
//     );
//   }

//   if (isLoading) return <LoadingPage />;

//   const chartData = [
//     { name: "Pending", value: stats.pending || 0 },
//     { name: "In Progress", value: stats.inProgress || 0 },
//     { name: "Resolved", value: stats.resolved || 0 },
//   ].filter((item) => item.value > 0); // Filter out zero values for a cleaner chart

//   const COLORS = ["#FBBF24", "#3B82F6", "#10B981"]; // Yellow, Blue, Green

//   return (
//     <div className={`p-6 space-y-6 min-h-screen ${containerBg}`}>
//       <h1 className={`text-3xl font-bold ${mainTitleClass}`}>
//         Citizen Dashboard
//       </h1>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div className={CARD_CLASSES}>
//           <h3 className={cardTitleClass}>Total Issues Submitted</h3>
//           <p className={`text-2xl font-bold ${cardValueClass}`}>
//             {stats.totalIssues || 0}
//           </p>
//         </div>
//         <div className={CARD_CLASSES}>
//           <h3 className={cardTitleClass}>Pending Issues</h3>
//           <p className={`text-2xl font-bold ${cardValueClass}`}>
//             {stats.pending || 0}
//           </p>
//         </div>
//         <div className={CARD_CLASSES}>
//           <h3 className={cardTitleClass}>In Progress</h3>
//           <p className={`text-2xl font-bold ${cardValueClass}`}>
//             {stats.inProgress || 0}
//           </p>
//         </div>
//         <div className={CARD_CLASSES}>
//           <h3 className={cardTitleClass}>Resolved Issues</h3>
//           <p className={`text-2xl font-bold ${cardValueClass}`}>
//             {stats.resolved || 0}
//           </p>
//         </div>
//         <div className={CARD_CLASSES}>
//           <h3 className={cardTitleClass}>Total Payments</h3>
//           <p className={`text-2xl font-bold ${cardValueClass}`}>
//             {stats.totalPayments || 0} tk
//           </p>
//         </div>
//       </div>

//       {/* Pie Chart */}
//       <div
//         className={`${cardBgClass} shadow-md rounded-lg p-6 flex flex-col items-center border ${
//           isLight ? "border-gray-200" : "border-gray-700"
//         }`}
//       >
//         <h2 className={`text-xl font-bold mb-6 text-center ${chartTitleClass}`}>
//           Issue Status Distribution
//         </h2>
//         {chartData.length > 0 ? (
//           <PieChart width={450} height={350}>
//             <Pie
//               data={chartData}
//               dataKey="value"
//               nameKey="name"
//               cx="50%"
//               cy="50%"
//               outerRadius={120}
//               label
//               // Key added to force re-render if theme changes mid-session, ensuring chart visibility
//               key={theme}
//             >
//               {chartData.map((entry, index) => (
//                 <Cell
//                   key={`cell-${index}`}
//                   fill={COLORS[index % COLORS.length]}
//                 />
//               ))}
//             </Pie>
//             <Tooltip contentStyle={tooltipContentStyle} />
//             <Legend
//               verticalAlign="bottom"
//               height={36}
//               wrapperStyle={isLight ? {} : { color: "#ffffff" }}
//             />
//           </PieChart>
//         ) : (
//           <p className={textClass}>No issue data available for charting.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CitizenDashboard;
import React, { useEffect, useState } from "react"; // Import useEffect and useState
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { Navigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import LoadingPage from "../../Pages/Home/LoadingPage";

const CitizenDashboard = () => {
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

  // ============================
  // THEME-AWARE CLASS CALCULATION
  // ============================
  const isLight = theme === "civicLight";
  const containerBg = isLight ? "bg-gray-50" : "bg-gray-900";
  const mainTitleClass = isLight ? "text-primary" : "text-blue-400";
  const cardBgClass = isLight ? "bg-white" : "bg-gray-800";
  const cardTitleClass = isLight ? "text-gray-500" : "text-gray-300";
  const cardValueClass = isLight ? "text-gray-900" : "text-gray-100";
  const chartTitleClass = isLight ? "text-gray-900" : "text-gray-100";
  const textClass = isLight ? "text-gray-500" : "text-gray-400";

  // Recharts Tooltip styles (inline styles needed for Recharts components)
  const tooltipContentStyle = isLight
    ? { backgroundColor: "#fff", border: "1px solid #ccc" }
    : {
        backgroundColor: "#374151",
        border: "1px solid #4b5563",
        color: "#fff",
      };

  // Define theme-aware CARD_CLASSES
  const CARD_CLASSES = `${cardBgClass} shadow-md rounded-lg p-6 text-center border ${
    isLight ? "border-gray-200" : "border-gray-700"
  }`;

  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch dashboard stats
  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["citizen-dashboard", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/dashboard/citizen/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (!user) return <Navigate to="/login" />;

  if (user?.blocked) {
    return (
      <div
        className={`p-10 text-center ${
          isLight ? "text-red-600" : "text-red-400"
        } ${containerBg}`}
      >
        <h2 className="text-3xl font-bold mb-4">Account Blocked</h2>
        <p>
          Your account has been blocked by admin. Please contact the authorities
          for assistance.
        </p>
      </div>
    );
  }

  if (isLoading) return <LoadingPage />;

  const chartData = [
    { name: "Pending", value: stats.pending || 0 },
    { name: "In Progress", value: stats.inProgress || 0 },
    { name: "Resolved", value: stats.resolved || 0 },
  ].filter((item) => item.value > 0); // Filter out zero values for a cleaner chart

  const COLORS = ["#FBBF24", "#3B82F6", "#10B981"]; // Yellow, Blue, Green

  return (
    <div className={`p-6 space-y-6 min-h-screen ${containerBg}`}>
      <h1 className={`text-3xl font-bold ${mainTitleClass}`}>
        Citizen Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={CARD_CLASSES}>
          <h3 className={cardTitleClass}>Total Issues Submitted</h3>
          <p className={`text-2xl font-bold ${cardValueClass}`}>
            {stats.totalIssues || 0}
          </p>
        </div>
        <div className={CARD_CLASSES}>
          <h3 className={cardTitleClass}>Pending Issues</h3>
          <p className={`text-2xl font-bold ${cardValueClass}`}>
            {stats.pending || 0}
          </p>
        </div>
        <div className={CARD_CLASSES}>
          <h3 className={cardTitleClass}>In Progress</h3>
          <p className={`text-2xl font-bold ${cardValueClass}`}>
            {stats.inProgress || 0}
          </p>
        </div>
        <div className={CARD_CLASSES}>
          <h3 className={cardTitleClass}>Resolved Issues</h3>
          <p className={`text-2xl font-bold ${cardValueClass}`}>
            {stats.resolved || 0}
          </p>
        </div>
        <div className={CARD_CLASSES}>
          <h3 className={cardTitleClass}>Total Payments</h3>
          <p className={`text-2xl font-bold ${cardValueClass}`}>
            {stats.totalPayments || 0} tk
          </p>
        </div>
      </div>

      {/* Pie Chart */}
      <div
        className={`${cardBgClass} shadow-md rounded-lg p-6 flex flex-col items-center border ${
          isLight ? "border-gray-200" : "border-gray-700"
        }`}
      >
        <h2 className={`text-xl font-bold mb-6 text-center ${chartTitleClass}`}>
          Issue Status Distribution
        </h2>
        {chartData.length > 0 ? (
          <PieChart width={450} height={350}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
              // Key added to force re-render if theme changes mid-session, ensuring chart visibility
              key={theme}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipContentStyle} />
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={isLight ? {} : { color: "#ffffff" }}
            />
          </PieChart>
        ) : (
          <p className={textClass}>No issue data available for charting.</p>
        )}
      </div>
    </div>
  );
};

export default CitizenDashboard;