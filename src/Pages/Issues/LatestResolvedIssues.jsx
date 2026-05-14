import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingPage from "../Home/LoadingPage";
import IssueCardSkeleton from "../Home/IssueCardSkeleton";
import useAxios from "../../Hooks/useAxios";

const LatestResolvedIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "civicLight"
  );

  const axiosSecure = useAxiosSecure();
  const axiosInstance = useAxios();

  useEffect(() => {
    const handleThemeChange = () => {
      const newTheme = localStorage.getItem("theme") || "civicLight";
      // Only update state and re-render if the theme actually changed
      if (newTheme !== theme) {
        setTheme(newTheme);
      }
    };

    window.addEventListener("storage", handleThemeChange);

    return () => {
      window.removeEventListener("storage", handleThemeChange);
    };
  }, [theme]); // Include 'theme' to ensure 'handleThemeChange' uses the latest value

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/issues?status=Resolved&limit=8");
        setIssues(res.data?.issues || []);
      } catch (err) {
        console.error("Failed to fetch issues:", err);
        setIssues([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const resolvedIssues = issues
    .filter((i) => i.status === "Resolved")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  if (loading) return <IssueCardSkeleton />;

  // 3. RE-INTRODUCE MANUAL CLASS CALCULATION
  const sectionTitleClass =
    theme === "civicLight" ? "text-gray-800" : "text-blue-700";
  const sectionDescClass =
    theme === "civicLight" ? "text-gray-500" : "text-gray-400";
  const cardBgClass = theme === "civicLight" ? "bg-white" : "bg-gray-900";
  const cardBorderClass =
    theme === "civicLight" ? "border-gray-200" : "border-gray-700";
  const titleClass = theme === "civicLight" ? "text-gray-800" : "text-gray-100";
  const descClass = theme === "civicLight" ? "text-gray-500" : "text-gray-400";
  const infoTextClass =
    theme === "civicLight" ? "text-gray-600" : "text-gray-400";
  const resolvedBadgeClass =
    theme === "civicLight"
      ? "bg-teal-100 text-teal-700"
      : "bg-teal-700 text-teal-100";

  return (
    <section className={`max-w-7xl mx-auto ${cardBgClass} px-4 py-12`}>
      <div className="mb-8">
        {/* Using manual classes */}
        <h2 className={`text-3xl font-semibold ${sectionTitleClass}`}>
          Latest Resolved Issues
        </h2>
        <p className={`${sectionDescClass} mt-1`}>
          Recently resolved civic issues in your community
        </p>
      </div>

      {resolvedIssues.length === 0 ? (
        <p className={`text-center ${sectionDescClass}`}>
          No resolved issues yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resolvedIssues.map((issue) => (
            <div
              key={issue._id}
              // Using manual classes
              className={`${cardBgClass} border ${cardBorderClass} rounded-xl p-5 shadow-sm hover:shadow-md transition space-y-4`}
            >
              {issue.image && (
                <img
                  src={issue.image}
                  alt={issue.title}
                  className="w-full h-40 object-cover rounded-xl"
                />
              )}

              <div className="space-y-1">
                <h3 className={`text-lg font-semibold ${titleClass}`}>
                  {issue.title}
                </h3>
                <p className={`text-sm ${descClass} line-clamp-2`}>
                  {issue.description}
                </p>
              </div>

              <div className={`text-sm ${infoTextClass} space-y-1`}>
                <p>
                  <span className="font-medium">Category:</span>{" "}
                  {issue.category}
                </p>
                <p>
                  <span className="font-medium">Location:</span>{" "}
                  {issue.location}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3">
                <Link
                  to={`/viewDetails/${issue._id}`}
                  className="text-sm text-blue-600 font-medium hover:underline"
                >
                  View Details →
                </Link>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${resolvedBadgeClass}`}
                >
                  Resolved
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default LatestResolvedIssues;
