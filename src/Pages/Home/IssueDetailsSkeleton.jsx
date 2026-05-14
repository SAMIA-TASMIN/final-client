import React from "react";

const IssueDetailsSkeleton = () => {
  return (
    <div className="max-w-full py-22 mx-auto px-4 animate-pulse">
      {/* Back Button */}
      <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>

      {/* Main Card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg p-6 space-y-6">
        {/* Image Skeleton */}
        <div className="w-full h-80 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>

        {/* Title + Badges */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="h-8 w-2/3 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="flex gap-2">
            <div className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            <div className="h-8 w-32 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-5 w-full bg-gray-300 dark:bg-gray-700 rounded"
            ></div>
          ))}
        </div>

        {/* Description */}
        <div>
          <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-11/12 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-10/12 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-4">
          <div className="h-10 w-28 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-10 w-36 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Timeline */}
        <div className="mt-6">
          <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetailsSkeleton;
