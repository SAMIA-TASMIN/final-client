import React from "react";

const LoadingPage = () => {
  const theme = localStorage.getItem("theme") || "civicLight";

  const bgClass = theme === "civicLight" ? "bg-gray-100" : "bg-gray-900";
  const titleColorClass =
    theme === "civicLight" ? "text-green-700" : "text-green-400";
  const infoTextColorClass =
    theme === "civicLight" ? "text-gray-600" : "text-gray-400";
  const spinnerColorClass =
    theme === "civicLight" ? "border-green-600" : "border-green-400";
  const leafColorClass =
    theme === "civicLight" ? "text-green-500" : "text-green-300";

  return (
    <div
      className={`h-screen flex py-22 flex-col justify-center items-center ${bgClass} text-center relative overflow-hidden`}
    >
      {/* Floating Leaves */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`animate-bounce absolute top-10 left-1/4 ${leafColorClass} text-4xl`}
        >
          🍃
        </div>
        <div
          className={`animate-pulse absolute top-1/3 right-1/4 ${leafColorClass} text-3xl opacity-75`}
        >
          🌱
        </div>
        <div
          className={`animate-bounce absolute bottom-20 left-1/3 ${leafColorClass} text-5xl`}
        >
          🍀
        </div>
      </div>

      {/* Spinner */}
      <div
        className={`animate-spin rounded-full h-20 w-20 border-t-4 ${spinnerColorClass} border-solid mb-6`}
      ></div>

      {/* Text */}
      <h2 className={`text-xl font-semibold ${titleColorClass}`}>
        CivicConnect is preparing your experience...
      </h2>
      <p className={`${infoTextColorClass} mt-2`}>
        Please hold on while we connect you to the community.
      </p>
    </div>
  );
};

export default LoadingPage;
