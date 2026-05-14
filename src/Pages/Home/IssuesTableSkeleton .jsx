import React from "react";

const IssuesTableSkeleton = ({ rows = 6 }) => {
  return (
    <div className="p-6 animate-pulse">
      {/* Title Skeleton */}
      <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="table-auto w-full border border-gray-200 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              {[
                "Title",
                "Location",
                "Category",
                "Status",
                "Priority",
                "Staff",
                "Actions",
              ].map((item, i) => (
                <th key={i} className="px-4 py-3">
                  <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: 7 }).map((_, j) => (
                  <td key={j} className="px-4 py-3">
                    <div className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IssuesTableSkeleton;
