import React, { useEffect, useState } from "react";
import { Upload, Search, CheckCircle } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      title: "Report an Issue",
      desc: "Submit issue details with photos and location.",
      icon: <Upload size={40} className="text-primary" />,
    },
    {
      title: "Admin Reviews",
      desc: "Admin verifies, assigns staff, and updates the status.",
      icon: <Search size={40} className="text-accent" />,
    },
    {
      title: "Issue Resolved",
      desc: "Users get updated when the issue is fixed.",
      icon: <CheckCircle size={40} className="text-secondary" />,
    },
  ];

  // 1. Initialize local theme state
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "civicLight"
  );

  // 2. Add event listener to react to global theme changes instantly
  useEffect(() => {
    const handleThemeChange = () => {
      const newTheme = localStorage.getItem("theme") || "civicLight";
      if (newTheme !== theme) {
        setTheme(newTheme);
      }
    };

    window.addEventListener("storage", handleThemeChange);

    return () => {
      window.removeEventListener("storage", handleThemeChange);
    };
  }, [theme]);

  // 3. MANUAL CLASS CALCULATION (Matching LatestResolvedIssues structure)

  // Backgrounds & Borders
  // Note: If LatestResolvedIssues uses a wrapper outside the section for background,
  // the section itself should use 'bg-base-100' or similar for light theme.
  const sectionBgClass = theme === "civicLight" ? "" : "bg-gray-950"; // Assume no specific bg for light, or a dark one for dark mode.
  const cardBgClass = theme === "civicLight" ? "bg-white" : "bg-gray-900";
  const cardBorderClass =
    theme === "civicLight" ? "border-gray-200" : "border-gray-700";

  // Text Colors (Matching LatestResolvedIssues' title/info/desc classes)
  const titleClass = theme === "civicLight" ? "text-gray-800" : "text-gray-100"; // Used for H2 section title
  const cardTitleClass = // Used for H3 step title
    theme === "civicLight" ? "text-gray-800" : "text-gray-100";
  const cardDescClass = // Used for P step description
    theme === "civicLight" ? "text-gray-500" : "text-gray-400";

  return (
    // Apply calculated section background
    <section className={`py-16 ${sectionBgClass}`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Apply calculated title class */}
        <h2
          className={`text-3xl font-semibold ${titleClass} text-center mb-12`}
        >
          How it Works
        </h2>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-4">
        {steps.map((step, i) => (
          <div
            key={i}
            // Apply calculated classes for card styling
            className={`${cardBgClass} border ${cardBorderClass} 
                                     rounded-xl p-6 shadow-sm hover:shadow-md transition space-y-4 text-center`}
          >
            <div className="flex justify-center mb-3">{step.icon}</div>
            {/* Apply calculated class for card title */}
            <h3 className={`text-xl font-semibold ${cardTitleClass}`}>
              {step.title}
            </h3>
            {/* Apply calculated class for card description */}
            <p className={`text-sm ${cardDescClass}`}>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
