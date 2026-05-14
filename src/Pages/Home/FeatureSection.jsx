import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

const FeatureSection = () => {
  const features = [
    "Report public issues instantly",
    "Track issue progress in real-time",
    "Admin verification & assignment",
    "Image upload support",
    "Secure user authentication",
    "View resolved issues on dashboard",
  ];

  // 1. Initialize local theme state
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "civicLight"
  );

  // 2. Add event listener to react to global theme changes instantly
  useEffect(() => {
    const handleThemeChange = () => {
      const newTheme = localStorage.getItem("theme") || "civicLight";
      // Only update state and re-render if the theme actually changed
      if (newTheme !== theme) {
        setTheme(newTheme);
      }
    };

    // Listen for localStorage changes
    window.addEventListener("storage", handleThemeChange);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("storage", handleThemeChange);
    };
  }, [theme]); // Depend on theme so the check is current

  // 3. MANUAL CLASS CALCULATION
  const titleClass = theme === "civicLight" ? "text-gray-800" : "text-gray-100";
  const textClass =
    theme === "civicLight" ? "text-slate-700" : "text-slate-200";
  const cardBorderClass =
    theme === "civicLight" ? "border-slate-200" : "border-slate-800";
  const cardBgClass = theme === "civicLight" ? "bg-gray-200" : "bg-gray-900";
  const cardBgClass1 = theme === "civicLight" ? "bg-white" : "bg-gray-900";

  return (
    <section className={`${cardBgClass} max-w-7xl mx-auto px-4 py-16`}>
      {/* Using calculated class for the title color */}
      <h2 className={`text-3xl font-semibold ${titleClass} text-center mb-12`}>
        Features
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <div
            key={idx}
            // Using calculated classes for card styling
            className={`${cardBgClass1} border ${cardBorderClass}
                                     rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col items-center space-y-4`}
          >
            {/* The 'text-primary' uses your DaisyUI theme variable and updates automatically */}
            <CheckCircle className="text-primary w-10 h-10" />

            {/* Using calculated class for feature text color */}
            <p className={`${textClass} font-medium text-center`}>{feature}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
