import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import LoadingPage from "../LoadingPage";
import IssuesTableSkeleton from "../IssuesTableSkeleton ";

const PatmentLogs = () => {
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

  // Fetch payment logs
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: async () => (await axiosSecure.get("/admin/payments")).data,
  });

  if (isLoading) return <IssuesTableSkeleton />;

  return (
    <div className="p-4 md:p-6">
      <h2 className={`text-3xl font-bold mb-6 ${titleClass}`}>Payment Logs</h2>

      <div className={`overflow-x-auto shadow-lg rounded-xl ${tableBg}`}>
        <table className="w-full min-w-[700px]">
          <thead className={tableHeaderBg}>
            <tr className={titleClass}>
              {[
                "#",
                "User",
                "Email",
                "Amount",
                "Method",
                "Transaction ID",
                "Status",
                "Date",
              ].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-sm font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className={textClass}>
            {payments.map((payment, index) => (
              <tr
                key={payment._id}
                className={`${tableRowHover} border-b border-gray-200`}
              >
                <td className="px-4 py-2">{index + 1}</td>

                <td className="px-4 py-2 font-medium">
                  {payment.userName || "N/A"}
                </td>

                <td className="px-4 py-2">{payment.email}</td>

                <td className={`px-4 py-2 font-semibold ${titleClass}`}>
                  {payment.amount.toLocaleString()} tk
                </td>

                <td className="px-4 py-2">
                  <span className="badge badge-outline text-sm">
                    {payment.method || "Online"}
                  </span>
                </td>

                <td className="px-4 py-2 text-sm break-all">
                  {payment.transactionId}
                </td>

                <td className="px-4 py-2">
                  {payment.paymentStatus === "paid" ? (
                    <span className="px-3 py-1 text-white text-xs rounded-full font-semibold bg-green-500">
                      Success
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-white text-xs rounded-full font-semibold bg-red-500">
                      Failed
                    </span>
                  )}
                </td>

                <td className="px-4 py-2 text-sm">
                  {new Date(payment.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {payments.length === 0 && (
          <p className={`text-center p-6 ${textClass}`}>
            No payment records found.
          </p>
        )}
      </div>
    </div>
  );
};

export default PatmentLogs;
