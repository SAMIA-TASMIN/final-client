import React, { useState, useEffect } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import LoadingPage from "../LoadingPage";
import IssuesTableSkeleton from "../IssuesTableSkeleton ";

// Define the staff payment log data structure
// This assumes your backend returns objects like this:
// { staffName, email, amount, date, paymentMethod, status }

const StaffPaymentLog = () => {
  const axiosSecure = useAxiosSecure();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch Payment Data
  useEffect(() => {
    const fetchPaymentLogs = async () => {
      try {
        const response = await axiosSecure.get("/staff/payments/logs");
        setPayments(response.data);
      } catch (err) {
        console.error("Failed to fetch payment logs:", err);
        setError("Staff Payment logs coming soon.");
        Swal.fire("Staff Payment logs coming soon.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentLogs();
  }, [axiosSecure]);

  if (loading) {
    return <IssuesTableSkeleton />;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No payment logs found for staff.
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        💰 Staff Payment Logs
      </h2>

      <div className="overflow-x-auto">
        <table className="table w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Staff Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-center">Amount</th>
              <th className="py-3 px-6 text-center">Date</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Method</th>
            </tr>
          </thead>

          <tbody className="text-gray-600 text-sm font-light">
            {payments.map((payment, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {payment.staffName || "N/A"}
                </td>
                <td className="py-3 px-6 text-left">{payment.email}</td>
                <td className="py-3 px-6 text-center font-semibold">
                  ${payment.amount.toFixed(2)}
                </td>
                <td className="py-3 px-6 text-center">
                  {new Date(payment.date).toLocaleDateString()}
                </td>
                <td className="py-3 px-6 text-center">
                  <span
                    className={`py-1 px-3 rounded-full text-xs font-semibold ${
                      payment.status === "Paid"
                        ? "bg-green-200 text-green-600"
                        : payment.status === "Pending"
                        ? "bg-yellow-200 text-yellow-600"
                        : "bg-red-200 text-red-600"
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="py-3 px-6 text-center">
                  {payment.paymentMethod || "Transfer"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffPaymentLog;
