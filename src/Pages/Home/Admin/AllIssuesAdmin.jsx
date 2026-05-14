

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useRole from "../../../Hooks/useRole";
import Swal from "sweetalert2";
import { AssignModal } from "../Modal/AssignModal";
import IssuesTableSkeleton from "../IssuesTableSkeleton ";

const AllIssuesAdmin = () => {
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
  const titleClass = isLight ? "text-gray-900" : "text-gray-100";
  const textClass = isLight ? "text-gray-700" : "text-gray-300";
  const tableHeaderBg = isLight ? "bg-gray-100" : "bg-gray-800";
  const tableBg = isLight ? "bg-white" : "bg-gray-900";
  const tableBorder = isLight ? "border-gray-200" : "border-gray-700";
  const rowHoverBg = isLight ? "hover:bg-gray-50" : "hover:bg-gray-800";
  const mobileCardBg = isLight ? "bg-white" : "bg-gray-800";

  const axiosSecure = useAxiosSecure();
  const [assignIssue, setAssignIssue] = useState(null);
  const [reassignIssue, setReassignIssue] = useState(null);
  const { role, roleLoading } = useRole();

  const {
    data = { issues: [] },
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["admin-issues"],
    enabled: !roleLoading && role === "admin",
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/issues");
      return res.data;
    },
  });

  // ============================
  // MUTATIONS
  // ============================
  const assignMutation = useMutation({
    mutationFn: async ({ id, staffEmail, staffName }) =>
      axiosSecure.post(`/admin/issues/${id}/assign`, { staffEmail, staffName }),
    onSuccess: () => {
      refetch();
      Swal.fire("Assigned!", "Staff assigned successfully.", "success");
    },
    onError: (err) =>
      Swal.fire("Error", err.response?.data?.message || err.message, "error"),
  });

  const reassignMutation = useMutation({
    mutationFn: async ({ id, staffEmail, staffName }) =>
      axiosSecure.patch(`/issues/${id}/reassign`, { staffEmail, staffName }),
    onSuccess: () => {
      refetch();
      Swal.fire("Reassigned!", "Staff reassigned successfully.", "success");
    },
    onError: (err) =>
      Swal.fire("Error", err.response?.data?.message || err.message, "error"),
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status, note }) =>
      axiosSecure.post(`/issues/${id}/status`, { status, note }),
    onSuccess: (_, { status }) => {
      refetch();
      Swal.fire(
        status === "Resolved" ? "Resolved!" : "Closed!",
        `Issue marked as ${status}.`,
        "success"
      );
    },
    onError: (err) =>
      Swal.fire("Error", err.response?.data?.message || err.message, "error"),
  });

  // ============================
  // HANDLERS
  // ============================
  const handleReject = async (id) => {
    const { isConfirmed, value: reason } = await Swal.fire({
      title: "Reject Issue",
      input: "text",
      inputPlaceholder: "Enter reason (optional)...",
      showCancelButton: true,
      confirmButtonText: "Reject",
      confirmButtonColor: "#ef4444",
    });
    if (!isConfirmed) return;
    try {
      await axiosSecure.post(`/admin/issues/${id}/reject`, {
        reason: reason || "Rejected by admin",
      });
      Swal.fire("Rejected!", "Issue has been rejected.", "success");
      refetch();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    }
  };

  const handleResolve = async (id) => {
    const result = await Swal.fire({
      title: "Mark as Resolved?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Resolve",
      confirmButtonColor: "#22c55e",
    });
    if (!result.isConfirmed) return;
    statusMutation.mutate({ id, status: "Resolved", note: "Resolved by admin" });
  };

  const handleClose = async (id) => {
    const result = await Swal.fire({
      title: "Close this issue?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Close",
      confirmButtonColor: "#6b7280",
    });
    if (!result.isConfirmed) return;
    statusMutation.mutate({ id, status: "Closed", note: "Closed by admin" });
  };

  // ============================
  // BADGES
  // ============================
  const getStatusBadge = (status) => {
    const map = {
      Pending: "badge badge-warning",
      "In-Progress": "badge badge-info",
      Resolved: "badge badge-success",
      Closed: "badge badge-error",
    };
    return map[status] || "badge badge-ghost";
  };

  // ============================
  // ACTION BUTTONS — inline style দিয়ে color force করা হয়েছে
  // DaisyUI override এর কারণে bg কাজ না করলেও style সবসময় কাজ করে
  // ============================
  const btnBase = {
    border: "none",
    borderRadius: "6px",
    padding: "4px 10px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    color: "#fff",
    whiteSpace: "nowrap",
  };

  const btnStyles = {
    assign:   { ...btnBase, backgroundColor: "#f59e0b" }, // amber
    reject:   { ...btnBase, backgroundColor: "#ef4444" }, // red
    reassign: { ...btnBase, backgroundColor: "#3b82f6" }, // blue
    resolve:  { ...btnBase, backgroundColor: "#22c55e" }, // green
    close:    { ...btnBase, backgroundColor: "#6b7280" }, // gray
  };

  const renderActions = (issue) => {
    const { _id, status, assignedTo } = issue;

    if (status === "Pending") {
      return (
        <>
          {!assignedTo && (
            <button style={btnStyles.assign} onClick={() => setAssignIssue(issue)}>
              Assign
            </button>
          )}
          <button style={btnStyles.reject} onClick={() => handleReject(_id)}>
            Reject
          </button>
        </>
      );
    }

    if (status === "In-Progress") {
      return (
        <>
          <button style={btnStyles.reassign} onClick={() => setReassignIssue(issue)}>
            Reassign
          </button>
          <button style={btnStyles.resolve} onClick={() => handleResolve(_id)}>
            Resolve
          </button>
        </>
      );
    }

    if (status === "Resolved") {
      return (
        <button style={btnStyles.close} onClick={() => handleClose(_id)}>
          Close
        </button>
      );
    }

    return (
      <span style={{ fontSize: "12px", opacity: 0.4, fontStyle: "italic" }}>—</span>
    );
  };

  if (roleLoading || isLoading) return <IssuesTableSkeleton />;

  return (
    <div className="p-4 md:p-6">
      <h2 className={`text-2xl font-bold mb-4 ${titleClass}`}>All Issues</h2>

      {data.issues.length === 0 ? (
        <p className={`text-center py-10 ${textClass}`}>No issues found.</p>
      ) : (
        <>
          {/* ========================
              DESKTOP TABLE (md+)
          ======================== */}
          <div className={`hidden md:block overflow-x-auto shadow rounded-xl ${tableBg}`}>
            <table className="w-full border-collapse">
              <thead>
                <tr className={tableHeaderBg}>
                  {["Title", "Location", "Category", "Status", "Priority", "Assigned Staff", "Actions"].map((h) => (
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
                {data.issues.map((issue) => (
                  <tr key={issue._id} className={`${rowHoverBg} transition-colors`}>
                    <td className={`px-4 py-3 border ${tableBorder} font-medium text-sm ${titleClass}`}>
                      {issue.title}
                    </td>
                    <td className={`px-4 py-3 border ${tableBorder} text-sm ${textClass}`}>
                      {issue.reporterDistrict}
                    </td>
                    <td className={`px-4 py-3 border ${tableBorder} text-sm ${textClass}`}>
                      {issue.category}
                    </td>
                    <td className={`px-4 py-3 border ${tableBorder}`}>
                      <span className={getStatusBadge(issue.status)}>
                        {issue.status}
                      </span>
                    </td>
                    <td className={`px-4 py-3 border ${tableBorder}`}>
                      <span className={issue.priority === "High" ? "badge badge-error badge-outline" : "badge badge-ghost badge-outline"}>
                        {issue.priority}
                      </span>
                    </td>
                    <td className={`px-4 py-3 border ${tableBorder} text-sm ${textClass}`}>
                      {issue.assignedTo?.email || (
                        <span className="italic opacity-40">Unassigned</span>
                      )}
                    </td>
                    <td className={`px-4 py-3 border ${tableBorder}`}>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                        {renderActions(issue)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ========================
              MOBILE CARDS (sm)
          ======================== */}
          <div className="md:hidden space-y-4">
            {data.issues.map((issue) => (
              <div
                key={issue._id}
                className={`rounded-xl border ${tableBorder} p-4 shadow ${mobileCardBg} space-y-2`}
              >
                {/* Header */}
                <div className="flex justify-between items-start gap-2">
                  <h3 className={`font-semibold text-base leading-snug ${titleClass}`}>
                    {issue.title}
                  </h3>
                  <span className={`${getStatusBadge(issue.status)} shrink-0`}>
                    {issue.status}
                  </span>
                </div>

                {/* Info rows */}
                <p className={`text-sm ${textClass}`}>
                  <span className="font-medium">Location:</span> {issue.reporterDistrict}
                </p>
                <p className={`text-sm ${textClass}`}>
                  <span className="font-medium">Category:</span> {issue.category}
                </p>
                <p className={`text-sm ${textClass}`}>
                  <span className="font-medium">Priority:</span>{" "}
                  <span className={issue.priority === "High" ? "badge badge-error badge-outline badge-sm" : "badge badge-ghost badge-outline badge-sm"}>
                    {issue.priority}
                  </span>
                </p>
                <p className={`text-sm ${textClass}`}>
                  <span className="font-medium">Staff:</span>{" "}
                  {issue.assignedTo?.email || <span className="italic opacity-40">Unassigned</span>}
                </p>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", paddingTop: "8px" }}>
                  {renderActions(issue)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Assign Modal */}
      {assignIssue && (
        <AssignModal
          issue={assignIssue}
          onClose={() => setAssignIssue(null)}
          onAssign={async (staffEmail, staffName) => {
            await assignMutation.mutateAsync({
              id: assignIssue._id,
              staffEmail,
              staffName,
            });
            setAssignIssue(null);
          }}
        />
      )}

      {/* Reassign Modal */}
      {reassignIssue && (
        <AssignModal
          issue={reassignIssue}
          onClose={() => setReassignIssue(null)}
          onAssign={async (staffEmail, staffName) => {
            await reassignMutation.mutateAsync({
              id: reassignIssue._id,
              staffEmail,
              staffName,
            });
            setReassignIssue(null);
          }}
        />
      )}
    </div>
  );
};

export default AllIssuesAdmin;