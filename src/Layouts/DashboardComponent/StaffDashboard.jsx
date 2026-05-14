import React, { useEffect, useState } from "react"; // Import useState and useEffect
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import LoadingPage from "../../Pages/Home/LoadingPage";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import StatCard from "../../Pages/Home/Staff/StarCard";

const StaffDashboard = () => {
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
  const chartBg = isLight ? "bg-white" : "bg-gray-800";
  const titleClass = isLight ? "text-blue-700" : "text-blue-700";

  // Note: The PieChart itself handles colors via the COLORS array, but the Tooltip and surrounding text need theme awareness.
  const tooltipContentStyle = isLight
    ? { backgroundColor: "#fff", border: "1px solid #ccc" }
    : {
        backgroundColor: "#374151",
        border: "1px solid #4b5563",
        color: "#fff",
      };

  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data = {}, isLoading } = useQuery({
    queryKey: ["staff-dashboard", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/staff/${user.email}`);
      return res.data;
    },
  });

  if (isLoading) return <LoadingPage />;

  // Ensure values are numbers before charting
  const chartData = [
    { name: "Pending", value: Number(data.pending) || 0 },
    { name: "In-Progress", value: Number(data.inProgress) || 0 },
    { name: "Working", value: Number(data.working) || 0 },
    { name: "Resolved", value: Number(data.resolved) || 0 },
  ].filter((item) => item.value > 0);

  const COLORS = ["#facc15", "#38bdf8", "#fb7185", "#4ade80"];

  return (
    <div className="space-y-8 py-8 md:py-20">
      <h2 className={`text-2xl font-bold ${titleClass}`}>Staff Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Assigned Issues" value={data.totalAssigned} />
        <StatCard title="Resolved Issues" value={data.resolved} />
        <StatCard title="Today's Tasks" value={data.todayTasks} />
        <StatCard title="Pending Issues" value={data.pending} />
      </div>

      {/* Chart */}
      <div className={`${chartBg} p-6 rounded-xl shadow`}>
        <h3 className={`text-lg font-bold mb-4 ${titleClass}`}>
          Issue Status Overview
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              // Added key to avoid potential re-render issues in some environments
              key={theme}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipContentStyle} />
            {/* Add Legend for better context, especially in dark mode */}
            {/* This uses the default recharts legend component */}
            {/* <Legend layout="horizontal" align="center" verticalAlign="bottom" /> */}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StaffDashboard;
